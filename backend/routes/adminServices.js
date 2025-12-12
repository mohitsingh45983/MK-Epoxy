const express = require('express')
const multer = require('multer')
const jwt = require('jsonwebtoken')
const Service = require('../models/Service')
const ServicePricing = require('../models/ServicePricing')
const cloudinary = require('../utils/cloudinary')

const router = express.Router()
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
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

const slugify = (text) =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

const parseList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).map((item) => item.trim())
  if (typeof value === 'string') {
    return value
      .split(/[\n,]/)
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

const generateUniqueSlug = async (title, existingId) => {
  const baseSlug = slugify(title || 'service')
  let candidate = baseSlug
  let suffix = 1

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const conflict = await Service.findOne({
      slug: candidate,
      ...(existingId ? { _id: { $ne: existingId } } : {}),
    })
    if (!conflict) return candidate
    candidate = `${baseSlug}-${suffix}`
    suffix += 1
  }
}

// Admin: list all services (including inactive)
router.get('/', verifyAdmin, async (_req, res) => {
  try {
    const services = await Service.find().sort({ order: 1, title: 1 })
    res.json({ success: true, services })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching services',
      error: error.message,
    })
  }
})

// Admin: create service
router.post('/', verifyAdmin, upload.single('coverImage'), async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      description,
      benefits,
      processSteps,
      warranty,
      ratePerSqft,
      isActive = true,
      order = 0,
      slug,
    } = req.body

    if (!title) {
      return res
        .status(400)
        .json({ success: false, message: 'Title is required' })
    }

    let coverImageUrl = ''
    let coverImagePublicId = ''

    if (req.file) {
      if (!isCloudinaryConfigured) {
        return res.status(500).json({
          success: false,
          message:
            'Image upload is not configured. Please set Cloudinary env variables.',
        })
      }

      const folder = process.env.CLOUDINARY_SERVICES_FOLDER || 'mk-epoxy/services'
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

      coverImageUrl = uploadResult.secure_url
      coverImagePublicId = uploadResult.public_id
    }

    const parsedBenefits = parseList(benefits)
    const parsedProcessSteps = parseList(processSteps)
    const finalSlug = slug
      ? slugify(slug)
      : await generateUniqueSlug(title)

    const existingSlug = await Service.findOne({ slug: finalSlug })
    if (existingSlug) {
      return res.status(400).json({
        success: false,
        message: 'Slug already exists. Please use a different name or slug.',
      })
    }

    const service = new Service({
      title,
      slug: finalSlug,
      shortDescription,
      description,
      benefits: parsedBenefits,
      processSteps: parsedProcessSteps,
      warranty,
      ratePerSqft: ratePerSqft ? Number(ratePerSqft) : undefined,
      coverImageUrl,
      coverImagePublicId,
      isActive: isActive === 'false' ? false : Boolean(isActive),
      order: Number(order) || 0,
    })

    await service.save()

    // Keep pricing in sync when a new service is created
    const finalRate = ratePerSqft !== undefined && ratePerSqft !== '' && ratePerSqft !== null
      ? Number(ratePerSqft)
      : (service.ratePerSqft || 0)
    
    const finalIsActive = isActive === 'false' ? false : Boolean(isActive)
    
    await ServicePricing.findOneAndUpdate(
      { serviceName: title },
      {
        serviceName: title,
        pricePerSqft: finalRate,
        isActive: finalIsActive,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      service,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating service',
      error: error.message,
    })
  }
})

// Admin: update service
router.put('/:id', verifyAdmin, upload.single('coverImage'), async (req, res) => {
  try {
    const {
      title,
      shortDescription,
      description,
      benefits,
      processSteps,
      warranty,
      ratePerSqft,
      isActive,
      order,
      slug,
    } = req.body

    const service = await Service.findById(req.params.id)
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: 'Service not found' })
    }

    const previousTitle = service.title

    if (title) service.title = title
    if (shortDescription !== undefined) service.shortDescription = shortDescription
    if (description !== undefined) service.description = description
    if (benefits !== undefined) service.benefits = parseList(benefits)
    if (processSteps !== undefined) service.processSteps = parseList(processSteps)
    if (warranty !== undefined) service.warranty = warranty
    if (ratePerSqft !== undefined) service.ratePerSqft = Number(ratePerSqft)
    if (isActive !== undefined) service.isActive = isActive === 'false' ? false : Boolean(isActive)
    if (order !== undefined) service.order = Number(order) || 0

    if (slug) {
      const finalSlug = slugify(slug)
      const conflict = await Service.findOne({
        slug: finalSlug,
        _id: { $ne: req.params.id },
      })
      if (conflict) {
        return res.status(400).json({
          success: false,
          message: 'Slug already exists. Please choose a different one.',
        })
      }
      service.slug = finalSlug
    } else if (title) {
      service.slug = await generateUniqueSlug(title, req.params.id)
    }

    if (req.file) {
      if (!isCloudinaryConfigured) {
        return res.status(500).json({
          success: false,
          message:
            'Image upload is not configured. Please set Cloudinary env variables.',
        })
      }

      // Delete old image if exists
      if (service.coverImagePublicId) {
        try {
          await cloudinary.uploader.destroy(service.coverImagePublicId)
        } catch (error) {
          // Ignore deletion error to avoid blocking update
          console.error('Error deleting old service image:', error.message)
        }
      }

      const folder = process.env.CLOUDINARY_SERVICES_FOLDER || 'mk-epoxy/services'
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

      service.coverImageUrl = uploadResult.secure_url
      service.coverImagePublicId = uploadResult.public_id
    }

    await service.save()

    // Sync pricing record when title/rate/isActive change
    const pricingName = service.title
    if (
      title !== undefined ||
      ratePerSqft !== undefined ||
      isActive !== undefined
    ) {
      const priceToSet =
        ratePerSqft !== undefined && ratePerSqft !== ''
          ? Number(ratePerSqft)
          : service.ratePerSqft

      await ServicePricing.findOneAndUpdate(
        { serviceName: previousTitle },
        {
          serviceName: pricingName,
          pricePerSqft: priceToSet,
          ...(isActive !== undefined
            ? { isActive: isActive === 'false' ? false : Boolean(isActive) }
            : {}),
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    }

    res.json({
      success: true,
      message: 'Service updated successfully',
      service,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating service',
      error: error.message,
    })
  }
})

// Admin: delete service
router.delete('/:id', verifyAdmin, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: 'Service not found' })
    }

    if (service.coverImagePublicId && isCloudinaryConfigured) {
      try {
        await cloudinary.uploader.destroy(service.coverImagePublicId)
      } catch (error) {
        console.error('Error deleting service image:', error.message)
      }
    }

    await service.deleteOne()
    res.json({ success: true, message: 'Service deleted successfully' })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting service',
      error: error.message,
    })
  }
})

module.exports = router


