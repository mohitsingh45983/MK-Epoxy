import { Link } from 'react-router-dom'
import { FiPhone, FiMail, FiMapPin, FiClock, FiLock } from 'react-icons/fi'
import { FaWhatsapp, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-black text-gray-300">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/gallery/logo.jpg"
                alt="MK Epoxy Logo"
                className="h-10 w-10 rounded-full object-cover"
              />
              <span className="text-xl font-bold text-white">MK Epoxy</span>
            </div>
            <p className="text-sm mb-4">
              Premium waterproofing and epoxy flooring solutions with 10+ years
              of experience. Quality guaranteed.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-2xl hover:text-primary-400 transition-colors"
              >
                <FaFacebook />
              </a>
              <a
                href="#"
                className="text-2xl hover:text-primary-400 transition-colors"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                className="text-2xl hover:text-primary-400 transition-colors"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="hover:text-primary-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="hover:text-primary-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="hover:text-primary-400 transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/gallery"
                  className="hover:text-primary-400 transition-colors"
                >
                  Gallery
                </Link>
              </li>
              <li>
                <Link
                  to="/quotation"
                  className="hover:text-primary-400 transition-colors"
                >
                  Get Quote
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li>Epoxy Flooring</li>
              <li>Waterproofing</li>
              <li>PU Flooring</li>
              <li>Industrial Coating</li>
              <li>Crack Filling</li>
              <li>Expansion Joint Treatment</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <FiPhone className="mt-1 text-primary-400" />
                <span>+91 73397 23912</span>
              </li>
              <li className="flex items-start space-x-3">
                <FiMail className="mt-1 text-primary-400" />
                <span>info@mkepoxy.com</span>
              </li>
              <li className="flex items-start space-x-3">
                <FiMapPin className="mt-1 text-primary-400" />
                <span>Your Business Address, City, State - PIN</span>
              </li>
              <li className="flex items-start space-x-3">
                <FiClock className="mt-1 text-primary-400" />
                <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} MK Epoxy. All rights reserved.
            </p>
            <Link
              to="/admin/login"
              className="flex items-center space-x-2 text-sm text-gray-400 hover:text-primary-400 transition-colors"
            >
              <FiLock className="text-sm" />
              <span>Login as Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

