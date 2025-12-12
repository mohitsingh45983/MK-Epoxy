const express = require('express')
const Service = require('../models/Service')

const router = express.Router()

// Public: list active services
router.get('/', async (_req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .sort({ order: 1, title: 1 })
      .select(
        'title slug shortDescription ratePerSqft coverImageUrl benefits order'
      )
    res.json({ success: true, services })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message,
    })
  }
})

// Public: service detail by slug
router.get('/:slug', async (req, res) => {
  try {
    const service = await Service.findOne({
      slug: req.params.slug,
      isActive: true,
    })

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: 'Service not found' })
    }

    res.json({ success: true, service })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching service details',
      error: error.message,
    })
  }
})

module.exports = router


