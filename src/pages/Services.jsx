import { motion } from 'framer-motion'
import { FiCheckCircle, FiShield, FiClock, FiTrendingUp } from 'react-icons/fi'

const Services = () => {
  const services = [
    {
      title: 'Epoxy Flooring',
      description:
        'Durable, seamless, and aesthetically pleasing epoxy flooring solutions for residential, commercial, and industrial spaces.',
      benefits: [
        'High durability and resistance to chemicals',
        'Easy to clean and maintain',
        'Seamless, hygienic surface',
        'Wide range of colors and finishes',
        'Long-lasting protection',
      ],
      process: [
        'Surface preparation and cleaning',
        'Primer application',
        'Base coat installation',
        'Top coat with chosen finish',
        'Quality inspection and curing',
      ],
      warranty: '5-10 years warranty depending on usage',
      images: [
        '/gallery/IMG-20251207-WA0001.jpg',
        '/gallery/IMG-20251207-WA0002.jpg',
      ],
    },
    {
      title: 'Waterproofing',
      description:
        'Comprehensive waterproofing solutions for basements, terraces, tanks, bathrooms, and all areas prone to water damage.',
      benefits: [
        'Complete protection against water ingress',
        'Prevents structural damage',
        'Mold and mildew prevention',
        'Increases property value',
        'Long-term cost savings',
      ],
      process: [
        'Site assessment and problem identification',
        'Surface preparation',
        'Application of waterproofing membrane',
        'Sealing joints and cracks',
        'Final inspection and testing',
      ],
      warranty: '10-15 years warranty',
      images: [
        '/gallery/IMG-20251207-WA0003.jpg',
        '/gallery/IMG-20251207-WA0004.jpg',
      ],
    },
    {
      title: 'PU Flooring',
      description:
        'Polyurethane flooring systems offering superior performance for high-traffic areas and industrial applications.',
      benefits: [
        'Excellent abrasion resistance',
        'Flexible and crack-resistant',
        'UV stable and weather resistant',
        'Fast installation and curing',
        'Suitable for outdoor applications',
      ],
      process: [
        'Surface preparation',
        'Primer application',
        'PU base coat',
        'PU top coat',
        'Final inspection',
      ],
      warranty: '7-12 years warranty',
      images: [
        '/gallery/IMG-20251207-WA0005.jpg',
        '/gallery/IMG-20251207-WA0006.jpg',
      ],
    },
    {
      title: 'Industrial Coating',
      description:
        'Heavy-duty industrial coating solutions designed to withstand harsh environments and heavy machinery.',
      benefits: [
        'Extreme durability for industrial use',
        'Chemical and corrosion resistance',
        'Heavy load bearing capacity',
        'Temperature resistance',
        'Low maintenance requirements',
      ],
      process: [
        'Industrial surface preparation',
        'Specialized primer',
        'Industrial-grade base coat',
        'Protective top coat',
        'Quality assurance testing',
      ],
      warranty: '10-15 years warranty',
      images: [
        '/gallery/IMG-20251207-WA0007.jpg',
        '/gallery/IMG-20251207-WA0008.jpg',
      ],
    },
    {
      title: 'Crack Filling',
      description:
        'Professional crack filling services to repair and prevent further damage to floors and surfaces.',
      benefits: [
        'Prevents crack expansion',
        'Restores structural integrity',
        'Improves surface appearance',
        'Cost-effective solution',
        'Quick and efficient process',
      ],
      process: [
        'Crack assessment',
        'Cleaning and preparation',
        'Crack filling with specialized materials',
        'Smoothing and finishing',
        'Final inspection',
      ],
      warranty: '3-5 years warranty',
      images: [
        '/gallery/IMG-20251207-WA0009.jpg',
        '/gallery/IMG-20251207-WA0010.jpg',
      ],
    },
    {
      title: 'Expansion Joint Treatment',
      description:
        'Expert expansion joint treatment to accommodate thermal movement and prevent structural damage.',
      benefits: [
        'Prevents structural stress',
        'Accommodates thermal expansion',
        'Waterproof joint sealing',
        'Maintains surface integrity',
        'Long-lasting protection',
      ],
      process: [
        'Joint assessment',
        'Cleaning and preparation',
        'Joint filler application',
        'Sealant installation',
        'Quality check',
      ],
      warranty: '5-8 years warranty',
      images: [
        '/gallery/IMG-20251207-WA0011.jpg',
        '/gallery/IMG-20251207-WA0012.jpg',
      ],
    },
  ]

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="section-padding bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our Services
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Comprehensive solutions for all your flooring and waterproofing
              needs
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding">
        <div className="container-custom">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={`mb-16 ${
                index % 2 === 0 ? '' : 'lg:flex-row-reverse'
              } lg:flex items-center gap-12`}
            >
              <div
                className={`flex-1 ${
                  index % 2 === 0 ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {service.images.map((img, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={img}
                      alt={`${service.title} ${imgIndex + 1}`}
                      className="rounded-lg shadow-lg object-cover h-48 w-full"
                    />
                  ))}
                </div>
              </div>

              <div
                className={`flex-1 ${
                  index % 2 === 0 ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {service.title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                  {service.description}
                </p>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <FiCheckCircle className="text-primary-600 dark:text-primary-400 mr-2" />
                    Benefits
                  </h3>
                  <ul className="space-y-2">
                    {service.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-start">
                        <span className="text-primary-600 dark:text-primary-400 mr-2">
                          ✓
                        </span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-3 flex items-center">
                    <FiClock className="text-primary-600 dark:text-primary-400 mr-2" />
                    Work Process
                  </h3>
                  <ol className="space-y-2 list-decimal list-inside text-gray-600 dark:text-gray-400">
                    {service.process.map((step, stepIndex) => (
                      <li key={stepIndex}>{step}</li>
                    ))}
                  </ol>
                </div>

                <div className="bg-primary-50 dark:bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center">
                    <FiShield className="text-primary-600 dark:text-primary-400 text-2xl mr-3" />
                    <div>
                      <span className="font-semibold">Warranty: </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {service.warranty}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-primary-100">
              Contact us today for a free consultation and quotation
            </p>
            <a
              href="/quotation"
              className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-primary-50 transition-colors inline-block"
            >
              Get Free Quotation
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Services

