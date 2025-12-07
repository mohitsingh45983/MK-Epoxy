import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiUpload, FiCheckCircle, FiX } from 'react-icons/fi'
import axios from 'axios'

const Quotation = () => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    service: '',
    area: '',
    phone: '',
    email: '',
    message: '',
  })
  const [images, setImages] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [estimate, setEstimate] = useState(null)

  const services = [
    'Epoxy Flooring',
    'Waterproofing',
    'PU Flooring',
    'Industrial Coating',
    'Crack Filling',
    'Expansion Joint Treatment',
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    if (images.length + files.length > 5) {
      alert('Maximum 5 images allowed')
      return
    }
    setImages([...images, ...files])
  }

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const formDataToSend = new FormData()
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key])
      })
      images.forEach((image) => {
        formDataToSend.append('images', image)
      })

      const response = await axios.post('/api/quotation', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        setSubmitStatus('success')
        // Store estimate in state to display
        if (response.data.estimate) {
          setEstimate(response.data.estimate)
        }
        setFormData({
          name: '',
          location: '',
          service: '',
          area: '',
          phone: '',
          email: '',
          message: '',
        })
        setImages([])
      }
    } catch (error) {
      console.error('Error submitting quotation:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

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
              Get Your Free Quotation
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Fill out the form below and receive an estimate within 5 minutes
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quotation Form */}
      <section className="section-padding">
        <div className="container-custom max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 md:p-12"
          >
            {submitStatus === 'success' && (
              <div className="mb-6">
                <div className="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg flex items-center mb-4">
                  <FiCheckCircle className="mr-2 text-xl" />
                  <span>
                    Thank you! We've received your request. Here's your instant
                    estimate:
                  </span>
                </div>
                {estimate && (
                  <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-gray-800 dark:to-gray-700 p-6 rounded-lg border-2 border-primary-200 dark:border-primary-800">
                    <h3 className="text-2xl font-bold mb-4 text-center">
                      Instant Estimate
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Service:
                        </span>
                        <span className="font-semibold">
                          {estimate.service}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Area:
                        </span>
                        <span className="font-semibold">
                          {estimate.area} sqft
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Rate per sqft:
                        </span>
                        <span className="font-semibold">
                          ₹{estimate.basePricePerSqft}
                        </span>
                      </div>
                      <div className="flex justify-between border-t border-gray-300 dark:border-gray-600 pt-2">
                        <span className="text-gray-600 dark:text-gray-400">
                          Subtotal:
                        </span>
                        <span className="font-semibold">
                          ₹{estimate.subtotal.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          Overhead (10%):
                        </span>
                        <span className="font-semibold">
                          ₹{estimate.overhead.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">
                          GST (18%):
                        </span>
                        <span className="font-semibold">
                          ₹{estimate.gst.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between border-t-2 border-primary-600 dark:border-primary-400 pt-3 mt-3">
                        <span className="text-xl font-bold">
                          Total Estimate:
                        </span>
                        <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                          ₹{estimate.total.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 text-center">
                      * This is an approximate estimate. Final price may vary
                      based on site conditions and requirements.
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
                      We'll contact you within 5 minutes with a detailed
                      quotation.
                    </p>
                  </div>
                )}
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg flex items-center">
                <FiX className="mr-2 text-xl" />
                <span>
                  Something went wrong. Please try again or contact us directly.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-semibold mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold mb-2"
                  >
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="+91 73397 23912"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold mb-2"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-semibold mb-2"
                >
                  Location *
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="City, State"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="service"
                    className="block text-sm font-semibold mb-2"
                  >
                    Service Required *
                  </label>
                  <select
                    id="service"
                    name="service"
                    required
                    value={formData.service}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="area"
                    className="block text-sm font-semibold mb-2"
                  >
                    Area (sqft) *
                  </label>
                  <input
                    type="number"
                    id="area"
                    name="area"
                    required
                    min="1"
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
                    placeholder="1000"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-semibold mb-2"
                >
                  Additional Details
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows="4"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tell us more about your project requirements..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Upload Images (Max 5 images)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                  <input
                    type="file"
                    id="images"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="images"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <FiUpload className="text-4xl text-gray-400 mb-2" />
                    <span className="text-gray-600 dark:text-gray-400">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-sm text-gray-500 mt-1">
                      PNG, JPG, GIF up to 10MB each
                    </span>
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-4">
                    {images.map((image, index) => (
                      <div
                        key={index}
                        className="relative group rounded-lg overflow-hidden"
                      >
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <FiX />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Get Estimate'}
              </button>

              <p className="text-sm text-center text-gray-500 dark:text-gray-400">
                By submitting this form, you agree to our privacy policy. We'll
                contact you shortly with a detailed quotation.
              </p>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Quotation
