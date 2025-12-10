# MK Epoxy - Premium Waterproofing & Epoxy Flooring Website

A modern, premium website for MK Epoxy - a waterproofing and epoxy flooring company. Built with React, MongoDB, and Express.

## Monorepo Layout

- `frontend/` - Vite/React marketing site and admin UI
- `backend/` - Express/MongoDB API, uploads, and seed scripts

Each side has its own `package.json` and dependencies. Install and run them separately as noted below.

## Features

- 🏠 **Home Page** - Hero banner with company branding, highlights, and service preview
- 📖 **About Us** - Company story, mission, vision, and certifications
- 🛠️ **Services** - Detailed service pages with benefits, process, and warranty
- 📸 **Gallery** - Project gallery with lightbox and before/after sliders
- ⭐ **Reviews** - Client reviews with Google integration and video reviews
- 📝 **Quotation Form** - Lead generation form with image upload
- 📞 **Contact** - Contact information, Google Maps, and quick contact options
- 💬 **WhatsApp Integration** - Floating WhatsApp button for instant communication
- 🌓 **Dark/Light Theme** - Toggle between dark and light modes
- 📱 **Responsive Design** - Fully responsive for all devices
- ⚡ **Fast Performance** - Optimized for speed and SEO

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Framer Motion, Swiper
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Database**: MongoDB, Mongoose
- **File Upload**: Multer
- **Email**: Nodemailer

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev        # starts Vite dev server on port 3000
```

### Backend
```bash
cd backend
npm install
npm start          # starts API server (uses PORT & MONGODB_URI from .env)
```

### Environment

Create a `.env` file in `backend/` with at least:
```
PORT=5000
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
EMAIL_USER=...
EMAIL_PASS=...
```
