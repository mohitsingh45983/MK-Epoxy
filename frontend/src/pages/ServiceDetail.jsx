import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiCheckCircle, FiClock, FiShield } from 'react-icons/fi'
import axios from 'axios'

const ServiceDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchService = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await axios.get(`/api/services/${slug}`)
        if (res.data.success) {
          setService(res.data.service)
        } else {
          setError(res.data.message || 'Unable to load service')
        }
      } catch (err) {
        const message =
          err.response?.data?.message ||
          'Service not found. Please return to services.'
        setError(message)
      } finally {
        setLoading(false)
      }
    }

    fetchService()
  }, [slug])

  if (loading) {
    return (
      <div className="pt-24 container-custom text-center">
        <p className="text-gray-600 dark:text-gray-400">Loading service...</p>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="pt-24 container-custom text-center space-y-4">
        <p className="text-lg text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={() => navigate('/services')}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <FiArrowLeft />
          <span>Back to Services</span>
        </button>
      </div>
    )
  }

  return (
    <div className="pt-20">
      <section className="section-padding bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
                {service.title}
              </h1>
              {service.shortDescription && (
                <p className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl">
                  {service.shortDescription}
                </p>
              )}
            </div>
            <Link
              to="/services"
              className="inline-flex items-center space-x-2 text-primary-700 dark:text-primary-300 font-semibold hover:underline"
            >
              <FiArrowLeft />
              <span>Back to Services</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-custom grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {service.coverImageUrl && (
              <motion.img
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                src={service.coverImageUrl}
                alt={service.title}
                className="w-full h-72 sm:h-96 object-cover rounded-2xl shadow-xl"
              />
            )}

            {service.description && (
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-3">Overview</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                  {service.description}
                </p>
              </div>
            )}

            {service.processSteps?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <FiClock className="mr-2 text-primary-500" />
                  Work Process
                </h3>
                <ol className="space-y-3 list-decimal list-inside text-gray-700 dark:text-gray-300">
                  {service.processSteps.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg space-y-3">
              <h3 className="text-xl font-semibold mb-2">Key Details</h3>
              {service.ratePerSqft !== undefined && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">
                    Rate per sqft
                  </span>
                  <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    ₹{service.ratePerSqft}
                  </span>
                </div>
              )}
              {service.warranty && (
                <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                  <FiShield className="text-primary-500" />
                  <span>Warranty: {service.warranty}</span>
                </div>
              )}
            </div>

            {service.benefits?.length > 0 && (
              <div className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold mb-3 flex items-center">
                  <FiCheckCircle className="mr-2 text-primary-500" />
                  Benefits
                </h3>
                <ul className="space-y-2">
                  {service.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <span className="text-primary-500">•</span>
                      <span className="text-gray-700 dark:text-gray-300">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-primary-600 text-white p-6 rounded-xl shadow-lg space-y-3">
              <h3 className="text-2xl font-bold">Ready to get started?</h3>
              <p className="text-primary-100">
                Request a free site visit and detailed quotation for {service.title}.
              </p>
              <Link
                to="/quotation"
                className="inline-flex items-center justify-center w-full bg-white text-primary-600 font-semibold py-3 px-4 rounded-lg hover:bg-primary-50 transition"
              >
                Get Free Quotation
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ServiceDetail


