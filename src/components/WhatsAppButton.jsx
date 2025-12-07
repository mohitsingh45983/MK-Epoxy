import { useState, useEffect } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { motion } from 'framer-motion'
import axios from 'axios'

const WhatsAppButton = () => {
  const [whatsappNumber, setWhatsappNumber] = useState('917339723912')

  useEffect(() => {
    fetchContactInfo()
  }, [])

  const fetchContactInfo = async () => {
    try {
      const response = await axios.get('/api/contact-info')
      if (response.data.success && response.data.contactInfo.whatsapp) {
        setWhatsappNumber(response.data.contactInfo.whatsapp)
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
      // Use default if API fails
    }
  }

  const message = 'Hello! I would like to know more about your services.'

  const handleClick = () => {
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      '_blank'
    )
  }

  return (
    <motion.button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20BA5A] text-white p-4 rounded-full shadow-2xl flex items-center justify-center group"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
    >
      <FaWhatsapp className="text-2xl sm:text-3xl" />
      <span className="hidden sm:block absolute right-full mr-3 bg-gray-900 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
        Chat on WhatsApp
      </span>
    </motion.button>
  )
}

export default WhatsAppButton
