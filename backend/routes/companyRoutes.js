const express = require('express');
const {
  getCompanies,
  getCompany,
  createCompany,
  updateCompany,
  deleteCompany,
  getMyCompany,
  uploadLogo
} = require('../controllers/companyController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Public routes
router.get('/', getCompanies);
router.get('/:id', getCompany);

// Protected routes - Employer only
router.post('/', protect, authorize('employer'), createCompany);
router.put('/:id', protect, authorize('employer'), updateCompany);
router.delete('/:id', protect, authorize('employer'), deleteCompany);
router.get('/my/company', protect, authorize('employer'), getMyCompany);
router.post('/:id/logo', protect, authorize('employer'), upload.single('logo'), uploadLogo);

module.exports = router;
