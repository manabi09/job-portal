const { Company, User, Job } = require('../models');
const { Op } = require('sequelize');

/**
 * @desc    Get all companies
 * @route   GET /api/companies
 * @access  Public
 */
exports.getCompanies = async (req, res, next) => {
  try {
    const { search, industry, companySize, page = 1, limit = 10 } = req.query;

    // Build query
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (industry) {
      where.industry = industry;
    }

    if (companySize) {
      where.companySize = companySize;
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    const { count, rows: companies } = await Company.findAndCountAll({
      where,
      attributes: { exclude: ['ownerId'] },
      order: [['createdAt', 'DESC']],
      offset,
      limit: limitNum
    });

    const total = count;

    res.status(200).json({
      success: true,
      count: companies.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      data: companies
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single company
 * @route   GET /api/companies/:id
 * @access  Public
 */
exports.getCompany = async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.params.id, {
      include: [{ model: Job, as: 'jobs' }]
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create company
 * @route   POST /api/companies
 * @access  Private (Employer only)
 */
exports.createCompany = async (req, res, next) => {
  try {
    // Check if user already has a company
    if (req.user.companyId) {
      return res.status(400).json({
        success: false,
        message: 'You already have a company profile'
      });
    }

    // Add owner to request body
    req.body.ownerId = req.user.id;

    const company = await Company.create(req.body);

    // Update user with company reference
    await User.update(
      { companyId: company.id },
      { where: { id: req.user.id } }
    );

    // Get updated user
    const updatedUser = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: company,
      user: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update company
 * @route   PUT /api/companies/:id
 * @access  Private (Employer only)
 */
exports.updateCompany = async (req, res, next) => {
  try {
    let company = await Company.findByPk(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check ownership
    if (company.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this company'
      });
    }

    await company.update(req.body);
    company = await Company.findByPk(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Company updated successfully',
      data: company
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete company
 * @route   DELETE /api/companies/:id
 * @access  Private (Employer only)
 */
exports.deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findByPk(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check ownership
    if (company.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this company'
      });
    }

    await company.destroy();

    // Remove company reference from user
    await User.update(
      { companyId: null },
      { where: { id: req.user.id } }
    );

    res.status(200).json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get my company
 * @route   GET /api/companies/my/company
 * @access  Private (Employer only)
 */
exports.getMyCompany = async (req, res, next) => {
  try {
    if (!req.user.companyId) {
      return res.status(404).json({
        success: false,
        message: 'You do not have a company profile'
      });
    }

    const company = await Company.findByPk(req.user.companyId, {
      include: [{ model: Job, as: 'jobs' }]
    });

    res.status(200).json({
      success: true,
      data: company
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Upload company logo
 * @route   POST /api/companies/:id/logo
 * @access  Private (Employer only)
 */
exports.uploadLogo = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const company = await Company.findByPk(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check ownership
    if (company.ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this company'
      });
    }

    await company.update({ logo: `/uploads/${req.file.filename}` });

    res.status(200).json({
      success: true,
      message: 'Logo uploaded successfully',
      data: company
    });
  } catch (error) {
    next(error);
  }
};
