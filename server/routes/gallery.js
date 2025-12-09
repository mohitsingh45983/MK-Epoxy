const express = require('express')
const GalleryImage = require('../models/GalleryImage')
const BeforeAfter = require('../models/BeforeAfter')

const router = express.Router()

// Public: get gallery images and before/after
router.get('/', async (_req, res) => {
  try {
    const [images, beforeAfter] = await Promise.all([
      GalleryImage.find().sort({ createdAt: -1 }),
      BeforeAfter.find().sort({ createdAt: -1 }),
    ])

    res.json({ success: true, images, beforeAfter })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery data',
      error: error.message,
    })
  }
})

module.exports = router
