# Free Deployment Guide - Job Portal

This guide will help you deploy your full-stack job portal application completely free using modern cloud platforms.

## 🎯 Deployment Stack (100% Free)

- **Frontend**: Vercel or Netlify
- **Backend**: Render.com (Free tier)
- **Database**: Neon.tech or Supabase (PostgreSQL - Free tier)
- **File Storage**: Cloudinary (Free tier for images/resumes)

---

## 📋 Prerequisites

1. GitHub account
2. Accounts on deployment platforms (all free):
   - Vercel/Netlify
   - Render.com
   - Neon.tech or Supabase
   - Cloudinary (optional, for file uploads)

---

## 🗄️ Step 1: Deploy PostgreSQL Database (Neon.tech)

### Option A: Neon.tech (Recommended)

1. **Sign up at [Neon.tech](https://neon.tech)**
   - Free tier: 0.5 GB storage, 1 project

2. **Create a new project**
   - Click "Create Project"
   - Choose a region closest to you
   - Note down the connection string

3. **Get your connection details**
   ```
   Host: ep-xxx.neon.tech
   Database: neondb
   User: your-username
   Password: your-password
   Connection String: postgresql://user:password@host/database?sslmode=require
   ```

### Option B: Supabase

1. **Sign up at [Supabase.com](https://supabase.com)**
2. **Create new project**
3. **Get connection string** from Settings > Database

---

## 🚀 Step 2: Deploy Backend (Render.com)

### 2.1 Prepare Backend for Deployment

1. **Update `package.json`** (already done):
   ```json
   {
     "scripts": {
       "start": "node server.js",
       "dev": "nodemon server.js"
     },
     "engines": {
       "node": ">=18.0.0"
     }
   }
   ```

2. **Create `.gitignore`** in backend folder:
   ```
   node_modules/
   .env
   uploads/
   *.log
   ```

3. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/job-portal.git
   git push -u origin main
   ```

### 2.2 Deploy on Render

1. **Sign up at [Render.com](https://render.com)**

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select the repository

3. **Configure the service**:
   ```
   Name: job-portal-backend
   Region: Choose closest to you
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

4. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=5000
   
   # Database (from Neon.tech)
   DB_HOST=ep-xxx.neon.tech
   DB_PORT=5432
   DB_NAME=neondb
   DB_USER=your-username
   DB_PASSWORD=your-password
   
   # JWT
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   JWT_EXPIRE=7d
   
   # File Upload
   MAX_FILE_SIZE=5242880
   
   # CORS (will add frontend URL later)
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

5. **Deploy** - Render will automatically build and deploy

6. **Note your backend URL**: `https://job-portal-backend.onrender.com`

⚠️ **Important**: Free tier on Render spins down after 15 minutes of inactivity. First request may take 30-60 seconds.

---

## 🎨 Step 3: Deploy Frontend (Vercel)

### 3.1 Prepare Frontend

1. **Create `.env.production`** in frontend folder:
   ```env
   VITE_API_URL=https://job-portal-backend.onrender.com/api
   ```

2. **Update `package.json`** (already done):
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview"
     }
   }
   ```

3. **Create `vercel.json`** in frontend folder:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```

### 3.2 Deploy on Vercel

