const express = require('express')
const ServicePricing = require('../models/ServicePricing')
const Admin = require('../models/Admin')
const jwt = require('jsonwebtoken')

const router = express.Router()

// Middleware to verify admin token
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key')
    req.adminId = decoded.adminId
    next()
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    const admin = await Admin.findOne({ username })
    if (!admin) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' })
    }

    const isPasswordValid = await admin.comparePassword(password)
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { adminId: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    )

    res.json({
      success: true,
      token,
      admin: { username: admin.username, email: admin.email },
    })
  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({ success: false, message: 'Login failed' })
  }
})

// Get all service pricing
router.get('/pricing', verifyAdmin, async (req, res) => {
  try {
    const pricing = await ServicePricing.find({ isActive: true }).sort({
      serviceName: 1,
    })
    res.json({ success: true, pricing })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching pricing',
      error: error.message,
    })
  }
})

// Update service pricing
router.put('/pricing/:id', verifyAdmin, async (req, res) => {
  try {
    const { pricePerSqft, isActive } = req.body

    const pricing = await ServicePricing.findByIdAndUpdate(
      req.params.id,
      { pricePerSqft, isActive },
      { new: true, runValidators: true }
    )

    if (!pricing) {
      return res
        .status(404)
        .json({ success: false, message: 'Service pricing not found' })
    }

    res.json({
      success: true,
      message: 'Pricing updated successfully',
      pricing,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating pricing',
      error: error.message,
    })
  }
})

// Create new service pricing
router.post('/pricing', verifyAdmin, async (req, res) => {
  try {
    const { serviceName, pricePerSqft } = req.body

    const pricing = new ServicePricing({
      serviceName,
      pricePerSqft,
    })

    await pricing.save()

    res.status(201).json({
      success: true,
      message: 'Service pricing created successfully',
      pricing,
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Service already exists',
      })
    }
    res.status(500).json({
      success: false,
      message: 'Error creating pricing',
      error: error.message,
    })
  }
})

// Initialize default pricing (public endpoint - run once to set up initial data)
router.post('/init-pricing', async (req, res) => {
  try {
    const defaultPricing = [
      { serviceName: 'Epoxy Flooring', pricePerSqft: 80 },
      { serviceName: 'Waterproofing', pricePerSqft: 60 },
      { serviceName: 'PU Flooring', pricePerSqft: 100 },
      { serviceName: 'Industrial Coating', pricePerSqft: 120 },
      { serviceName: 'Crack Filling', pricePerSqft: 40 },
      { serviceName: 'Expansion Joint Treatment', pricePerSqft: 50 },
    ]

    for (const service of defaultPricing) {
      await ServicePricing.findOneAndUpdate(
        { serviceName: service.serviceName },
        service,
        { upsert: true, new: true }
      )
    }

    res.json({
      success: true,
      message: 'Default pricing initialized',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error initializing pricing',
      error: error.message,
    })
  }
})

module.exports = router

