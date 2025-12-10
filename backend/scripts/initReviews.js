const mongoose = require('mongoose')
require('dotenv').config()

const Review = require('../models/Review')

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/mk_epoxy'

const sampleReviews = [
  {
    name: 'Rajesh Kumar',
    rating: 5,
    text: 'Excellent work! The epoxy flooring in our warehouse looks amazing and has been holding up perfectly even after heavy use. Highly recommended!',
    email: 'rajesh.kumar@example.com',
    phone: '+91 98765 43210',
    verified: true,
    source: 'website',
  },
  {
    name: 'Priya Sharma',
    rating: 5,
    text: 'MK Epoxy did an outstanding job waterproofing our terrace. No leaks even during heavy monsoon. Professional team and great service.',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43211',
    verified: true,
    source: 'website',
  },
  {
    name: 'Amit Patel',
    rating: 5,
    text: 'Best decision we made! The PU flooring in our factory is durable and easy to maintain. The team was punctual and completed on time.',
    email: 'amit.patel@example.com',
    phone: '+91 98765 43212',
    verified: true,
    source: 'website',
  },
  {
    name: 'Sneha Reddy',
    rating: 5,
    text: 'Very satisfied with the industrial coating work. The surface is smooth, professional, and exactly as promised. Great value for money.',
    email: 'sneha.reddy@example.com',
    phone: '+91 98765 43213',
    verified: true,
    source: 'website',
  },
  {
    name: 'Vikram Singh',
    rating: 5,
    text: 'Professional service from start to finish. They explained everything clearly and delivered exactly what was promised. Will definitely use again.',
    email: 'vikram.singh@example.com',
    phone: '+91 98765 43214',
    verified: true,
    source: 'website',
  },
  {
    name: 'Anjali Mehta',
    rating: 5,
    text: 'The crack filling work was done perfectly. Our floor looks brand new now. Thank you MK Epoxy for the excellent service!',
    email: 'anjali.mehta@example.com',
    phone: '+91 98765 43215',
    verified: true,
    source: 'website',
  },
  {
    name: 'Rahul Desai',
    rating: 5,
    text: 'Amazing quality and service! The epoxy flooring in our showroom has received so many compliments. Worth every rupee spent.',
    email: 'rahul.desai@example.com',
    phone: '+91 98765 43216',
    verified: true,
    source: 'website',
  },
  {
    name: 'Kavita Nair',
    rating: 5,
    text: 'Waterproofing work on our basement was excellent. No issues even after heavy rains. Highly professional team and great customer service.',
    email: 'kavita.nair@example.com',
    phone: '+91 98765 43217',
    verified: true,
    source: 'website',
  },
  {
    name: 'Mohit Agarwal',
    rating: 4,
    text: 'Good service overall. The work was completed on time and the quality is satisfactory. Minor issues were resolved quickly.',
    email: 'mohit.agarwal@example.com',
    phone: '+91 98765 43218',
    verified: true,
    source: 'website',
  },
  {
    name: 'Deepak Joshi',
    rating: 5,
    text: 'Outstanding work! The expansion joint treatment has solved all our problems. The team was knowledgeable and professional throughout.',
    email: 'deepak.joshi@example.com',
    phone: '+91 98765 43219',
    verified: true,
    source: 'website',
  },
  {
    name: 'Sunita Verma',
    rating: 5,
    text: 'Very happy with the waterproofing service. Our bathroom and kitchen are now completely protected. Great attention to detail.',
    email: 'sunita.verma@example.com',
    phone: '+91 98765 43220',
    verified: false,
    source: 'website',
  },
  {
    name: 'Arjun Malhotra',
    rating: 4,
    text: 'Good quality work. The epoxy flooring looks great and is easy to clean. Would recommend for commercial spaces.',
    email: 'arjun.malhotra@example.com',
    phone: '+91 98765 43221',
    verified: false,
    source: 'website',
  },
]

async function initReviews() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('MongoDB Connected')

    // Clear existing reviews (optional - comment out if you want to keep existing reviews)
    // await Review.deleteMany({})
    // console.log('Cleared existing reviews')

    // Insert sample reviews
    let addedCount = 0
    let skippedCount = 0

    for (const reviewData of sampleReviews) {
      try {
        // Check if review already exists (by name and text)
        const existing = await Review.findOne({
          name: reviewData.name,
          text: reviewData.text,
        })

        if (!existing) {
          const review = new Review(reviewData)
          await review.save()
          addedCount++
          console.log(`✓ Added review from ${reviewData.name}`)
        } else {
          skippedCount++
          console.log(`- Skipped duplicate review from ${reviewData.name}`)
        }
      } catch (error) {
        console.error(
          `Error adding review from ${reviewData.name}:`,
          error.message
        )
      }
    }

    console.log('\n' + '='.repeat(50))
    console.log('Review Initialization Complete!')
    console.log(`Added: ${addedCount} reviews`)
    console.log(`Skipped: ${skippedCount} reviews (duplicates)`)
    console.log('='.repeat(50))

    process.exit(0)
  } catch (error) {
    console.error('Error initializing reviews:', error)
    process.exit(1)
  }
}

initReviews()
