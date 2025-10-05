const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Job = sequelize().define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide a job title' },
      len: { args: [1, 100], msg: 'Job title cannot be more than 100 characters' },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide a job description' },
      len: { args: [1, 5000], msg: 'Description cannot be more than 5000 characters' },
    },
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  postedById: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  location: {
    type: DataTypes.JSONB,
    allowNull: false,
    defaultValue: {},
  },
  jobType: {
    type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship', 'freelance'),
    allowNull: false,
  },
  experienceLevel: {
    type: DataTypes.ENUM('entry', 'mid', 'senior', 'lead', 'executive'),
    allowNull: false,
  },
  salary: {
    type: DataTypes.JSONB,
    defaultValue: {
      min: 0,
      max: 0,
      currency: 'USD',
      period: 'yearly',
    },
  },
  skills: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  requirements: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  responsibilities: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  benefits: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  category: {
    type: DataTypes.ENUM(
      'Software Development',
      'Data Science',
      'Design',
      'Marketing',
      'Sales',
      'Human Resources',
      'Finance',
      'Operations',
      'Customer Support',
      'Product Management',
      'Other'
    ),
    allowNull: false,
  },
  openings: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    validate: {
      min: { args: [1], msg: 'Openings must be at least 1' },
    },
  },
  applicationDeadline: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('active', 'closed', 'draft'),
    defaultValue: 'active',
  },
  applicationsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'jobs',
  timestamps: true,
  indexes: [
    {
      fields: ['companyId'],
    },
    {
      fields: ['status', 'createdAt'],
    },
    {
      fields: ['category'],
    },
  ],
});

module.exports = Job;
