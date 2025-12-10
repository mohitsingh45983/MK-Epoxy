const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    source: {
      type: String,
      enum: ['google', 'website', 'manual'],
      default: 'website',
    },
    imageUrl: {
      type: String,
    },
    imagePublicId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Review', reviewSchema)
