const { Application, Job, User, Company } = require('../models');

/**
 * @desc    Apply for a job
 * @route   POST /api/applications
 * @access  Private (Job Seeker only)
 */
exports.applyForJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter, answers } = req.body;

    // Check if job exists
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if job is active
    if (job.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This job is no longer accepting applications'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      where: {
        jobId: jobId,
        applicantId: req.user.id
      }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    // Check if user has a resume
    if (!req.user.resume) {
      return res.status(400).json({
        success: false,
        message: 'Please upload your resume before applying'
      });
    }

    // Create application
    const application = await Application.create({
      jobId: jobId,
      applicantId: req.user.id,
      resume: req.user.resume,
      coverLetter,
      answers
    });

    // Increment applications count on job
    await job.increment('applicationsCount');

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all applications for current user
 * @route   GET /api/applications
 * @access  Private (Job Seeker)
 */
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.findAll({
      where: { applicantId: req.user.id },
      include: [{
        model: Job,
        as: 'job',
        include: [{
          model: Company,
          as: 'company',
          attributes: ['name', 'logo']
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single application
 * @route   GET /api/applications/:id
 * @access  Private
 */
exports.getApplication = async (req, res, next) => {
  try {
    const application = await Application.findByPk(req.params.id, {
      include: [
        { model: Job, as: 'job' },
        { model: User, as: 'applicant', attributes: { exclude: ['password'] } }
      ]
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check authorization
    const job = await Job.findByPk(application.jobId);
    if (
      application.applicantId !== req.user.id &&
      job.postedById !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.status(200).json({
      success: true,
      data: application
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all applications for a job
 * @route   GET /api/applications/job/:jobId
 * @access  Private (Employer only)
 */
exports.getJobApplications = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    // Check if job exists and user is the owner
    const job = await Job.findByPk(req.params.jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.postedById !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view applications for this job'
      });
    }

    // Build query
    const where = { jobId: req.params.jobId };
    if (status) {
      where.status = status;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Get applications
    const { count, rows: applications } = await Application.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'applicant',
        attributes: ['name', 'email', 'phone', 'skills', 'experience', 'location', 'avatar']
      }],
      order: [['createdAt', 'DESC']],
      offset,
      limit: limitNum
    });

    const total = count;

    res.status(200).json({
      success: true,
      count: applications.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: applications
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update application status
 * @route   PUT /api/applications/:id/status
 * @access  Private (Employer only)
 */
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, comment } = req.body;

    const application = await Application.findByPk(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the job owner
    const job = await Job.findByPk(application.jobId);
    if (job.postedById !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    // Update status and add to history
    const statusHistory = application.statusHistory || [];
    statusHistory.push({
      status,
      changedBy: req.user.id,
      comment
    });

    await application.update({ status, statusHistory });

    res.status(200).json({
      success: true,
      message: 'Application status updated successfully',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Withdraw application
 * @route   PUT /api/applications/:id/withdraw
 * @access  Private (Job Seeker only)
 */
exports.withdrawApplication = async (req, res, next) => {
  try {
    const application = await Application.findByPk(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the applicant
    if (application.applicantId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to withdraw this application'
      });
    }

    // Check if application can be withdrawn
    if (['offered', 'rejected', 'withdrawn'].includes(application.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot withdraw application at this stage'
      });
    }

    await application.update({ status: 'withdrawn' });

    // Decrement applications count on job
    const job = await Job.findByPk(application.jobId);
    if (job && job.applicationsCount > 0) {
      await job.decrement('applicationsCount');
    }

    res.status(200).json({
      success: true,
      message: 'Application withdrawn successfully',
      data: application
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Add note to application
 * @route   POST /api/applications/:id/notes
 * @access  Private (Employer only)
 */
exports.addNote = async (req, res, next) => {
  try {
    const { text } = req.body;

    const application = await Application.findByPk(req.params.id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if user is the job owner
    const job = await Job.findByPk(application.jobId);
    if (job.postedById !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add notes to this application'
      });
    }

    const notes = application.notes || [];
    notes.push({
      text,
      addedBy: req.user.id,
      createdAt: new Date()
    });

    await application.update({ notes });

    res.status(200).json({
      success: true,
      message: 'Note added successfully',
      data: application
    });
  } catch (error) {
    next(error);
  }
};
