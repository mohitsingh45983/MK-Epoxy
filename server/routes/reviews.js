const express = require('express')
const Review = require('../models/Review')

const router = express.Router()

// Get all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).limit(50)
    res.json({ success: true, reviews })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message,
    })
  }
})

// Create a review
router.post('/', async (req, res) => {
  try {
    const { name, rating, text, email, source } = req.body

    const review = new Review({
      name,
      rating,
      text,
      email,
      source: source || 'website',
    })

    await review.save()
    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating review',
      error: error.message,
    })
  }
})

// Get average rating
router.get('/stats', async (req, res) => {
  try {
    const reviews = await Review.find()
    const totalReviews = reviews.length
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / totalReviews ||
      0

    res.json({
      success: true,
      averageRating: averageRating.toFixed(1),
      totalReviews,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching review stats',
      error: error.message,
    })
  }
})

module.exports = router

