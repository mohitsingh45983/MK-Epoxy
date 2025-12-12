const mongoose = require('mongoose')
const Service = require('../models/Service')
require('dotenv').config()

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/mk_epoxy'

const seedServices = [
  {
    title: 'Epoxy Flooring',
    slug: 'epoxy-flooring',
    shortDescription: 'Seamless, high-gloss floors ideal for industrial and commercial spaces.',
    description:
      'Epoxy flooring delivers a durable, chemical-resistant surface that is easy to maintain and looks premium. Suitable for factories, warehouses, retail outlets, and garages. We prepare the substrate, repair cracks, and apply multi-coat epoxy for a long-lasting finish.',
    benefits: [
      'High chemical and abrasion resistance',
      'Seamless, dust-free surface',
      'Easy to clean and maintain',
      'Wide range of colors and finishes',
    ],
    processSteps: [
      'Surface preparation and crack repair',
      'Primer application',
      'High-build epoxy coating',
      'Topcoat and curing',
    ],
    warranty: '1 year workmanship warranty',
    ratePerSqft: 80,
    order: 1,
    isActive: true,
  },
  {
    title: 'PU Flooring',
    slug: 'pu-flooring',
    shortDescription: 'Flexible, UV-resistant polyurethane floors for heavy-duty areas.',
    description:
      'PU flooring offers superior flexibility and UV resistance compared to standard epoxy. It is ideal for food processing units, parking decks, and outdoor applications where temperature changes and sunlight exposure are common.',
    benefits: [
      'UV-resistant and color stable',
      'Flexible under thermal movement',
      'Anti-skid finishes available',
      'Suitable for wet areas',
    ],
    processSteps: [
      'Substrate grinding and cleaning',
      'Primer and moisture barrier (if needed)',
      'PU body coat application',
      'Anti-skid or gloss topcoat',
    ],
    warranty: '1 year workmanship warranty',
    ratePerSqft: 100,
    order: 2,
    isActive: true,
  },
  {
    title: 'Waterproofing',
    slug: 'waterproofing',
    shortDescription: 'Leak-proof roofs, terraces, and wet areas with membrane and coating systems.',
    description:
      'We deploy membrane, acrylic, and PU-based waterproofing systems to stop seepage on roofs, bathrooms, balconies, and water tanks. Our team identifies the source, repairs cracks, and applies layered protection for long-term performance.',
    benefits: [
      'Stops seepage and dampness',
      'Protects concrete and plaster',
      'UV-stable topcoats available',
      'Suitable for roofs, bathrooms, tanks',
    ],
    processSteps: [
      'Leak source inspection',
      'Crack filling and surface preparation',
      'Primer and membrane / coating application',
      'Topcoat and curing',
    ],
    warranty: 'Up to 3 years based on system',
    ratePerSqft: 60,
    order: 3,
    isActive: true,
  },
  {
    title: 'Industrial Coating',
    slug: 'industrial-coating',
    shortDescription: 'Protective coatings for machinery, steel structures, and heavy-traffic floors.',
    description:
      'High-performance epoxy and PU coatings to protect steel and concrete assets from corrosion, impact, and abrasion. Ideal for plants, warehouses, and logistics hubs that demand long service life and quick turnaround.',
    benefits: [
      'Corrosion and abrasion protection',
      'Fast-curing options for quick handover',
      'Custom colors and markings',
      'Suitable for steel and concrete',
    ],
    processSteps: [
      'Surface preparation (blasting/grinding)',
      'Priming for adhesion and corrosion resistance',
      'High-build intermediate coat',
      'Topcoat for durability and finish',
    ],
    warranty: '1 year workmanship warranty',
    ratePerSqft: 120,
    order: 4,
    isActive: true,
  },
  {
    title: 'Crack Filling & Joint Treatment',
    slug: 'crack-filling-joint-treatment',
    shortDescription: 'Structural crack injection and expansion joint sealing for durable floors.',
    description:
      'We repair floor cracks using epoxy injection and flexible joint sealants to prevent water ingress and slab movement damage. This extends the life of concrete floors before coating or polishing.',
    benefits: [
      'Prevents moisture ingress',
      'Improves floor life before coating',
      'Flexible sealants for movement joints',
      'Compatible with epoxy/PU overlays',
    ],
    processSteps: [
      'Crack chasing and cleaning',
      'Epoxy injection or resin fill',
      'Backer rod installation (if needed)',
      'Sealant application and finishing',
    ],
    warranty: '6 months workmanship warranty',
    ratePerSqft: 40,
    order: 5,
    isActive: true,
  },
]

async function initServices() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    for (const data of seedServices) {
      const existing = await Service.findOne({ slug: data.slug })
      if (existing) {
        console.log(`Service already exists: ${data.title}`)
        continue
      }

      await Service.create(data)
      console.log(`Created service: ${data.title}`)
    }

    console.log('Default services initialized successfully.')
    process.exit(0)
  } catch (error) {
    console.error('Error initializing services:', error)
    process.exit(1)
  }
}

initServices()


