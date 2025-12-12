import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiCheckCircle,
  FiShield,
  FiClock,
  FiTrendingUp,
  FiArrowRight,
} from 'react-icons/fi'
import axios from 'axios'

const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await axios.get('/api/services')
        if (res.data.success) {
          setServices(res.data.services || [])
        } else {
          setError(res.data.message || 'Failed to load services')
        }
      } catch (err) {
        const message =
          err.response?.data?.message ||
          'Unable to load services. Please try again later.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return (
    <div className="pt-20">
      <section className="section-padding bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
              Our Services
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto px-4">
              Each service has a dedicated page with detailed scope, benefits,
              pricing, and process steps.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom">
          {loading && (
            <div className="text-center text-gray-600 dark:text-gray-400 py-12">
              Loading services...
            </div>
          )}

          {error && !loading && (
            <div className="text-center text-red-600 dark:text-red-400 py-12">
              {error}
            </div>
          )}

          {!loading && !error && services.length === 0 && (
            <div className="text-center text-gray-600 dark:text-gray-400 py-12">
              No services have been published yet. Please check back soon.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service._id || service.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden flex flex-col"
              >
                {service.coverImageUrl && (
                  <img
                    src={service.coverImageUrl}
                    alt={service.title}
                    className="w-full h-56 object-cover"
                  />
                )}

                <div className="p-6 flex flex-col gap-4 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">
                        {service.title}
                      </h2>
                      {service.shortDescription && (
                        <p className="text-gray-600 dark:text-gray-400">
                          {service.shortDescription}
                        </p>
                      )}
                    </div>
                    {service.ratePerSqft !== undefined && (
                      <div className="bg-primary-50 dark:bg-gray-800 text-primary-700 dark:text-primary-300 px-3 py-2 rounded-lg text-sm font-semibold inline-flex items-center space-x-1">
                        <FiTrendingUp />
                        <span>₹{service.ratePerSqft}/sqft</span>
                      </div>
                    )}
                  </div>

                  {service.benefits?.length > 0 && (
                    <div>
                      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                        <FiCheckCircle className="mr-2" />
                        Key benefits
                      </h3>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {service.benefits.slice(0, 4).map((benefit, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-600 dark:text-gray-400 flex items-start space-x-2"
                          >
                            <span className="text-primary-500 mt-1">•</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                      <FiClock />
                      <span>Detailed process on next page</span>
                    </div>
                    <Link
                      to={`/services/${service.slug}`}
                      className="inline-flex items-center text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                    >
                      View details
                      <FiArrowRight className="ml-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

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
            <Link
              to="/quotation"
              className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-primary-50 transition-colors inline-block"
            >
              Get Free Quotation
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Services

