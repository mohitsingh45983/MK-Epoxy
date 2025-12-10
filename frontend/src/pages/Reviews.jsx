import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaStar } from 'react-icons/fa'
import { FiCheckCircle, FiX } from 'react-icons/fi'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import axios from 'axios'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const Reviews = () => {
  const [reviews, setReviews] = useState([])
  const [averageRating, setAverageRating] = useState(5.0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    rating: 5,
    text: '',
    image: null,
  })

  useEffect(() => {
    fetchReviews()
    fetchStats()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await axios.get('/api/reviews')
      if (response.data.success) {
        setReviews(response.data.reviews)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/reviews/stats')
      if (response.data.success) {
        setAverageRating(response.data.averageRating || 5.0)
        setTotalReviews(response.data.totalReviews || 0)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({
        ...formData,
        image: e.target.files?.[0] || null,
      })
      return
    }

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRatingClick = (rating) => {
    setFormData({
      ...formData,
      rating: rating,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitStatus(null)

    try {
      const payload = new FormData()
      payload.append('name', formData.name)
      payload.append('email', formData.email)
      payload.append('phone', formData.phone)
      payload.append('rating', formData.rating)
      payload.append('text', formData.text)
      if (formData.image) {
        payload.append('image', formData.image)
      }

      const response = await axios.post('/api/reviews', payload, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (response.data.success) {
        setSubmitStatus('success')
        setFormData({
          name: '',
          email: '',
          phone: '',
          rating: 5,
          text: '',
          image: null,
        })
        setShowForm(false)
        // Refresh reviews and stats
        fetchReviews()
        fetchStats()
      }
    } catch (error) {
      setSubmitStatus('error')
      console.error('Error submitting review:', error)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
      />
    ))
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
              Client Reviews
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              See what our satisfied clients have to say about our services
            </p>
          </motion.div>
        </div>
      </section>

      {/* Rating Summary */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 sm:p-8 md:p-12 max-w-4xl mx-auto text-center"
          >
            <div className="flex flex-col items-center justify-center mb-4 gap-4">
              <div>
                <div className="text-4xl sm:text-5xl font-bold mb-2">
                  {averageRating}
                </div>
                <div className="flex justify-center mb-2">{renderStars(5)}</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Based on {totalReviews} verified reviews
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <button
                onClick={() => setShowForm(!showForm)}
                className="btn-secondary inline-block"
              >
                {showForm ? 'Cancel Review' : 'Write a Review'}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Review Submission Form */}
      {showForm && (
        <section className="section-padding bg-gray-50 dark:bg-gray-800">
          <div className="container-custom max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 sm:p-8"
            >
              <h2 className="text-3xl font-bold mb-6 text-center">
                Write a Review
              </h2>

              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg flex items-center">
                  <FiCheckCircle className="mr-2 text-xl" />
                  <span>
                    Thank you! Your review has been submitted and will be
                    displayed after verification.
                  </span>
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-lg flex items-center">
                  <FiX className="mr-2 text-xl" />
                  <span>Something went wrong. Please try again.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                    placeholder="+91 12345 67890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Add a photo (optional)
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full text-sm text-gray-600 dark:text-gray-300"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Max 5MB. JPG/PNG preferred.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Rating *
                  </label>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingClick(star)}
                        className={`text-4xl transition-transform hover:scale-110 ${
                          star <= formData.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      >
                        <FaStar />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    {formData.rating === 5 && 'Excellent!'}
                    {formData.rating === 4 && 'Very Good'}
                    {formData.rating === 3 && 'Good'}
                    {formData.rating === 2 && 'Fair'}
                    {formData.rating === 1 && 'Poor'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Your Review *
                  </label>
                  <textarea
                    name="text"
                    required
                    rows="5"
                    value={formData.text}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                    placeholder="Share your experience with us..."
                  />
                </div>

                <button type="submit" className="w-full btn-primary py-3">
                  Submit Review
                </button>
              </form>
            </motion.div>
          </div>
        </section>
      )}

      {/* Reviews Carousel */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">What Our Clients Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Real feedback from real customers
            </p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Loading reviews...
              </p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                No reviews yet. Be the first to review!
              </p>
            </div>
          ) : (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 5000 }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 3,
                },
              }}
              className="pb-12"
            >
              {reviews.map((review, index) => (
                <SwiperSlide key={review._id || index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="bg-white dark:bg-gray-900 p-4 sm:p-6 rounded-xl shadow-lg h-full"
                  >
                    <div className="flex items-center mb-3 sm:mb-4">
                      <div className="flex text-yellow-400 mr-2 sm:mr-3 text-sm sm:text-base">
                        {renderStars(review.rating)}
                      </div>
                      {review.verified && (
                        <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-3 sm:mb-4 italic">
                      "{review.text}"
                    </p>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3 sm:pt-4">
                      <div className="font-semibold text-sm sm:text-base">
                        {review.name}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        {review.date || 'Recently'}
                      </div>
                      {review.imageUrl && (
                        <img
                          src={review.imageUrl}
                          alt={`Review from ${review.name}`}
                          className="mt-3 sm:mt-4 w-full h-48 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                      )}
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* Video Reviews Section removed */}
    </div>
  )
}

export default Reviews
