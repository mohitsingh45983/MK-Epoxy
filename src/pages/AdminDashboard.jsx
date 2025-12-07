import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FiEdit2,
  FiSave,
  FiX,
  FiLogOut,
  FiDollarSign,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiGlobe,
} from 'react-icons/fi'
import axios from 'axios'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('pricing') // 'pricing' or 'contact'
  const [pricing, setPricing] = useState([])
  const [contactInfo, setContactInfo] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({})
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

  useEffect(() => {
    // Check if admin is logged in
    const token = localStorage.getItem('adminToken')
    if (!token) {
      navigate('/admin/login')
      return
    }

    fetchPricing()
    fetchContactInfo()
  }, [navigate])

  const fetchPricing = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('/api/admin/pricing', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.data.success) {
        setPricing(response.data.pricing)
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('adminToken')
        localStorage.removeItem('adminUser')
        navigate('/admin/login')
      }
    }
  }

  const fetchContactInfo = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.get('/api/admin/contact', {
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

  const handleEdit = (service) => {
    setEditingId(service._id)
    setEditValues({
      pricePerSqft: service.pricePerSqft,
      isActive: service.isActive,
    })
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditValues({})
  }

  const handleSave = async (id) => {
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.put(
        `/api/admin/pricing/${id}`,
        editValues,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.success) {
        setMessage({ type: 'success', text: 'Pricing updated successfully!' })
        setEditingId(null)
        fetchPricing()
        setTimeout(() => setMessage({ type: '', text: '' }), 3000)
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to update pricing',
      })
      setTimeout(() => setMessage({ type: '', text: '' }), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleContactSave = async () => {
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const token = localStorage.getItem('adminToken')
      const response = await axios.put('/api/admin/contact', contactEditValues, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

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
          error.response?.data?.message || 'Failed to update contact information',
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

  return (
    <div className="pt-20 min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom section-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage service pricing and contact information
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="btn-secondary flex items-center space-x-2"
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </motion.div>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-6 py-3 font-semibold transition-colors ${
              activeTab === 'pricing'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400'
            }`}
          >
            Service Pricing
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

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <table className="w-full min-w-[640px]">
                <thead className="bg-primary-600 text-white">
                  <tr>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-semibold text-sm sm:text-base">Service</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-semibold text-sm sm:text-base">
                      Price per sqft (₹)
                    </th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-semibold text-sm sm:text-base">Status</th>
                    <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-center font-semibold text-sm sm:text-base">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pricing.map((service, index) => (
                    <motion.tr
                      key={service._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-medium text-sm sm:text-base">
                        {service.serviceName}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        {editingId === service._id ? (
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editValues.pricePerSqft}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                pricePerSqft: parseFloat(e.target.value),
                              })
                            }
                            className="w-24 sm:w-32 px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                          />
                        ) : (
                          <span className="flex items-center space-x-2">
                            <FiDollarSign className="text-primary-600 dark:text-primary-400" />
                            <span className="font-semibold">
                              {service.pricePerSqft}
                            </span>
                          </span>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        {editingId === service._id ? (
                          <select
                            value={editValues.isActive}
                            onChange={(e) =>
                              setEditValues({
                                ...editValues,
                                isActive: e.target.value === 'true',
                              })
                            }
                            className="px-2 sm:px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 text-sm sm:text-base"
                          >
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </select>
                        ) : (
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              service.isActive
                                ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            }`}
                          >
                            {service.isActive ? 'Active' : 'Inactive'}
                          </span>
                        )}
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-4">
                        <div className="flex justify-center space-x-1 sm:space-x-2">
                          {editingId === service._id ? (
                            <>
                              <button
                                onClick={() => handleSave(service._id)}
                                disabled={loading}
                                className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50"
                                title="Save"
                              >
                                <FiSave />
                              </button>
                              <button
                                onClick={handleCancel}
                                className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                                title="Cancel"
                              >
                                <FiX />
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => handleEdit(service)}
                              className="p-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
                              title="Edit"
                            >
                              <FiEdit2 />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
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
                <p>No contact information found. Fill in the details below and save to create it.</p>
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
                  <span>{loading ? 'Saving...' : 'Save Contact Information'}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {pricing.length === 0 && activeTab === 'pricing' && (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              No pricing data found. Please initialize pricing first.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
