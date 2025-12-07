import { motion } from 'framer-motion'
import { FaStar, FaGoogle } from 'react-icons/fa'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const Reviews = () => {
  const reviews = [
    {
      name: 'Rajesh Kumar',
      rating: 5,
      text: 'Excellent work! The epoxy flooring in our warehouse looks amazing and has been holding up perfectly even after heavy use. Highly recommended!',
      date: '2 weeks ago',
      verified: true,
    },
    {
      name: 'Priya Sharma',
      rating: 5,
      text: 'MK Epoxy did an outstanding job waterproofing our terrace. No leaks even during heavy monsoon. Professional team and great service.',
      date: '1 month ago',
      verified: true,
    },
    {
      name: 'Amit Patel',
      rating: 5,
      text: 'Best decision we made! The PU flooring in our factory is durable and easy to maintain. The team was punctual and completed on time.',
      date: '3 weeks ago',
      verified: true,
    },
    {
      name: 'Sneha Reddy',
      rating: 5,
      text: 'Very satisfied with the industrial coating work. The surface is smooth, professional, and exactly as promised. Great value for money.',
      date: '1 month ago',
      verified: true,
    },
    {
      name: 'Vikram Singh',
      rating: 5,
      text: 'Professional service from start to finish. They explained everything clearly and delivered exactly what was promised. Will definitely use again.',
      date: '2 months ago',
      verified: true,
    },
    {
      name: 'Anjali Mehta',
      rating: 5,
      text: 'The crack filling work was done perfectly. Our floor looks brand new now. Thank you MK Epoxy for the excellent service!',
      date: '3 weeks ago',
      verified: true,
    },
  ]

  const averageRating = 5.0
  const totalReviews = reviews.length

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
            <div className="flex flex-col sm:flex-row items-center justify-center mb-4 gap-4">
              <FaGoogle className="text-3xl sm:text-4xl text-primary-600 dark:text-primary-400" />
              <div>
                <div className="text-4xl sm:text-5xl font-bold mb-2">{averageRating}</div>
                <div className="flex justify-center mb-2">{renderStars(5)}</div>
                <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                  Based on {totalReviews} Google Reviews
                </div>
              </div>
            </div>
            <a
              href="https://g.page/r/YOUR_GOOGLE_PLACE_ID/review"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block mt-6"
            >
              Leave a Review on Google
            </a>
          </motion.div>
        </div>
      </section>

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
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg h-full"
                >
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400 mr-3">
                      {renderStars(review.rating)}
                    </div>
                    {review.verified && (
                      <span className="text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                    "{review.text}"
                  </p>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="font-semibold">{review.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {review.date}
                    </div>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Video Reviews Section */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Video Reviews</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Watch our clients share their experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-gray-200 dark:bg-gray-800 rounded-lg aspect-video flex items-center justify-center"
            >
              <p className="text-gray-500 dark:text-gray-400">
                Video Review Placeholder
                <br />
                <span className="text-sm">Add your video reviews here</span>
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-200 dark:bg-gray-800 rounded-lg aspect-video flex items-center justify-center"
            >
              <p className="text-gray-500 dark:text-gray-400">
                Video Review Placeholder
                <br />
                <span className="text-sm">Add your video reviews here</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Reviews

