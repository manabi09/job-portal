const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Application = sequelize().define('Application', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  applicantId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  resume: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please upload a resume' },
    },
  },
  coverLetter: {
    type: DataTypes.STRING(2000),
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewing', 'shortlisted', 'interviewed', 'offered', 'rejected', 'withdrawn'),
    defaultValue: 'pending',
  },
  answers: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  notes: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
  statusHistory: {
    type: DataTypes.JSONB,
    defaultValue: [],
  },
}, {
  tableName: 'applications',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['jobId', 'applicantId'],
    },
    {
      fields: ['jobId', 'status'],
    },
    {
      fields: ['applicantId', 'createdAt'],
    },
  ],
  hooks: {
    beforeUpdate: (application) => {
      if (application.changed('status')) {
        const history = application.statusHistory || [];
        history.push({
          status: application.status,
          changedAt: new Date(),
        });
        application.statusHistory = history;
      }
    },
  },
});

module.exports = Application;
