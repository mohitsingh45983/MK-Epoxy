import { motion } from 'framer-motion'
import {
  FiCheckCircle,
  FiAward,
  FiUsers,
  FiClock,
  FiShield,
} from 'react-icons/fi'

const About = () => {
  const features = [
    {
      icon: <FiUsers className="text-4xl" />,
      title: 'Skilled Team',
      description:
        'Our experienced professionals bring years of expertise to every project',
    },
    {
      icon: <FiClock className="text-4xl" />,
      title: 'On-Time Completion',
      description:
        'We respect deadlines and deliver projects on schedule, every time',
    },
    {
      icon: <FiShield className="text-4xl" />,
      title: 'Warranty on Services',
      description: 'All our work comes with comprehensive warranty coverage',
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About MK Epoxy
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Leading the industry in premium waterproofing and epoxy flooring
              solutions
            </p>
          </motion.div>
        </div>
      </section>

      {/* Company Story */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6">Our Story</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                MK Epoxy was founded with a vision to revolutionize the
                waterproofing and epoxy flooring industry. With over 10 years of
                experience, we have established ourselves as a trusted name in
                delivering high-quality, durable solutions for residential,
                commercial, and industrial projects.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                Our journey began with a simple mission: to provide exceptional
                service and unmatched quality. Today, we stand proud as a
                company that has completed hundreds of successful projects,
                earning the trust and satisfaction of our clients across the
                region.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                We believe in continuous innovation and staying updated with the
                latest technologies and materials in the industry, ensuring our
                clients receive the best solutions available.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <img
                src="/gallery/IMG-20251207-WA0005.jpg"
                alt="Our Team"
                className="rounded-xl shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg"
            >
              <h3 className="text-3xl font-bold mb-4 text-primary-600 dark:text-primary-400">
                Our Mission
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                To deliver exceptional waterproofing and epoxy flooring
                solutions that exceed client expectations, while maintaining the
                highest standards of quality, professionalism, and customer
                service. We strive to build lasting relationships with our
                clients through trust, reliability, and excellence.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg"
            >
              <h3 className="text-3xl font-bold mb-4 text-primary-600 dark:text-primary-400">
                Our Vision
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                To become the leading provider of waterproofing and epoxy
                flooring solutions, recognized for innovation, quality, and
                customer satisfaction. We envision expanding our reach globally
                while maintaining our core values of integrity, excellence, and
                commitment to our clients' success.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              What sets us apart from the competition
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center p-6"
              >
                <div className="text-primary-600 dark:text-primary-400 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section-padding bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              Certifications & Standards
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              We maintain the highest industry standards and certifications
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg max-w-4xl mx-auto"
          >
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <FiCheckCircle className="text-primary-600 dark:text-primary-400 text-2xl mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">ISO Certified</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Quality management systems certified
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <FiCheckCircle className="text-primary-600 dark:text-primary-400 text-2xl mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">
                    Industry Standards
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Compliance with all relevant building codes and standards
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <FiCheckCircle className="text-primary-600 dark:text-primary-400 text-2xl mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">
                    Licensed & Insured
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Fully licensed and insured for your protection
                  </p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <FiCheckCircle className="text-primary-600 dark:text-primary-400 text-2xl mt-1" />
                <div>
                  <h4 className="font-semibold text-lg mb-1">
                    Material Certifications
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    All materials meet or exceed industry specifications
                  </p>
                </div>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default About

