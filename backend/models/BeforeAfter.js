const mongoose = require('mongoose')

const beforeAfterSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    description: { type: String, trim: true },
    beforeUrl: { type: String, required: true },
    beforePublicId: { type: String, required: true },
    afterUrl: { type: String, required: true },
    afterPublicId: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
)

module.exports = mongoose.model('BeforeAfter', beforeAfterSchema)
