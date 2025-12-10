const express = require('express')
const ContactInfo = require('../models/ContactInfo')

const router = express.Router()

// Get contact information (public endpoint)
router.get('/', async (req, res) => {
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

module.exports = router

