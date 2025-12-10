const express = require('express')
const ServicePricing = require('../models/ServicePricing')
const ContactInfo = require('../models/ContactInfo')
const Review = require('../models/Review')
const Admin = require('../models/Admin')
const jwt = require('jsonwebtoken')

const router = express.Router()

// Middleware to verify admin token
const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    )
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

// Get contact information
router.get('/contact', verifyAdmin, async (req, res) => {
  try {
    const contactInfo = await ContactInfo.getContactInfo()
    res.json({ success: true, contactInfo })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contact information',
      error: error.message,
    })
  }
})

// Update contact information
router.put('/contact', verifyAdmin, async (req, res) => {
  try {
    let contactInfo = await ContactInfo.findOne()

    if (!contactInfo) {
      contactInfo = new ContactInfo(req.body)
      await contactInfo.save()
    } else {
      Object.assign(contactInfo, req.body)
      await contactInfo.save()
    }

    res.json({
      success: true,
      message: 'Contact information updated successfully',
      contactInfo,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating contact information',
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

// Get all reviews (admin only - includes unverified)
router.get('/reviews', verifyAdmin, async (req, res) => {
  try {
    const {
      verified,
      search,
      rating,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query

    let query = {}

    // Filter by verification status
    if (verified === 'true') {
      query.verified = true
    } else if (verified === 'false') {
      query.verified = false
    }

    // Filter by rating
    if (rating) {
      query.rating = parseInt(rating)
    }

    // Search by name, email, or text
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { text: { $regex: search, $options: 'i' } },
      ]
    }

    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1

    const reviews = await Review.find(query).sort(sortOptions).limit(200)

    // Format dates
    const formattedReviews = reviews.map((review) => ({
      _id: review._id,
      name: review.name,
      rating: review.rating,
      text: review.text,
      email: review.email,
      phone: review.phone,
      verified: review.verified,
      source: review.source,
      imageUrl: review.imageUrl,
      imagePublicId: review.imagePublicId,
      createdAt: review.createdAt,
      date: formatReviewDate(review.createdAt),
    }))

    res.json({ success: true, reviews: formattedReviews })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message,
    })
  }
})

// Verify/Unverify a review
router.put('/reviews/:id/verify', verifyAdmin, async (req, res) => {
  try {
    const { verified } = req.body
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { verified: verified === true || verified === 'true' },
      { new: true }
    )

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      })
    }

    res.json({
      success: true,
      message: `Review ${verified ? 'verified' : 'unverified'} successfully`,
      review,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating review',
      error: error.message,
    })
  }
})

// Delete a review
router.delete('/reviews/:id', verifyAdmin, async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id)

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      })
    }

    res.json({
      success: true,
      message: 'Review deleted successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message,
    })
  }
})

// Helper function to format review date
function formatReviewDate(date) {
  const now = new Date()
  const reviewDate = new Date(date)
  const diffTime = Math.abs(now - reviewDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  }
  if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? 'month' : 'months'} ago`
  }
  const years = Math.floor(diffDays / 365)
  return `${years} ${years === 1 ? 'year' : 'years'} ago`
}

module.exports = router
