const mongoose = require('mongoose')

const servicePricingSchema = new mongoose.Schema(
  {
    serviceName: {
      type: String,
      required: true,
      unique: true,
    },
    pricePerSqft: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('ServicePricing', servicePricingSchema)

