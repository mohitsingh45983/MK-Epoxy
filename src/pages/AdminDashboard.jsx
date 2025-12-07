import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiEdit2, FiSave, FiX, FiLogOut, FiDollarSign } from 'react-icons/fi'
import axios from 'axios'

const AdminDashboard = () => {
  const [pricing, setPricing] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [editValues, setEditValues] = useState({})
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
              Manage service pricing rates
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

        {/* Pricing Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-primary-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold">Service</th>
                  <th className="px-6 py-4 text-left font-semibold">
                    Price per sqft (₹)
                  </th>
                  <th className="px-6 py-4 text-left font-semibold">Status</th>
                  <th className="px-6 py-4 text-center font-semibold">
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
                    <td className="px-6 py-4 font-medium">
                      {service.serviceName}
                    </td>
                    <td className="px-6 py-4">
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
                          className="w-32 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
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
                    <td className="px-6 py-4">
                      {editingId === service._id ? (
                        <select
                          value={editValues.isActive}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              isActive: e.target.value === 'true',
                            })
                          }
                          className="px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500"
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
                    <td className="px-6 py-4">
                      <div className="flex justify-center space-x-2">
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

        {pricing.length === 0 && (
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

