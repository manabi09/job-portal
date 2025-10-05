const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Company = sequelize().define('Company', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: { msg: 'Please provide a company name' },
      len: { args: [1, 100], msg: 'Company name cannot be more than 100 characters' },
    },
  },
  description: {
    type: DataTypes.STRING(2000),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide a company description' },
      len: { args: [1, 2000], msg: 'Description cannot be more than 2000 characters' },
    },
  },
  logo: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: { msg: 'Please provide a valid URL' },
    },
  },
  industry: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please specify the industry' },
    },
  },
  companySize: {
    type: DataTypes.ENUM('1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please specify company size' },
    },
  },
  foundedYear: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: { args: [1800], msg: 'Founded year must be after 1800' },
      max: { args: [new Date().getFullYear()], msg: 'Founded year cannot be in the future' },
    },
  },
  location: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  socialLinks: {
    type: DataTypes.JSONB,
    defaultValue: {},
  },
  benefits: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
  },
  culture: {
    type: DataTypes.STRING(1000),
    allowNull: true,
  },
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5,
    },
  },
  reviewsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
}, {
  tableName: 'companies',
  timestamps: true,
});

module.exports = Company;
