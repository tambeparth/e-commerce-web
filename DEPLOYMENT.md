# 🚀 Deployment Guide for E-Commerce Website

## 📋 Overview
This guide will help you deploy your e-commerce website on Vercel. The project consists of:
- **Frontend**: React app (in `intern` folder)
- **Backend**: Node.js/Express API (in `backend` folder)

## 🔧 Prerequisites
1. GitHub account
2. Vercel account (free)
3. MongoDB Atlas account (free) for production database

## 📂 Step 1: Prepare Your Code

### Push to GitHub
```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## 🗄️ Step 2: Setup MongoDB Atlas (Production Database)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string (replace `<password>` with your actual password)
5. Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/e-commerce`

## 🚀 Step 3: Deploy Backend to Vercel

1. Go to [Vercel](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your repository
5. **Important**: Set root directory to `backend`
6. Add environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: secret_ecom
7. Deploy

## 🌐 Step 4: Deploy Frontend to Vercel

1. Create another new project on Vercel
2. Import the same repository
3. **Important**: Set root directory to `intern`
4. Add environment variables:
   - `REACT_APP_API_URL`: Your backend URL from step 3 (e.g., https://your-backend.vercel.app)
5. Deploy

## ✅ Step 5: Test Your Deployment

1. Visit your frontend URL
2. Test all features:
   - Home page loading
   - Product search
   - Add to cart
   - User registration/login

## 🔧 Alternative: Deploy Both as Separate Repositories

### Option A: Split into two repositories
1. Create `ecommerce-frontend` repo with `intern` folder contents
2. Create `ecommerce-backend` repo with `backend` folder contents
3. Deploy each separately on Vercel

### Option B: Use different deployment services
- **Frontend**: Vercel, Netlify, or GitHub Pages
- **Backend**: Vercel, Railway, Heroku, or Render

## 📝 Environment Variables Summary

### Backend (.env)
```
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/e-commerce
JWT_SECRET=secret_ecom
```

### Frontend (.env)
```
REACT_APP_API_URL=https://your-backend-url.vercel.app
```

## 🐛 Common Issues & Solutions

1. **CORS Error**: Make sure your backend allows your frontend domain
2. **Database Connection**: Verify MongoDB Atlas connection string
3. **API Not Found**: Check if backend URL is correct in frontend
4. **Build Errors**: Ensure all dependencies are in package.json

## 📞 Support
If you encounter issues, check:
1. Vercel deployment logs
2. Browser console for errors
3. Network tab for failed API calls
