const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      trim: true,
      maxlength: 320,
    },
    description: {
      type: String,
      trim: true,
    },
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],
    processSteps: [
      {
        type: String,
        trim: true,
      },
    ],
    warranty: {
      type: String,
      trim: true,
    },
    ratePerSqft: {
      type: Number,
      min: 0,
    },
    coverImageUrl: String,
    coverImagePublicId: String,
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Service', serviceSchema)


