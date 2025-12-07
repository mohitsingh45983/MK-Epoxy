const mongoose = require('mongoose')

const contactInfoSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    whatsapp: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    alternateEmail: {
      type: String,
      default: '',
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      country: { type: String, default: 'India' },
    },
    workingHours: {
      weekdays: { type: String, default: 'Monday - Saturday: 9:00 AM - 7:00 PM' },
      weekend: { type: String, default: 'Sunday: Closed' },
    },
    socialMedia: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      linkedin: { type: String, default: '' },
    },
    googleMapsUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
)

// Ensure only one contact info document exists
contactInfoSchema.statics.getContactInfo = async function () {
  let contactInfo = await this.findOne()
  if (!contactInfo) {
    contactInfo = new this({
      phone: '+91 73397 23912',
      whatsapp: '917339723912',
      email: 'info@mkepoxy.com',
      alternateEmail: 'support@mkepoxy.com',
      address: {
        street: 'Your Business Address',
        city: 'City',
        state: 'State',
        pincode: 'PIN Code',
        country: 'India',
      },
      workingHours: {
        weekdays: 'Monday - Saturday: 9:00 AM - 7:00 PM',
        weekend: 'Sunday: Closed',
      },
    })
    await contactInfo.save()
  }
  return contactInfo
}

module.exports = mongoose.model('ContactInfo', contactInfoSchema)

