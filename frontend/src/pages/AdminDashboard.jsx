import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiEdit2,
  FiSave,
  FiX,
  FiLogOut,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiGlobe,
  FiCheck,
  FiTrash2,
  FiSearch,
  FiChevronDown,
  FiImage,
  FiUpload,
  FiLayers,
  FiPlus,
} from 'react-icons/fi'
import { FaStar } from 'react-icons/fa'
import axios from 'axios'
import api from '../utils/api'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('services') // services, contact, reviews, gallery
  const [contactInfo, setContactInfo] = useState(null)
  const [contactEditValues, setContactEditValues] = useState({
    phone: '',
    whatsapp: '',
    email: '',
    alternateEmail: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      country: 'India',
    },
    workingHours: {
      weekdays: 'Monday - Saturday: 9:00 AM - 7:00 PM',
      weekend: 'Sunday: Closed',
    },
    socialMedia: {
      facebook: '',
      instagram: '',
      linkedin: '',
    },
    googleMapsUrl: '',
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const navigate = useNavigate()

  // Reviews state
  const [reviews, setReviews] = useState([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [reviewFilters, setReviewFilters] = useState({
    verified: 'all', // 'all', 'true', 'false'
    rating: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  })
  // Gallery state
  const [galleryImages, setGalleryImages] = useState([])
  const [beforeAfterItems, setBeforeAfterItems] = useState([])
  const [galleryLoading, setGalleryLoading] = useState(false)
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    description: '',
    image: null,
  })
  const [beforeAfterForm, setBeforeAfterForm] = useState({
    title: '',
    description: '',
    before: null,
    after: null,
  })
  const [galleryPage, setGalleryPage] = useState(1)
  const [services, setServices] = useState([])
  const [servicesLoading, setServicesLoading] = useState(false)
  const [serviceForm, setServiceForm] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    benefits: '',
    processSteps: '',
    warranty: '',
    ratePerSqft: '',
    isActive: true,
    order: 0,
    coverImage: null,
  })
  const [editingServiceId, setEditingServiceId] = useState(null)
  const [serviceEditValues, setServiceEditValues] = useState({
    title: '',
    slug: '',
    shortDescription: '',
    description: '',
    benefits: '',
    processSteps: '',
    warranty: '',
    ratePerSqft: '',
    isActive: true,
    order: 0,
    coverImage: null,
  })

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin/login')
      return
    }

    fetchContactInfo()
    fetchServices()
    if (activeTab === 'reviews') {
      fetchReviews()
    }
  }, [navigate])

  useEffect(() => {
    if (activeTab === 'reviews') {
      fetchReviews()
    }
    if (activeTab === 'gallery') {
      fetchGallery()
    }
    if (activeTab === 'services') {
      fetchServices()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    reviewFilters.verified,
    reviewFilters.rating,
    reviewFilters.sortBy,
    reviewFilters.sortOrder,
    activeTab,
  ])

  // Debounce search to avoid too many API calls
  useEffect(() => {
    if (activeTab === 'reviews') {
      const timeoutId = setTimeout(() => {
        fetchReviews()
      }, 500) // Wait 500ms after user stops typing
      return () => clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewFilters.search, activeTab])

  const fetchContactInfo = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await api.get('/api/admin/contact', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success && response.data.contactInfo) {
        setContactInfo(response.data.contactInfo)
        setContactEditValues(response.data.contactInfo)
      } else {
        // Initialize with empty values if no contact info exists
        const defaultValues = {
          phone: '',
          whatsapp: '',
          email: '',
          alternateEmail: '',
          address: {
            street: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India',
          },
          workingHours: {
            weekdays: 'Monday - Saturday: 9:00 AM - 7:00 PM',
            weekend: 'Sunday: Closed',
          },
          socialMedia: {
            facebook: '',
            instagram: '',
            linkedin: '',
          },
          googleMapsUrl: '',
        }
        setContactEditValues(defaultValues)
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
      // Keep default values if fetch fails
    }
  }

  const fetchServices = async () => {
    setServicesLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        navigate('/admin/login')
        return
      }

      const response = await api.get('/api/admin/services', {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.data.success) {
        setServices(response.data.services || [])
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        navigate('/admin/login')
      } else {
        setMessage({
          type: 'error',
          text:
            error.response?.data?.message ||
            'Failed to fetch services. Please try again.',
        })
      }
    } finally {
      setServicesLoading(false)
    }
  }

  const fetchReviews = async () => {
    setReviewsLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        console.error('No admin token found')
        navigate('/admin/login')
        return
      }
      const params = new URLSearchParams()

      if (reviewFilters.verified !== 'all') {
        params.append('verified', reviewFilters.verified)
      }
      if (reviewFilters.rating) {
        params.append('rating', reviewFilters.rating)
      }
      if (reviewFilters.search) {
        params.append('search', reviewFilters.search)
      }
      params.append('sortBy', reviewFilters.sortBy)
      params.append('sortOrder', reviewFilters.sortOrder)

      const response = await api.get(
        `/api/admin/reviews?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        setReviews(response.data.reviews || [])
      } else {
        throw new Error(response.data.message || 'Failed to fetch reviews')
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        url: error.config?.url,
        method: error.config?.method,
      })

      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        navigate('/admin/login')
        return
      }

      // Show detailed error message
      let errorMessage = 'Failed to fetch reviews'
      if (error.response) {
        // Server responded with error
        errorMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          `Server error: ${error.response.status} ${error.response.statusText}`
      } else if (error.request) {
        // Request made but no response (server not running or network issue)
        errorMessage =
          'Cannot connect to server. Please make sure the server is running on port 5000.'
      } else {
        // Error in request setup
        errorMessage = error.message || 'Failed to fetch reviews'
      }

      setMessage({
        type: 'error',
        text: errorMessage,
      })
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } finally {
      setReviewsLoading(false)
    }
  }

  const fetchGallery = async () => {
    setGalleryLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        navigate('/admin/login')
        return
      }

      const [imagesRes, beforeAfterRes] = await Promise.all([
        api.get('/api/admin/gallery/images', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get('/api/admin/gallery/before-after', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (imagesRes.data.success) {
        setGalleryImages(imagesRes.data.images || [])
      }
      if (beforeAfterRes.data.success) {
        setBeforeAfterItems(beforeAfterRes.data.items || [])
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          'Failed to load gallery. Please try again.',
      })
    } finally {
      setGalleryLoading(false)
    }
  }

  const handleGalleryUpload = async (e) => {
    e.preventDefault()
    if (!galleryForm.image) {
      setMessage({
        type: 'error',
        text: 'Please select an image to upload.',
      })
      return
    }

    setGalleryLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const formData = new FormData()
      formData.append('title', galleryForm.title)
      formData.append('description', galleryForm.description)
      formData.append('image', galleryForm.image)

      const res = await api.post('/api/admin/gallery/images', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      if (res.data.success) {
        setMessage({ type: 'success', text: 'Image uploaded successfully.' })
        setGalleryForm({ title: '', description: '', image: null })
        fetchGallery()
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          'Failed to upload image. Please try again.',
      })
    } finally {
      setGalleryLoading(false)
    }
  }

  const handleBeforeAfterUpload = async (e) => {
    e.preventDefault()
    if (!beforeAfterForm.before || !beforeAfterForm.after) {
      setMessage({
        type: 'error',
        text: 'Please select both before and after images.',
      })
      return
    }

    setGalleryLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const formData = new FormData()
      formData.append('title', beforeAfterForm.title)
      formData.append('description', beforeAfterForm.description)
      formData.append('before', beforeAfterForm.before)
      formData.append('after', beforeAfterForm.after)

      const res = await api.post(
        '/api/admin/gallery/before-after',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (res.data.success) {
        setMessage({
          type: 'success',
          text: 'Before/After uploaded successfully.',
        })
        setBeforeAfterForm({
          title: '',
          description: '',
          before: null,
          after: null,
        })
        fetchGallery()
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          'Failed to upload before/after. Please try again.',
      })
    } finally {
      setGalleryLoading(false)
    }
  }

  const handleDeleteGalleryImage = async (id) => {
    if (!window.confirm('Delete this image?')) return

    setGalleryLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      await api.delete(`/api/admin/gallery/images/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMessage({ type: 'success', text: 'Image deleted.' })
      fetchGallery()
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          'Failed to delete image. Please try again.',
      })
    } finally {
      setGalleryLoading(false)
    }
  }

  const handleDeleteBeforeAfter = async (id) => {
    if (!window.confirm('Delete this before/after item?')) return

    setGalleryLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      await api.delete(`/api/admin/gallery/before-after/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setMessage({ type: 'success', text: 'Before/After deleted.' })
      fetchGallery()
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          'Failed to delete before/after item. Please try again.',
      })
    } finally {
      setGalleryLoading(false)
    }
  }

  const buildServiceFormData = (values) => {
    const formData = new FormData()
    formData.append('title', values.title)
    if (values.slug) formData.append('slug', values.slug)
    formData.append('shortDescription', values.shortDescription || '')
    formData.append('description', values.description || '')
    formData.append('benefits', values.benefits || '')
    formData.append('processSteps', values.processSteps || '')
    formData.append('warranty', values.warranty || '')
    if (values.ratePerSqft !== '') {
      formData.append('ratePerSqft', values.ratePerSqft)
    }
    formData.append('isActive', values.isActive)
    formData.append('order', values.order || 0)
    if (values.coverImage) {
      formData.append('coverImage', values.coverImage)
    }
    return formData
  }

  const handleServiceCreate = async (e) => {
    e.preventDefault()
    setServicesLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('adminToken')
      const formData = buildServiceFormData(serviceForm)

      const res = await api.post('/api/admin/services', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      if (res.data.success) {
        setMessage({ type: 'success', text: 'Service created successfully.' })
        setServiceForm({
          title: '',
          slug: '',
          shortDescription: '',
          description: '',
          benefits: '',
          processSteps: '',
          warranty: '',
          ratePerSqft: '',
          isActive: true,
          order: 0,
          coverImage: null,
        })
        fetchServices()
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          'Failed to create service. Please try again.',
      })
    } finally {
      setServicesLoading(false)
    }
  }

  const startEditService = (service) => {
    setEditingServiceId(service._id)
    setServiceEditValues({
      title: service.title || '',
      slug: service.slug || '',
      shortDescription: service.shortDescription || '',
      description: service.description || '',
      benefits: (service.benefits || []).join('\n'),
      processSteps: (service.processSteps || []).join('\n'),
      warranty: service.warranty || '',
      ratePerSqft:
        service.ratePerSqft === undefined ? '' : service.ratePerSqft,
      isActive: service.isActive,
      order: service.order || 0,
      coverImage: null,
    })
  }

  const handleServiceUpdate = async (e) => {
    e.preventDefault()
    if (!editingServiceId) return

    setServicesLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('adminToken')
      const formData = buildServiceFormData(serviceEditValues)

      const res = await api.put(
        `/api/admin/services/${editingServiceId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (res.data.success) {
        setMessage({ type: 'success', text: 'Service updated successfully.' })
        setEditingServiceId(null)
        fetchServices()
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          'Failed to update service. Please try again.',
      })
    } finally {
      setServicesLoading(false)
    }
  }

  const handleServiceDelete = async (id) => {
    if (
      !window.confirm(
        'Delete this service? This will remove it from the website.'
      )
    )
      return

    setServicesLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const res = await api.delete(`/api/admin/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.data.success) {
        setMessage({ type: 'success', text: 'Service deleted successfully.' })
        fetchServices()
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          'Failed to delete service. Please try again.',
      })
    } finally {
      setServicesLoading(false)
    }
  }

  // Reset gallery page when list changes
  useEffect(() => {
    setGalleryPage(1)
  }, [galleryImages.length])

  const handleVerifyReview = async (id, verified) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await api.put(
        `/api/admin/reviews/${id}/verify`,
        { verified },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        setMessage({
          type: 'success',
          text: `Review ${verified ? 'verified' : 'unverified'} successfully!`,
        })
        fetchReviews()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        navigate('/admin/login')
      } else {
        setMessage({
          type: 'error',
          text: error.response?.data?.message || 'Failed to update review',
        })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteReview = async (id) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this review? This action cannot be undone.'
      )
    ) {
      return
    }

    setLoading(true)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await api.delete(`/api/admin/reviews/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        setMessage({
          type: 'success',
          text: 'Review deleted successfully!',
        })
        fetchReviews()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        navigate('/admin/login')
      } else {
        setMessage({
          type: 'error',
          text: error.response?.data?.message || 'Failed to delete review',
        })
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      }
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={i < rating ? 'text-yellow-400' : 'text-gray-300'}
        size={16}
      />
    ))
  }

  const handleContactSave = async () => {
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('adminToken')
      const response = await api.put(
        '/api/admin/contact',
        contactEditValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        setMessage({
          type: 'success',
          text: 'Contact information updated successfully!',
        })
        setContactInfo(response.data.contactInfo)
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          'Failed to update contact information',
      })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    navigate('/admin/login')
  }

  const getTabLabel = (tab) => {
    switch (tab) {
      case 'services':
        return 'Services'
      case 'contact':
        return 'Contact Information'
      case 'reviews':
        return 'Reviews Management'
      case 'gallery':
        return 'Gallery'
      default:
        return 'Service Pricing'
    }
  }

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Fixed Top Bar with Logout */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="container-custom px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="btn-secondary flex items-center space-x-2 text-sm sm:text-base py-2 px-3 sm:px-4"
            >
              <FiLogOut className="text-base sm:text-lg" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container-custom section-padding pt-24">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
            Manage services, contact information, reviews, and gallery
          </p>
        </motion.div>

        {/* Tabs - Dropdown for mobile, buttons for desktop */}
        <div className="mb-6">
          {/* Desktop: Button Tabs */}
          <div className="hidden md:flex space-x-4 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('services')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'services'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              Services
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'contact'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              Contact Information
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'reviews'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              Reviews Management
            </button>
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-6 py-3 font-semibold transition-colors ${
                activeTab === 'gallery'
                  ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
              }`}
            >
              Gallery
            </button>
          </div>

          {/* Mobile: Dropdown Select */}
          <div className="md:hidden">
            <div className="relative">
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full px-4 py-3 pr-10 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-semibold appearance-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="services">Services</option>
                <option value="contact">Contact Information</option>
                <option value="reviews">Reviews Management</option>
                <option value="gallery">Gallery</option>
              </select>
              <FiChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 space-y-4 lg:col-span-1">
              <div className="flex items-center space-x-2">
                <FiPlus className="text-primary-500" />
                <h3 className="text-lg font-semibold">Add Service</h3>
              </div>
              <form onSubmit={handleServiceCreate} className="space-y-3">
                <input
                  required
                  type="text"
                  placeholder="Title"
                  value={serviceForm.title}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, title: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="text"
                  placeholder="Custom slug (optional)"
                  value={serviceForm.slug}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, slug: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
                />
                <textarea
                  rows="2"
                  placeholder="Short description"
                  value={serviceForm.shortDescription}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      shortDescription: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
                />
                <textarea
                  rows="3"
                  placeholder="Full description"
                  value={serviceForm.description}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
                />
                <textarea
                  rows="3"
                  placeholder="Benefits (comma or new line separated)"
                  value={serviceForm.benefits}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      benefits: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
                />
                <textarea
                  rows="3"
                  placeholder="Process steps (comma or new line separated)"
                  value={serviceForm.processSteps}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      processSteps: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
                />
                <input
                  type="text"
                  placeholder="Warranty (e.g. 1 year)"
                  value={serviceForm.warranty}
                  onChange={(e) =>
                    setServiceForm({ ...serviceForm, warranty: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Rate per sqft"
                    value={serviceForm.ratePerSqft}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        ratePerSqft: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="number"
                    placeholder="Order"
                    value={serviceForm.order}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        order: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-semibold">Status:</label>
                  <select
                    value={serviceForm.isActive}
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        isActive: e.target.value === 'true',
                      })
                    }
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 text-sm"
                  >
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">
                    Cover image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      setServiceForm({
                        ...serviceForm,
                        coverImage: e.target.files?.[0] || null,
                      })
                    }
                    className="text-sm text-gray-600 dark:text-gray-300"
                  />
                </div>
                <button
                  type="submit"
                  disabled={servicesLoading}
                  className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                >
                  <FiSave />
                  <span>{servicesLoading ? 'Saving...' : 'Create Service'}</span>
                </button>
              </form>
            </div>

            <div className="lg:col-span-2 space-y-4">
              {servicesLoading && services.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center text-gray-600 dark:text-gray-300">
                  Loading services...
                </div>
              ) : services.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center text-gray-600 dark:text-gray-300">
                  No services yet. Create your first service on the left.
                </div>
              ) : (
                services.map((service) => {
                  const isEditing = editingServiceId === service._id
                  return (
                    <div
                      key={service._id}
                      className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-semibold">
                            {service.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Slug: {service.slug}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              service.isActive
                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            }`}
                          >
                            {service.isActive ? 'Active' : 'Inactive'}
                          </span>
                          <button
                            onClick={() =>
                              isEditing
                                ? setEditingServiceId(null)
                                : startEditService(service)
                            }
                            className="btn-secondary px-3 py-2 text-sm"
                            type="button"
                          >
                            {isEditing ? 'Cancel' : 'Edit'}
                          </button>
                          <button
                            onClick={() => handleServiceDelete(service._id)}
                            className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700"
                            type="button"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {service.coverImageUrl && (
                        <img
                          src={service.coverImageUrl}
                          alt={service.title}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      )}

                      {!isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-700 dark:text-gray-300">
                          {service.shortDescription && (
                            <p>{service.shortDescription}</p>
                          )}
                          {service.ratePerSqft !== undefined && (
                            <div className="font-semibold">
                              Rate: ₹{service.ratePerSqft}/sqft
                            </div>
                          )}
                          {service.benefits?.length > 0 && (
                            <div>
                              <div className="font-semibold mb-1">Benefits</div>
                              <ul className="list-disc list-inside space-y-1">
                                {service.benefits.slice(0, 4).map((b) => (
                                  <li key={b}>{b}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ) : (
                        <form
                          onSubmit={handleServiceUpdate}
                          className="space-y-3 text-sm"
                        >
                          <input
                            type="text"
                            value={serviceEditValues.title}
                            onChange={(e) =>
                              setServiceEditValues({
                                ...serviceEditValues,
                                title: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="text"
                            placeholder="Slug"
                            value={serviceEditValues.slug}
                            onChange={(e) =>
                              setServiceEditValues({
                                ...serviceEditValues,
                                slug: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
                          />
                          <textarea
                            rows="2"
                            value={serviceEditValues.shortDescription}
                            onChange={(e) =>
                              setServiceEditValues({
                                ...serviceEditValues,
                                shortDescription: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
                          />
                          <textarea
                            rows="3"
                            value={serviceEditValues.description}
                            onChange={(e) =>
                              setServiceEditValues({
                                ...serviceEditValues,
                                description: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
                          />
                          <textarea
                            rows="3"
                            value={serviceEditValues.benefits}
                            onChange={(e) =>
                              setServiceEditValues({
                                ...serviceEditValues,
                                benefits: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
                          />
                          <textarea
                            rows="3"
                            value={serviceEditValues.processSteps}
                            onChange={(e) =>
                              setServiceEditValues({
                                ...serviceEditValues,
                                processSteps: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
                          />
                          <input
                            type="text"
                            placeholder="Warranty"
                            value={serviceEditValues.warranty}
                            onChange={(e) =>
                              setServiceEditValues({
                                ...serviceEditValues,
                                warranty: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={serviceEditValues.ratePerSqft}
                              onChange={(e) =>
                                setServiceEditValues({
                                  ...serviceEditValues,
                                  ratePerSqft: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
                            />
                            <input
                              type="number"
                              value={serviceEditValues.order}
                              onChange={(e) =>
                                setServiceEditValues({
                                  ...serviceEditValues,
                                  order: Number(e.target.value),
                                })
                              }
                              className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="text-sm font-semibold">
                              Status:
                            </label>
                            <select
                              value={serviceEditValues.isActive}
                              onChange={(e) =>
                                setServiceEditValues({
                                  ...serviceEditValues,
                                  isActive: e.target.value === 'true',
                                })
                              }
                              className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-primary-500 text-sm"
                            >
                              <option value="true">Active</option>
                              <option value="false">Inactive</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold mb-1">
                              Replace cover image
                            </label>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) =>
                                setServiceEditValues({
                                  ...serviceEditValues,
                                  coverImage: e.target.files?.[0] || null,
                                })
                              }
                              className="text-sm text-gray-600 dark:text-gray-300"
                            />
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="submit"
                              disabled={servicesLoading}
                              className="btn-primary px-4 py-2 disabled:opacity-50"
                            >
                              {servicesLoading ? 'Saving...' : 'Save changes'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingServiceId(null)}
                              className="btn-secondary px-4 py-2"
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </motion.div>
        )}

        {/* Contact Information Tab */}
        {activeTab === 'contact' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6 md:p-8"
          >
            {!contactInfo && (
              <div className="mb-6 p-4 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-lg">
                <p>
                  No contact information found. Fill in the details below and
                  save to create it.
                </p>
              </div>
            )}
            <div className="space-y-6">
              {/* Phone & WhatsApp */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center">
                    <FiPhone className="mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={contactEditValues?.phone || ''}
                    onChange={(e) =>
                      setContactEditValues({
                        ...contactEditValues,
                        phone: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center">
                    <FiPhone className="mr-2" />
                    WhatsApp Number
                  </label>
                  <input
                    type="text"
                    value={contactEditValues?.whatsapp || ''}
                    onChange={(e) =>
                      setContactEditValues({
                        ...contactEditValues,
                        whatsapp: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                    placeholder="917339723912"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center">
                    <FiMail className="mr-2" />
                    Primary Email
                  </label>
                  <input
                    type="email"
                    value={contactEditValues?.email || ''}
                    onChange={(e) =>
                      setContactEditValues({
                        ...contactEditValues,
                        email: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center">
                    <FiMail className="mr-2" />
                    Alternate Email
                  </label>
                  <input
                    type="email"
                    value={contactEditValues?.alternateEmail || ''}
                    onChange={(e) =>
                      setContactEditValues({
                        ...contactEditValues,
                        alternateEmail: e.target.value,
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold mb-4 flex items-center">
                  <FiMapPin className="mr-2" />
                  Address
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <input
                    type="text"
                    placeholder="Street Address"
                    value={contactEditValues?.address?.street || ''}
                    onChange={(e) =>
                      setContactEditValues({
                        ...contactEditValues,
                        address: {
                          ...(contactEditValues?.address || {}),
                          street: e.target.value,
                        },
                      })
                    }
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="text"
                    placeholder="City"
                    value={contactEditValues?.address?.city || ''}
                    onChange={(e) =>
                      setContactEditValues({
                        ...contactEditValues,
                        address: {
                          ...(contactEditValues?.address || {}),
                          city: e.target.value,
                        },
                      })
                    }
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="text"
                    placeholder="State"
                    value={contactEditValues?.address?.state || ''}
                    onChange={(e) =>
                      setContactEditValues({
                        ...contactEditValues,
                        address: {
                          ...(contactEditValues?.address || {}),
                          state: e.target.value,
                        },
                      })
                    }
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="text"
                    placeholder="PIN Code"
                    value={contactEditValues?.address?.pincode || ''}
                    onChange={(e) =>
                      setContactEditValues({
                        ...contactEditValues,
                        address: {
                          ...(contactEditValues?.address || {}),
                          pincode: e.target.value,
                        },
                      })
                    }
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="text"
                    placeholder="Country"
                    value={contactEditValues?.address?.country || ''}
                    onChange={(e) =>
                      setContactEditValues({
                        ...contactEditValues,
                        address: {
                          ...(contactEditValues?.address || {}),
                          country: e.target.value,
                        },
                      })
                    }
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Working Hours */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center">
                    <FiClock className="mr-2" />
                    Weekdays Hours
                  </label>
                  <input
                    type="text"
                    value={contactEditValues?.workingHours?.weekdays || ''}
                    onChange={(e) =>
                      setContactEditValues({
                        ...contactEditValues,
                        workingHours: {
                          ...(contactEditValues?.workingHours || {}),
                          weekdays: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 flex items-center">
                    <FiClock className="mr-2" />
                    Weekend Hours
                  </label>
                  <input
                    type="text"
                    value={contactEditValues?.workingHours?.weekend || ''}
                    onChange={(e) =>
                      setContactEditValues({
                        ...contactEditValues,
                        workingHours: {
                          ...(contactEditValues?.workingHours || {}),
                          weekend: e.target.value,
                        },
                      })
                    }
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Social Media */}
              <div>
                <label className="block text-sm font-semibold mb-4 flex items-center">
                  <FiGlobe className="mr-2" />
                  Social Media Links
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                  <input
                    type="url"
                    placeholder="Facebook URL"
                    value={contactEditValues?.socialMedia?.facebook || ''}
                    onChange={(e) =>
                      setContactEditValues({
                        ...contactEditValues,
                        socialMedia: {
                          ...(contactEditValues?.socialMedia || {}),
                          facebook: e.target.value,
                        },
                      })
                    }
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="url"
                    placeholder="Instagram URL"
                    value={contactEditValues?.socialMedia?.instagram || ''}
                    onChange={(e) =>
                      setContactEditValues({
                        ...contactEditValues,
                        socialMedia: {
                          ...(contactEditValues?.socialMedia || {}),
                          instagram: e.target.value,
                        },
                      })
                    }
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                  />
                  <input
                    type="url"
                    placeholder="LinkedIn URL"
                    value={contactEditValues?.socialMedia?.linkedin || ''}
                    onChange={(e) =>
                      setContactEditValues({
                        ...contactEditValues,
                        socialMedia: {
                          ...(contactEditValues?.socialMedia || {}),
                          linkedin: e.target.value,
                        },
                      })
                    }
                    className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {/* Google Maps */}
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center">
                  <FiMapPin className="mr-2" />
                  Google Maps Embed URL
                </label>
                <input
                  type="url"
                  placeholder="https://www.google.com/maps/embed?..."
                  value={contactEditValues?.googleMapsUrl || ''}
                  onChange={(e) =>
                    setContactEditValues({
                      ...contactEditValues,
                      googleMapsUrl: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                />
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleContactSave}
                  disabled={loading}
                  className="btn-primary flex items-center space-x-2 disabled:opacity-50"
                >
                  <FiSave />
                  <span>
                    {loading ? 'Saving...' : 'Save Contact Information'}
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Gallery Tab */}
        {activeTab === 'gallery' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-4 sm:p-6 space-y-8">
              {/* Upload normal image */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <FiImage className="text-primary-500" />
                  <h3 className="text-lg font-semibold">Gallery Images</h3>
                </div>
                <form
                  onSubmit={handleGalleryUpload}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Title (optional)
                      </label>
                      <input
                        type="text"
                        value={galleryForm.title}
                        onChange={(e) =>
                          setGalleryForm({
                            ...galleryForm,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Description (optional)
                      </label>
                      <textarea
                        rows="3"
                        value={galleryForm.description}
                        onChange={(e) =>
                          setGalleryForm({
                            ...galleryForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Image file
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                          setGalleryForm({
                            ...galleryForm,
                            image: e.target.files?.[0] || null,
                          })
                        }
                        className="w-full text-sm text-gray-600 dark:text-gray-300"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Max ~8MB. JPG/PNG.
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={galleryLoading}
                      className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <FiUpload />
                      <span>
                        {galleryLoading ? 'Uploading...' : 'Upload Image'}
                      </span>
                    </button>
                  </div>
                </form>

                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {galleryImages.length === 0 ? (
                    <div className="text-gray-500">No images yet.</div>
                  ) : (
                    galleryImages
                      .slice((galleryPage - 1) * 6, galleryPage * 6)
                      .map((img) => (
                        <div
                          key={img._id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                        >
                          <img
                            src={img.imageUrl}
                            alt={img.title || 'Gallery image'}
                            className="w-full h-48 object-cover"
                          />
                          <div className="p-3 space-y-1">
                            <div className="font-semibold text-sm">
                              {img.title || 'Untitled'}
                            </div>
                            {img.description && (
                              <p className="text-xs text-gray-600 dark:text-gray-400">
                                {img.description}
                              </p>
                            )}
                            <button
                              onClick={() => handleDeleteGalleryImage(img._id)}
                              className="mt-2 inline-flex items-center space-x-1 text-sm text-red-600 hover:text-red-700"
                              type="button"
                            >
                              <FiTrash2 />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>
                      ))
                  )}
                </div>
                {galleryImages.length > 6 && (
                  <div className="mt-4 flex items-center justify-center space-x-3">
                    <button
                      type="button"
                      disabled={galleryPage === 1}
                      onClick={() => setGalleryPage((p) => Math.max(1, p - 1))}
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50"
                    >
                      Prev
                    </button>
                    <div className="text-sm text-gray-700 dark:text-gray-200">
                      Page {galleryPage} of{' '}
                      {Math.ceil(galleryImages.length / 6)}
                    </div>
                    <button
                      type="button"
                      disabled={
                        galleryPage >= Math.ceil(galleryImages.length / 6)
                      }
                      onClick={() =>
                        setGalleryPage((p) =>
                          Math.min(Math.ceil(galleryImages.length / 6), p + 1)
                        )
                      }
                      className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              <hr className="border-gray-200 dark:border-gray-700" />

              {/* Before / After */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <FiLayers className="text-primary-500" />
                  <h3 className="text-lg font-semibold">Before / After</h3>
                </div>

                <form
                  onSubmit={handleBeforeAfterUpload}
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Title (optional)
                      </label>
                      <input
                        type="text"
                        value={beforeAfterForm.title}
                        onChange={(e) =>
                          setBeforeAfterForm({
                            ...beforeAfterForm,
                            title: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">
                        Description (optional)
                      </label>
                      <textarea
                        rows="3"
                        value={beforeAfterForm.description}
                        onChange={(e) =>
                          setBeforeAfterForm({
                            ...beforeAfterForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold mb-1">
                          Before image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setBeforeAfterForm({
                              ...beforeAfterForm,
                              before: e.target.files?.[0] || null,
                            })
                          }
                          className="w-full text-sm text-gray-600 dark:text-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-1">
                          After image
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            setBeforeAfterForm({
                              ...beforeAfterForm,
                              after: e.target.files?.[0] || null,
                            })
                          }
                          className="w-full text-sm text-gray-600 dark:text-gray-300"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={galleryLoading}
                      className="btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      <FiUpload />
                      <span>
                        {galleryLoading
                          ? 'Uploading...'
                          : 'Upload Before/After'}
                      </span>
                    </button>
                  </div>
                </form>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {beforeAfterItems.length === 0 ? (
                    <div className="text-gray-500">No before/after yet.</div>
                  ) : (
                    beforeAfterItems.map((item) => (
                      <div
                        key={item._id}
                        className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                      >
                        <div className="grid grid-cols-2">
                          <img
                            src={item.beforeUrl}
                            alt="Before"
                            className="w-full h-40 object-cover"
                          />
                          <img
                            src={item.afterUrl}
                            alt="After"
                            className="w-full h-40 object-cover"
                          />
                        </div>
                        <div className="p-3 space-y-1">
                          <div className="font-semibold text-sm">
                            {item.title || 'Project'}
                          </div>
                          {item.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {item.description}
                            </p>
                          )}
                          <button
                            onClick={() => handleDeleteBeforeAfter(item._id)}
                            className="mt-2 inline-flex items-center space-x-1 text-sm text-red-600 hover:text-red-700"
                            type="button"
                          >
                            <FiTrash2 />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Reviews Management Tab */}
        {activeTab === 'reviews' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="p-4 sm:p-6">
              {/* Filters and Search */}
              <div className="mb-6 space-y-4">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Search */}
                  <div className="flex-1">
                    <div className="relative">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search by name, email, or review text..."
                        value={reviewFilters.search}
                        onChange={(e) =>
                          setReviewFilters({
                            ...reviewFilters,
                            search: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  {/* Verified Filter */}
                  <select
                    value={reviewFilters.verified}
                    onChange={(e) =>
                      setReviewFilters({
                        ...reviewFilters,
                        verified: e.target.value,
                      })
                    }
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                  >
                    <option value="all">All Reviews</option>
                    <option value="true">Verified Only</option>
                    <option value="false">Unverified Only</option>
                  </select>

                  {/* Rating Filter */}
                  <select
                    value={reviewFilters.rating}
                    onChange={(e) =>
                      setReviewFilters({
                        ...reviewFilters,
                        rating: e.target.value,
                      })
                    }
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                  >
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>

                  {/* Sort */}
                  <select
                    value={`${reviewFilters.sortBy}-${reviewFilters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-')
                      setReviewFilters({
                        ...reviewFilters,
                        sortBy,
                        sortOrder,
                      })
                    }}
                    className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                    <option value="rating-desc">Highest Rating</option>
                    <option value="rating-asc">Lowest Rating</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                  </select>
                </div>
              </div>

              {/* Reviews Table */}
              {reviewsLoading ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    Loading reviews...
                  </p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-600 dark:text-gray-400">
                    No reviews found.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-primary-600 text-white">
                      <tr>
                        <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-semibold text-sm sm:text-base">
                          Name
                        </th>
                        <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-semibold text-sm sm:text-base">
                          Rating
                        </th>
                        <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-semibold text-sm sm:text-base">
                          Review
                        </th>
                        <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-semibold text-sm sm:text-base">
                          Status
                        </th>
                        <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-semibold text-sm sm:text-base">
                          Date
                        </th>
                        <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center font-semibold text-sm sm:text-base">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((review, index) => (
                        <motion.tr
                          key={review._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                            <div className="font-medium text-sm sm:text-base">
                              {review.name}
                            </div>
                            {review.email && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {review.email}
                              </div>
                            )}
                            {review.phone && (
                              <div className="text-xs text-gray-500 dark:text-gray-400">
                                {review.phone}
                              </div>
                            )}
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                            <div className="flex items-center space-x-1">
                              {renderStars(review.rating)}
                              <span className="ml-2 text-sm font-semibold">
                                {review.rating}
                              </span>
                            </div>
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                            <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 max-w-xs">
                              {review.text}
                            </p>
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                review.verified
                                  ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                  : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                              }`}
                            >
                              {review.verified ? 'Verified' : 'Pending'}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-sm text-gray-600 dark:text-gray-400">
                            {review.date || 'Recently'}
                          </td>
                          <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                            <div className="flex justify-center space-x-1 sm:space-x-2">
                              {review.verified ? (
                                <button
                                  onClick={() =>
                                    handleVerifyReview(review._id, false)
                                  }
                                  disabled={loading}
                                  className="p-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors disabled:opacity-50 text-sm"
                                  title="Unverify"
                                >
                                  <FiX />
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleVerifyReview(review._id, true)
                                  }
                                  disabled={loading}
                                  className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 text-sm"
                                  title="Verify"
                                >
                                  <FiCheck />
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteReview(review._id)}
                                disabled={loading}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 text-sm"
                                title="Delete"
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Review Stats */}
              {reviews.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {reviews.length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Total Reviews
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {reviews.filter((r) => r.verified).length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Verified
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                        {reviews.filter((r) => !r.verified).length}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Pending
                      </div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                        {reviews.length > 0
                          ? (
                              reviews.reduce((sum, r) => sum + r.rating, 0) /
                              reviews.length
                            ).toFixed(1)
                          : '0.0'}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Avg Rating
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
