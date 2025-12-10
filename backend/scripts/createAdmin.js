const mongoose = require('mongoose')
const Admin = require('../models/Admin')
require('dotenv').config()

const MONGODB_URI =
  process.env.MONGODB_URI

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    const username = process.argv[2] || 'admin'
    const password = process.argv[3] || 'admin123'
    const email = process.argv[4] || 'admin@mkepoxy.com'

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username })
    if (existingAdmin) {
      console.log('Admin already exists!')
      process.exit(0)
    }

    // Create new admin
    const admin = new Admin({
      username,
      password, // Will be hashed by pre-save hook
      email,
    })

    await admin.save()
    console.log('Admin created successfully!')
    console.log(`Username: ${username}`)
    console.log(`Email: ${email}`)
    console.log('Password: (the one you provided)')
    process.exit(0)
  } catch (error) {
    console.error('Error creating admin:', error)
    process.exit(1)
  }
}

createAdmin()

