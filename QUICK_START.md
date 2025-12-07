# Quick Start Guide - MK Epoxy Website

## 🚀 Getting Started in 5 Minutes

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Environment Variables

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/mk_epoxy
PORT=5000
```

For MongoDB Atlas (cloud):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mk_epoxy
PORT=5000
```

### Step 3: Start MongoDB

**Option A: Local MongoDB**

- Make sure MongoDB is installed and running on your system
- Default connection: `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Recommended for beginners)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `MONGODB_URI` in `.env`

### Step 4: Run the Application

**Terminal 1 - Frontend:**

```bash
npm run dev
```

Frontend will run on: http://localhost:3000

**Terminal 2 - Backend:**

```bash
npm run server
```

Backend will run on: http://localhost:5000

### Step 5: Access the Website

Open your browser and go to: **http://localhost:3000**

## 📝 Customization Checklist

### Essential Updates:

- [ ] Update WhatsApp number in:

  - `src/components/WhatsAppButton.jsx`
  - `src/pages/Contact.jsx`
  - `src/pages/Home.jsx`

- [ ] Update contact information in:

  - `src/pages/Contact.jsx`
  - `src/components/Footer.jsx`

- [ ] Update Google Maps location in:

  - `src/pages/Contact.jsx` (replace the iframe src)

- [ ] Update company information:
  - Company name, tagline, and description in `src/pages/Home.jsx
  - About us content in `src/pages/About.jsx`

### Optional Enhancements:

- [ ] Set up email notifications (add email credentials to `.env`)
- [ ] Add Google Business Place ID for reviews
- [ ] Replace placeholder images with actual project photos
- [ ] Add video reviews
- [ ] Configure payment gateway
- [ ] Set up analytics (Google Analytics, etc.)

## 🎨 Features Included

✅ Responsive design (mobile, tablet, desktop)
✅ Dark/Light theme toggle
✅ WhatsApp integration
✅ Image gallery with lightbox
✅ Quotation form with image upload
✅ Contact form
✅ Google Maps integration
✅ Reviews system
✅ SEO optimized
✅ Fast loading with Vite

## 🐛 Troubleshooting

### MongoDB Connection Error

- Check if MongoDB is running
- Verify connection string in `.env`
- For Atlas: Check IP whitelist and credentials

### Port Already in Use

- Change `PORT` in `.env` for backend
- Change port in `vite.config.js` for frontend

### Images Not Loading

- Ensure gallery folder is in the root directory
- Check image paths in components

### Form Submission Not Working

- Ensure backend server is running
- Check browser console for errors
- Verify API endpoint in network tab

## 📞 Need Help?

Check the main `README.md` for detailed documentation.

