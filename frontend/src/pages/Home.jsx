import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPhone, FiFileText } from 'react-icons/fi'
import { FaWhatsapp as FaWhatsappSolid } from 'react-icons/fa'
import { FiCheckCircle, FiAward, FiUsers } from 'react-icons/fi'
import axios from 'axios'

const Home = () => {
  const [contactInfo, setContactInfo] = useState({
    phone: '+91 73397 23912',
    whatsapp: '917339723912',
  })
  const [services, setServices] = useState([])

  useEffect(() => {
    fetchContactInfo()
    fetchServices()
  }, [])

  const fetchContactInfo = async () => {
    try {
      const response = await axios.get('/api/contact-info')
      if (response.data.success) {
        setContactInfo(response.data.contactInfo)
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
    }
  }

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/services')
      if (response.data.success) {
        setServices(response.data.services || [])
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    }
  }

  const highlights = [
    {
      icon: <FiAward className="text-4xl" />,
      title: '10+ Years Experience',
      description:
        'Extensive expertise in epoxy flooring and waterproofing solutions',
    },
    {
      icon: <FiCheckCircle className="text-4xl" />,
      title: '100% Quality Guarantee',
      description: 'We stand behind our work with complete quality assurance',
    },
    {
      icon: <FiUsers className="text-4xl" />,
      title: 'Professional Team',
      description: 'Skilled craftsmen dedicated to delivering excellence',
    },
  ]

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-fixed"
          style={{
            backgroundImage: 'url(/gallery/IMG-20251207-WA0001.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container-custom text-center text-white px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="/gallery/logo.jpg"
              alt="MK Epoxy Logo"
              className="h-32 w-32 mx-auto mb-6 rounded-full object-cover shadow-2xl"
            />
            <h1 className="text-5xl md:text-7xl font-bold mb-4">MK Epoxy</h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Premium Waterproofing & Epoxy Flooring Solutions
            </p>
            <p className="text-lg md:text-xl mb-12 max-w-2xl mx-auto">
              Transforming spaces with durable, high-quality epoxy flooring and
              comprehensive waterproofing services
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap justify-center gap-4">
              <motion.a
                href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                className="btn-primary flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiPhone />
                <span>Call Now</span>
              </motion.a>
              <motion.a
                href={`https://wa.me/${contactInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaWhatsappSolid />
                <span>WhatsApp</span>
              </motion.a>
              <Link
                to="/quotation"
                className="btn-secondary flex items-center space-x-2"
              >
                <FiFileText />
                <span>Get Quotation</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </section>

      {/* Highlights Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Excellence in every project we undertake
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow text-center"
              >
                <div className="text-primary-600 dark:text-primary-400 mb-3 sm:mb-4 flex justify-center">
                  {highlight.icon}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">{highlight.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  {highlight.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Comprehensive solutions for all your flooring and waterproofing
              needs
            </p>
          </motion.div>

          {services.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-gray-400">
              Services are being added. Check back soon.
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.slice(0, 6).map((service, index) => (
                  <motion.div
                    key={service.slug}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg hover:shadow-xl transition-shadow"
                  >
                    <h3 className="text-xl font-semibold mb-2">
                      {service.title}
                    </h3>
                    {service.shortDescription && (
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 line-clamp-3">
                        {service.shortDescription}
                      </p>
                    )}
                    <Link
                      to={`/services/${service.slug}`}
                      className="text-primary-600 dark:text-primary-400 font-medium hover:underline inline-flex items-center space-x-1"
                    >
                      <span>Learn More</span>
                      <span>→</span>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link to="/services" className="btn-primary">
                  View All Services
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  )
}

export default Home
