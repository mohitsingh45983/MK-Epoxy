const mongoose = require('mongoose')
const ServicePricing = require('../models/ServicePricing')
require('dotenv').config()

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/mk_epoxy'

async function initPricing() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    const defaultPricing = [
      { serviceName: 'Epoxy Flooring', pricePerSqft: 80 },
      { serviceName: 'Waterproofing', pricePerSqft: 60 },
      { serviceName: 'PU Flooring', pricePerSqft: 100 },
      { serviceName: 'Industrial Coating', pricePerSqft: 120 },
      { serviceName: 'Crack Filling', pricePerSqft: 40 },
      { serviceName: 'Expansion Joint Treatment', pricePerSqft: 50 },
    ]

    for (const service of defaultPricing) {
      const existing = await ServicePricing.findOne({
        serviceName: service.serviceName,
      })

      if (!existing) {
        const pricing = new ServicePricing(service)
        await pricing.save()
        console.log(`Created pricing for: ${service.serviceName}`)
      } else {
        console.log(`Pricing already exists for: ${service.serviceName}`)
      }
    }

    console.log('Default pricing initialized successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Error initializing pricing:', error)
    process.exit(1)
  }
}

initPricing()

