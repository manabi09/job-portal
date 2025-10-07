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