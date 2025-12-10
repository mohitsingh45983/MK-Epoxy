import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import axios from 'axios'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [images, setImages] = useState([])
  const [beforeAfter, setBeforeAfter] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchGallery = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await axios.get('/api/gallery')
        if (res.data.success) {
          setImages(res.data.images || [])
          setBeforeAfter(res.data.beforeAfter || [])
        } else {
          setError('Failed to load gallery.')
        }
      } catch (err) {
        setError('Cannot load gallery right now. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchGallery()
  }, [])

  const openLightbox = (index) => {
    setSelectedImage(images[index])
    setCurrentIndex(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const nextImage = () => {
    const next = (currentIndex + 1) % images.length
    setCurrentIndex(next)
    setSelectedImage(images[next])
  }

  const prevImage = () => {
    const prev = (currentIndex - 1 + images.length) % images.length
    setCurrentIndex(prev)
    setSelectedImage(images[prev])
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
              Project Gallery
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Showcasing our completed projects and quality workmanship
            </p>
          </motion.div>
        </div>
      </section>

      {/* Image Gallery Grid */}
      <section className="section-padding">
        <div className="container-custom">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-100 text-red-800">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center text-gray-500">Loading gallery...</div>
          ) : images.length === 0 ? (
            <div className="text-center text-gray-500">
              No gallery images yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <motion.div
                  key={image._id || index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="relative overflow-hidden rounded-lg cursor-pointer group"
                  onClick={() => openLightbox(index)}
                >
                  <img
                    src={image.imageUrl}
                    alt={image.title || `Project ${index + 1}`}
                    className="w-full h-40 sm:h-48 md:h-56 lg:h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      View Full Size
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Before/After Slider Section */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Before & After</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              See the transformation we bring to your spaces
            </p>
          </motion.div>

          {beforeAfter.length === 0 ? (
            <div className="text-center text-gray-500">
              No before/after stories yet.
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
              {beforeAfter.map((item, index) => (
                <SwiperSlide key={item._id || index}>
                  <div className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg">
                    <div className="grid grid-cols-2 gap-0">
                      <img
                        src={item.beforeUrl}
                        alt={`${item.title || 'Project'} before`}
                        className="w-full h-64 object-cover"
                      />
                      <img
                        src={item.afterUrl}
                        alt={`${item.title || 'Project'} after`}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">
                        {item.title || 'Project'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {item.description || 'Transformation showcase'}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-6xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.imageUrl || selectedImage}
                alt="Full size"
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
              />
              <button
                onClick={closeLightbox}
                className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors"
              >
                <FiX className="text-2xl" />
              </button>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors"
              >
                <FiChevronLeft className="text-2xl" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/50 hover:bg-black/70 p-2 rounded-full transition-colors"
              >
                <FiChevronRight className="text-2xl" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Gallery