1. **Sign up at [Vercel.com](https://vercel.com)**

2. **Import Project**
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project**:
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variable**:
   ```
   VITE_API_URL=https://job-portal-backend.onrender.com/api
   ```

5. **Deploy** - Vercel will build and deploy automatically

6. **Note your frontend URL**: `https://job-portal-xxx.vercel.app`

### 3.3 Update Backend CORS

Go back to Render.com and update the `FRONTEND_URL` environment variable:
```
FRONTEND_URL=https://job-portal-xxx.vercel.app
```

---

## 📁 Step 4: File Upload Setup (Optional - Cloudinary)

Since free hosting doesn't persist uploaded files, use Cloudinary for file storage.

### 4.1 Setup Cloudinary

1. **Sign up at [Cloudinary.com](https://cloudinary.com)**
   - Free tier: 25 GB storage, 25 GB bandwidth/month

2. **Get credentials** from Dashboard:
   ```
   Cloud Name: your-cloud-name
   API Key: your-api-key
   API Secret: your-api-secret
   ```

### 4.2 Update Backend for Cloudinary

1. **Install Cloudinary SDK**:
   ```bash
   cd backend
   npm install cloudinary multer-storage-cloudinary
   ```

2. **Update `middleware/upload.js`**:
   ```javascript
   const multer = require('multer');
   const cloudinary = require('cloudinary').v2;
   const { CloudinaryStorage } = require('multer-storage-cloudinary');

   // Configure Cloudinary
   cloudinary.config({
     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
     api_key: process.env.CLOUDINARY_API_KEY,
     api_secret: process.env.CLOUDINARY_API_SECRET,
   });

   // Configure storage
   const storage = new CloudinaryStorage({
     cloudinary: cloudinary,
     params: {
       folder: 'job-portal',
       allowed_formats: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
       resource_type: 'auto',
     },
   });

   const upload = multer({
     storage: storage,
     limits: {
       fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024
     },
   });

   module.exports = upload;
   ```

3. **Add Cloudinary env variables to Render**:
   ```
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   ```

---

## ✅ Step 5: Final Checks

### Test Your Deployment

1. **Frontend**: Visit your Vercel URL
2. **Backend Health**: Visit `https://your-backend.onrender.com/api/health`
3. **Database**: Try registering a new user
4. **File Upload**: Try uploading a resume/avatar

### Common Issues & Solutions

#### Backend not responding
- **Issue**: Render free tier spins down after inactivity
- **Solution**: First request takes 30-60 seconds. Be patient!

#### CORS errors
- **Issue**: Frontend can't connect to backend
- **Solution**: Ensure `FRONTEND_URL` in backend matches your Vercel URL exactly

#### Database connection failed
- **Issue**: Can't connect to PostgreSQL
- **Solution**: 
  - Check connection string is correct
  - Ensure `?sslmode=require` is in connection string for Neon
  - Verify database credentials

#### File uploads not working
- **Issue**: Files not persisting on Render
- **Solution**: Use Cloudinary (Step 4) or another cloud storage service

---

## 🔄 Continuous Deployment

Both Vercel and Render support automatic deployments:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```

2. **Automatic Deploy**: Both platforms will automatically rebuild and deploy

---

## 💰 Cost Breakdown (All FREE!)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Neon.tech** | ✅ Free | 0.5 GB storage, 1 project |
| **Render.com** | ✅ Free | 750 hours/month, sleeps after 15 min |
| **Vercel** | ✅ Free | 100 GB bandwidth, unlimited projects |
| **Cloudinary** | ✅ Free | 25 GB storage, 25 GB bandwidth/month |

**Total Monthly Cost: $0** 🎉

---

## 🚀 Alternative Free Options

### Backend Alternatives
- **Railway.app** - $5 free credit monthly
- **Fly.io** - Free tier available
- **Cyclic.sh** - Free tier for Node.js apps

### Database Alternatives
- **ElephantSQL** - 20 MB free PostgreSQL
- **Heroku Postgres** - Free tier (with Heroku account)
- **PlanetScale** - Free MySQL (would need schema changes)

### Frontend Alternatives
- **Netlify** - Similar to Vercel, 100 GB bandwidth
- **GitHub Pages** - Free static hosting
- **Cloudflare Pages** - Unlimited bandwidth

---

## 📝 Post-Deployment Checklist

- [ ] Frontend deployed and accessible
- [ ] Backend deployed and responding
- [ ] Database connected and working
- [ ] User registration working
- [ ] User login working
- [ ] File uploads working (with Cloudinary)
- [ ] Job posting working
- [ ] Applications working
- [ ] Custom domain configured (optional)

---

## 🔒 Security Recommendations

1. **Change JWT_SECRET** to a strong random string
2. **Enable HTTPS** (automatic on Vercel/Render)
3. **Set strong database password**
4. **Enable rate limiting** (already configured)
5. **Regular backups** of database (Neon provides automatic backups)

---

## 📞 Support & Resources

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **Cloudinary Docs**: https://cloudinary.com/documentation

---

## 🎉 You're Live!

Your job portal is now deployed and accessible worldwide for FREE! 

**Share your URLs**:
- Frontend: `https://your-app.vercel.app`
- Backend API: `https://your-backend.onrender.com`

Happy deploying! 🚀
