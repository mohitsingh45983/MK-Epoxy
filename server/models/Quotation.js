const mongoose = require('mongoose')

const quotationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    service: {
      type: String,
      required: true,
    },
    area: {
      type: String,
      required: true,
    },
    estimate: {
      type: Number,
    },
    message: {
      type: String,
      default: '',
    },
    images: [
      {
        type: String,
      },
    ],
    status: {
      type: String,
      enum: ['pending', 'contacted', 'quoted', 'completed'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Quotation', quotationSchema)
