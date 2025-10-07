const { Sequelize } = require('sequelize');

// Lazy initialization - will be created when first accessed
let sequelizeInstance = null;

/**
 * Get or create Sequelize instance for PostgreSQL
 */
const getSequelize = () => {
  if (!sequelizeInstance) {
    const config = {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 5432,
      dialect: 'postgres',
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    };

    // Enable SSL for production (required by most cloud PostgreSQL providers)
    if (process.env.NODE_ENV === 'production') {
      config.dialectOptions = {
        ssl: {
          require: true,
          rejectUnauthorized: false // For self-signed certificates
        }
      };
    }

    sequelizeInstance = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      String(process.env.DB_PASSWORD),
      config
    );
  }
  return sequelizeInstance;
};

// Export a getter property
const sequelize = {
  get instance() {
    return getSequelize();
  }
};

/**
 * Test database connection
 * @returns {Promise<void>}
 */
const connectDB = async () => {
  try {
    const seq = getSequelize();
    await seq.authenticate();
    console.log('PostgreSQL Connected Successfully');
    
    // Sync all models with database
    // Use force: false to not drop existing tables
    // Use alter: true in development to update schema
    await seq.sync({ 
      force: false,
      alter: process.env.NODE_ENV === 'development' 
    });
    console.log('Database synchronized');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    console.error('Full error:', error);
    process.exit(1);
  }
};

module.exports = { 
  sequelize: getSequelize,
  connectDB 
};
