const express = require('express');
const {
  applyForJob,
  getMyApplications,
  getApplication,
  getJobApplications,
  updateApplicationStatus,
  withdrawApplication,
  addNote
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Job Seeker routes
router.post('/', protect, authorize('jobseeker'), applyForJob);
router.get('/', protect, authorize('jobseeker'), getMyApplications);
router.put('/:id/withdraw', protect, authorize('jobseeker'), withdrawApplication);

// Employer routes
router.get('/job/:jobId', protect, authorize('employer'), getJobApplications);
router.put('/:id/status', protect, authorize('employer'), updateApplicationStatus);
router.post('/:id/notes', protect, authorize('employer'), addNote);

// Common routes
router.get('/:id', protect, getApplication);

module.exports = router;
