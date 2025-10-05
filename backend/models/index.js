// Load models without foreign key constraints first
const Company = require('./Company');
const User = require('./User');
const Job = require('./Job');
const Application = require('./Application');

// Define associations/relationships after all models are loaded

// User - Company (One to One)
User.belongsTo(Company, { foreignKey: 'companyId', as: 'company', constraints: false });
Company.belongsTo(User, { foreignKey: 'ownerId', as: 'owner', constraints: false });

// Company - Jobs (One to Many)
Company.hasMany(Job, { foreignKey: 'companyId', as: 'jobs' });
Job.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// User - Jobs (One to Many - for posted jobs)
User.hasMany(Job, { foreignKey: 'postedById', as: 'postedJobs' });
Job.belongsTo(User, { foreignKey: 'postedById', as: 'postedBy' });

// Job - Applications (One to Many)
Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

// User - Applications (One to Many)
User.hasMany(Application, { foreignKey: 'applicantId', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'applicantId', as: 'applicant' });

module.exports = {
  User,
  Company,
  Job,
  Application,
};
