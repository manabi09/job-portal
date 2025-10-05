const { Job, Company, User } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Get all jobs with filters and pagination
 * @route   GET /api/jobs
 * @access  Public
 */
exports.getJobs = async (req, res, next) => {
  try {
    const {
      search,
      location,
      jobType,
      experienceLevel,
      category,
      minSalary,
      maxSalary,
      remote,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    // Build query
    const where = { status: 'active' };
    const searchConditions = [];

    // Search in title and description
    if (search) {
      searchConditions.push(
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      );
    }

    // Filter by location
    if (location) {
      where[Op.or] = [
        { 'location.city': { [Op.iLike]: `%${location}%` } },
        { 'location.country': { [Op.iLike]: `%${location}%` } }
      ];
    }

    // Filter by job type
    if (jobType) {
      where.jobType = jobType;
    }

    // Filter by experience level
    if (experienceLevel) {
      where.experienceLevel = experienceLevel;
    }

    // Filter by category
    if (category) {
      where.category = category;
    }

    // Filter by salary range (JSONB query)
    if (minSalary) {
      where['salary.min'] = { [Op.gte]: parseInt(minSalary) };
    }
    if (maxSalary) {
      where['salary.max'] = { [Op.lte]: parseInt(maxSalary) };
    }

    // Filter by remote
    if (remote === 'true') {
      where['location.remote'] = true;
    }

    // Add search conditions
    if (searchConditions.length > 0) {
      where[Op.or] = searchConditions;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Parse sort
    const order = sort.startsWith('-') 
      ? [[sort.substring(1), 'DESC']]
      : [[sort, 'ASC']];

    // Execute query
    const { count, rows: jobs } = await Job.findAndCountAll({
      where,
      include: [
        { model: Company, as: 'company', attributes: ['name', 'logo', 'location'] },
        { model: User, as: 'postedBy', attributes: ['name', 'email'] }
      ],
      order,
      offset,
      limit: limitNum
    });

    const total = count;

    res.status(200).json({
      success: true,
      count: jobs.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single job by ID
 * @route   GET /api/jobs/:id
 * @access  Public
 */
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [
        { model: Company, as: 'company' },
        { model: User, as: 'postedBy', attributes: ['name', 'email'] }
      ]
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment views
    await job.increment('views');

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create new job
 * @route   POST /api/jobs
 * @access  Private (Employer only)
 */
exports.createJob = async (req, res, next) => {
  try {
    // Check if user has a company
    if (!req.user.companyId) {
      return res.status(400).json({
        success: false,
        message: 'Please create a company profile first'
      });
    }

    // Verify company exists and belongs to user
    const company = await Company.findByPk(req.user.companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    if (company.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to post jobs for this company'
      });
    }

    // Add company and postedBy to request body
    req.body.companyId = req.user.companyId;
    req.body.postedById = req.user.id;

    const job = await Job.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Job created successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update job
 * @route   PUT /api/jobs/:id
 * @access  Private (Employer only)
 */
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.postedById !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    await job.update(req.body);
    job = await Job.findByPk(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: job
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete job
 * @route   DELETE /api/jobs/:id
 * @access  Private (Employer only)
 */
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.postedById !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await job.destroy();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get jobs posted by current user
 * @route   GET /api/jobs/my/posted
 * @access  Private (Employer only)
 */
exports.getMyJobs = async (req, res, next) => {
  try {
    const jobs = await Job.findAll({
      where: { postedById: req.user.id },
      include: [{ model: Company, as: 'company', attributes: ['name', 'logo'] }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get job statistics
 * @route   GET /api/jobs/:id/stats
 * @access  Private (Employer only)
 */
exports.getJobStats = async (req, res, next) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.postedById !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this job statistics'
      });
    }

    const stats = {
      views: job.views,
      applications: job.applicationsCount,
      openings: job.openings,
      daysActive: Math.floor((Date.now() - job.createdAt) / (1000 * 60 * 60 * 24))
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
