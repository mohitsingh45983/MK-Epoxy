import { FiSun, FiMoon } from 'react-icons/fi'
import { motion } from 'framer-motion'

const ThemeToggle = ({ darkMode, setDarkMode }) => {
  return (
    <motion.button
      onClick={() => setDarkMode(!darkMode)}
      className="fixed top-24 right-6 z-50 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <FiSun className="text-2xl text-yellow-500" />
      ) : (
        <FiMoon className="text-2xl text-gray-700" />
      )}
    </motion.button>
  )
}

export default ThemeToggle

