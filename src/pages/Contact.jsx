import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi'
import { FaWhatsapp } from 'react-icons/fa'
import axios from 'axios'

const Contact = () => {
  const [contactInfo, setContactInfo] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContactInfo()
  }, [])

  const fetchContactInfo = async () => {
    try {
      const response = await axios.get('/api/contact-info')
      if (response.data.success) {
        setContactInfo(response.data.contactInfo)
      }
    } catch (error) {
      console.error('Error fetching contact info:', error)
      // Use default values if API fails
      setContactInfo({
        phone: '+91 73397 23912',
        whatsapp: '917339723912',
        email: 'info@mkepoxy.com',
        alternateEmail: 'support@mkepoxy.com',
        address: {
          street: 'Your Business Address',
          city: 'City',
          state: 'State',
          pincode: 'PIN Code',
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
    } finally {
      setLoading(false)
    }
  }

  if (loading || !contactInfo) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  const fullAddress = [
    contactInfo.address?.street,
    contactInfo.address?.city,
    contactInfo.address?.state,
    contactInfo.address?.pincode,
    contactInfo.address?.country,
  ]
    .filter(Boolean)
    .join(', ')

  const contactInfoList = [
    {
      icon: <FiPhone className="text-3xl" />,
      title: 'Phone',
      details: [contactInfo.phone],
      link: `tel:${contactInfo.phone.replace(/\s/g, '')}`,
    },
    {
      icon: <FaWhatsapp className="text-3xl" />,
      title: 'WhatsApp',
      details: [contactInfo.phone],
      link: `https://wa.me/${contactInfo.whatsapp}`,
      isExternal: true,
    },
    {
      icon: <FiMail className="text-3xl" />,
      title: 'Email',
      details: [
        contactInfo.email,
        ...(contactInfo.alternateEmail ? [contactInfo.alternateEmail] : []),
      ],
      link: `mailto:${contactInfo.email}`,
    },
    {
      icon: <FiMapPin className="text-3xl" />,
      title: 'Address',
      details: fullAddress ? [fullAddress] : ['Address not set'],
      link: null,
    },
    {
      icon: <FiClock className="text-3xl" />,
      title: 'Working Hours',
      details: [
        contactInfo.workingHours?.weekdays || 'Monday - Saturday: 9:00 AM - 7:00 PM',
        contactInfo.workingHours?.weekend || 'Sunday: Closed',
      ],
      link: null,
    },
  ]

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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Get in touch with us for any queries or to discuss your project
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {contactInfoList.map((info, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="text-primary-600 dark:text-primary-400 mb-4">
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{info.title}</h3>
                <div className="space-y-1">
                  {info.details.map((detail, detailIndex) => (
                    <p
                      key={detailIndex}
                      className="text-gray-600 dark:text-gray-400"
                    >
                      {detail}
                    </p>
                  ))}
                </div>
                {info.link && (
                  <a
                    href={info.link}
                    target={info.isExternal ? '_blank' : undefined}
                    rel={info.isExternal ? 'noopener noreferrer' : undefined}
                    className="mt-4 inline-block text-primary-600 dark:text-primary-400 font-semibold hover:underline"
                  >
                    {info.title === 'WhatsApp' ? 'Chat Now' : 'Contact'}
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Google Map */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h2 className="text-4xl font-bold mb-4">Find Us</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Visit our office or get directions
            </p>
          </motion.div>

          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
            {contactInfo.googleMapsUrl ? (
              <iframe
                src={contactInfo.googleMapsUrl}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
                title="Business Location"
              ></iframe>
            ) : (
              <div className="h-96 flex items-center justify-center bg-gray-200 dark:bg-gray-700">
                <p className="text-gray-500 dark:text-gray-400">
                  Map location not configured. Please add Google Maps URL in admin dashboard.
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 text-center">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(fullAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-block"
            >
              Get Directions
            </a>
          </div>
        </div>
      </section>

      {/* Quick Contact CTA */}
      <section className="section-padding bg-primary-600 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Ready to Start Your Project?
            </h2>
            <p className="text-xl mb-8 text-primary-100">
              Contact us today for a free consultation and quotation
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href={`tel:${contactInfo.phone.replace(/\s/g, '')}`}
                className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-primary-50 transition-colors inline-flex items-center space-x-2"
              >
                <FiPhone />
                <span>Call Now</span>
              </a>
              <a
                href={`https://wa.me/${contactInfo.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center space-x-2"
              >
                <FaWhatsapp />
                <span>WhatsApp</span>
              </a>
              <a
                href="/quotation"
                className="bg-white text-primary-600 font-semibold py-3 px-8 rounded-lg hover:bg-primary-50 transition-colors inline-block"
              >
                Get Quotation
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Contact
