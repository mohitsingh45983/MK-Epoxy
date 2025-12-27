const express = require('express')
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Quotation = require('../models/Quotation')
const Service = require('../models/Service')
const nodemailer = require('nodemailer')

const router = express.Router()

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads')
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, 'quotation-' + uniqueSuffix + path.extname(file.originalname))
  },
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    )
    const mimetype = allowedTypes.test(file.mimetype)

    if (mimetype && extname) {
      return cb(null, true)
    } else {
      cb(new Error('Only image files are allowed'))
    }
  },
})

// Calculate quotation estimate using service rate
async function calculateEstimate(service, area) {
  const areaNum = parseFloat(area) || 0

  const serviceDoc = await Service.findOne({
    title: service,
    isActive: true,
  })

  const basePrice = serviceDoc?.ratePerSqft ?? 80
  const subtotal = areaNum * basePrice

  return {
    service,
    area: areaNum,
    basePricePerSqft: basePrice,
    subtotal: Math.round(subtotal),
    total: Math.round(subtotal),
    currency: 'INR',
  }
}

// Create quotation
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const { name, phone, email, location, service, area, message } = req.body

    const imagePaths = req.files
      ? req.files.map((file) => `/uploads/${file.filename}`)
      : []

    // Calculate estimate
    const estimate = await calculateEstimate(service, area)

    const quotation = new Quotation({
      name,
      phone,
      email,
      location,
      service,
      area,
      message,
      images: imagePaths,
      estimate: estimate.subtotal, // Store estimated total
    })

    await quotation.save()
    
    // Send email notification (optional)
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        })

        const mailOptions = {
          from: process.env.EMAIL_USER,      // owner@gmail.com
          to: process.env.ADMIN_EMAIL,        // owner@gmail.com
          replyTo: email,                     // customer's email
          subject: `New Quotation Request from ${name}`,
          html: `
            <h2>New Quotation Request</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>Service:</strong> ${service}</p>
            <p><strong>Area:</strong> ${area} sqft</p>
            <p><strong>Message:</strong> ${message || 'N/A'}</p>
          `,
        }
        await transporter.sendMail(mailOptions)
      } catch (emailError) {
        console.error('Email sending error:', emailError)
        // Don't fail the request if email fails
      }
    }

    res.status(201).json({
      success: true,
      message: 'Quotation request submitted successfully',
      quotationId: quotation._id,
      estimate: estimate, // Return estimate to frontend
    })
  } catch (error) {
    console.error('Error creating quotation:', error)
    res.status(500).json({
      success: false,
      message: 'Error submitting quotation request',
      error: error.message,
    })
  }
})

// Get all quotations (admin only - add authentication in production)
router.get('/', async (req, res) => {
  try {
    const quotations = await Quotation.find().sort({ createdAt: -1 })
    res.json({ success: true, quotations })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching quotations',
      error: error.message,
    })
  }
})

module.exports = router
