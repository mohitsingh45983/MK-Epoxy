const express = require('express')
const Review = require('../models/Review')

const router = express.Router()

// Get all reviews (only verified ones for public)
router.get('/', async (req, res) => {
  try {
    const { verified } = req.query
    let query = {}

    // If not admin, only show verified reviews
    if (verified !== 'all') {
      query.verified = true
    }

    const reviews = await Review.find(query).sort({ createdAt: -1 }).limit(100)

    // Format dates for display
    const formattedReviews = reviews.map((review) => ({
      _id: review._id,
      name: review.name,
      rating: review.rating,
      text: review.text,
      email: review.email,
      phone: review.phone,
      verified: review.verified,
      source: review.source,
      date: formatDate(review.createdAt),
      createdAt: review.createdAt,
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

// Helper function to format date
function formatDate(date) {
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

// Create a review
router.post('/', async (req, res) => {
  try {
    const { name, rating, text, email, phone, source } = req.body

    // Validate required fields
    if (!name || !rating || !text) {
      return res.status(400).json({
        success: false,
        message: 'Name, rating, and review text are required',
      })
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      })
    }

    const review = new Review({
      name,
      rating: parseInt(rating),
      text,
      email: email || '',
      phone: phone || '',
      source: source || 'website',
      verified: false, // Reviews need to be verified by admin
    })

    await review.save()
    res.status(201).json({
      success: true,
      message:
        'Review submitted successfully. It will be displayed after verification.',
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

// Get average rating and stats
router.get('/stats', async (req, res) => {
  try {
    const reviews = await Review.find({ verified: true })
    const totalReviews = reviews.length

    if (totalReviews === 0) {
      return res.json({
        success: true,
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
      })
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = (totalRating / totalReviews).toFixed(1)

    const ratingDistribution = {
      1: reviews.filter((r) => r.rating === 1).length,
      2: reviews.filter((r) => r.rating === 2).length,
      3: reviews.filter((r) => r.rating === 3).length,
      4: reviews.filter((r) => r.rating === 4).length,
      5: reviews.filter((r) => r.rating === 5).length,
    }

    res.json({
      success: true,
      averageRating: parseFloat(averageRating),
      totalReviews,
      ratingDistribution,
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
