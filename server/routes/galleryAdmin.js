const express = require('express')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const GalleryImage = require('../models/GalleryImage')
const BeforeAfter = require('../models/BeforeAfter')
const cloudinary = require('../utils/cloudinary')

const router = express.Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
})

const verifyAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    )
    req.adminId = decoded.adminId
    next()
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

const isCloudinaryConfigured =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET

// Admin: list gallery images
router.get('/images', verifyAdmin, async (_req, res) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: -1 })
    res.json({ success: true, images })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery images',
      error: error.message,
    })
  }
})

// Admin: upload a gallery image
router.post(
  '/images',
  verifyAdmin,
  upload.single('image'),
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Image file is required',
      })
    }

    if (!isCloudinaryConfigured) {
      return res.status(500).json({
        success: false,
        message:
          'Image upload is not configured. Please set Cloudinary env variables.',
      })
    }

    try {
      const folder = process.env.CLOUDINARY_GALLERY_FOLDER || 'mk-epoxy/gallery'
      const { title = '', description = '' } = req.body

      const uploadResult = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            resource_type: 'image',
            transformation: [{ width: 1600, height: 1600, crop: 'limit' }],
          },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )
        stream.end(req.file.buffer)
      })

      const image = new GalleryImage({
        title,
        description,
        imageUrl: uploadResult.secure_url,
        imagePublicId: uploadResult.public_id,
        order: parseInt(req.body.order, 10) || 0,
      })

      await image.save()
      res.status(201).json({
        success: true,
        message: 'Image uploaded successfully',
        image,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error uploading image',
        error: error.message,
      })
    }
  }
)

// Admin: delete gallery image
router.delete('/images/:id', verifyAdmin, async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id)
    if (!image) {
      return res
        .status(404)
        .json({ success: false, message: 'Image not found' })
    }

    if (image.imagePublicId && isCloudinaryConfigured) {
      await cloudinary.uploader.destroy(image.imagePublicId)
    }

    await image.deleteOne()
    res.json({ success: true, message: 'Image deleted successfully' })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting image',
      error: error.message,
    })
  }
})

// Admin: list before/after items
router.get('/before-after', verifyAdmin, async (_req, res) => {
  try {
    const items = await BeforeAfter.find().sort({ createdAt: -1 })
    res.json({ success: true, items })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching before/after items',
      error: error.message,
    })
  }
})

// Admin: upload before/after
router.post(
  '/before-after',
  verifyAdmin,
  upload.fields([
    { name: 'before', maxCount: 1 },
    { name: 'after', maxCount: 1 },
  ]),
  async (req, res) => {
    if (!req.files?.before?.[0] || !req.files?.after?.[0]) {
      return res.status(400).json({
        success: false,
        message: 'Both before and after images are required',
      })
    }

    if (!isCloudinaryConfigured) {
      return res.status(500).json({
        success: false,
        message:
          'Image upload is not configured. Please set Cloudinary env variables.',
      })
    }

    try {
      const folder =
        process.env.CLOUDINARY_BEFORE_AFTER_FOLDER || 'mk-epoxy/before-after'
      const { title = '', description = '' } = req.body

      const uploadImage = (fileBuffer, label) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: `${folder}/${label}`,
              resource_type: 'image',
              transformation: [{ width: 1600, height: 1600, crop: 'limit' }],
            },
            (error, result) => {
              if (error) return reject(error)
              resolve(result)
            }
          )
          stream.end(fileBuffer)
        })

      const [beforeUpload, afterUpload] = await Promise.all([
        uploadImage(req.files.before[0].buffer, 'before'),
        uploadImage(req.files.after[0].buffer, 'after'),
      ])

      const item = new BeforeAfter({
        title,
        description,
        beforeUrl: beforeUpload.secure_url,
        beforePublicId: beforeUpload.public_id,
        afterUrl: afterUpload.secure_url,
        afterPublicId: afterUpload.public_id,
        order: parseInt(req.body.order, 10) || 0,
      })

      await item.save()
      res.status(201).json({
        success: true,
        message: 'Before/After uploaded successfully',
        item,
      })
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error uploading before/after images',
        error: error.message,
      })
    }
  }
)

// Admin: delete before/after
router.delete('/before-after/:id', verifyAdmin, async (req, res) => {
  try {
    const item = await BeforeAfter.findById(req.params.id)
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found' })
    }

    if (isCloudinaryConfigured) {
      if (item.beforePublicId) {
        await cloudinary.uploader.destroy(item.beforePublicId)
      }
      if (item.afterPublicId) {
        await cloudinary.uploader.destroy(item.afterPublicId)
      }
    }

    await item.deleteOne()
    res.json({ success: true, message: 'Before/After deleted successfully' })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting before/after item',
      error: error.message,
    })
  }
})

module.exports = router
