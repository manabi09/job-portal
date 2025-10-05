# PostgreSQL Migration Guide

This application now uses **PostgreSQL** with **Sequelize ORM** instead of MongoDB.

## Prerequisites

- PostgreSQL 12 or higher installed
- Node.js 16 or higher

## Installation

### 1. Install PostgreSQL

**Windows:**
- Download from https://www.postgresql.org/download/windows/
- Run the installer and remember your postgres user password

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

### 2. Create Database

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE job_portal;

# Create user (optional)
CREATE USER job_portal_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE job_portal TO job_portal_user;

# Exit
\q
```

### 3. Configure Environment Variables

Update your `.env` file:

```env
# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=job_portal
DB_USER=postgres
DB_PASSWORD=your_password_here
```

### 4. Install Dependencies

```bash
cd backend
npm install
```

### 5. Run the Application

```bash
npm run dev
```

Sequelize will automatically create all tables and relationships on first run!

## Key Differences from MongoDB

### 1. **IDs are UUIDs instead of ObjectIds**
- MongoDB: `_id` (ObjectId)
- PostgreSQL: `id` (UUID)

### 2. **Queries**
```javascript
// MongoDB
User.findById(id)
User.findOne({ email })
User.find({ role: 'employer' })

// Sequelize
User.findByPk(id)
User.findOne({ where: { email } })
User.findAll({ where: { role: 'employer' } })
```

### 3. **Relationships**
```javascript
// MongoDB (populate)
User.findById(id).populate('company')

// Sequelize (include)
User.findByPk(id, {
  include: [{ model: Company, as: 'company' }]
})
```

### 4. **Updates**
```javascript
// MongoDB
User.findByIdAndUpdate(id, { name: 'New Name' }, { new: true })

// Sequelize
await User.update({ name: 'New Name' }, { where: { id } })
const user = await User.findByPk(id)
```

### 5. **Array and JSON Fields**
- Arrays: `DataTypes.ARRAY(DataTypes.STRING)`
- JSON: `DataTypes.JSONB` (better performance than JSON)

## Database Schema

### Tables Created:
1. **users** - User accounts (job seekers & employers)
2. **companies** - Company profiles
3. **jobs** - Job postings
4. **applications** - Job applications

### Relationships:
- User → Company (One-to-One)
- Company → Jobs (One-to-Many)
- User → Jobs (One-to-Many, posted jobs)
- Job → Applications (One-to-Many)
- User → Applications (One-to-Many)

## Useful PostgreSQL Commands

```bash
# Connect to database
psql -U postgres -d job_portal

# List tables
\dt

# Describe table
\d users

# View data
SELECT * FROM users LIMIT 10;

# Drop all tables (reset)
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO public;
```

## Advantages of PostgreSQL

✅ **ACID Compliance** - Full transactional support  
✅ **Complex Queries** - Advanced SQL capabilities  
✅ **Data Integrity** - Foreign keys and constraints  
✅ **JSON Support** - JSONB for flexible data  
✅ **Performance** - Excellent for complex joins  
✅ **Scalability** - Better for large datasets  
✅ **Full-text Search** - Built-in search capabilities  

## Troubleshooting

### Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:** Make sure PostgreSQL is running
```bash
# Windows
services.msc (check PostgreSQL service)

# Mac
brew services start postgresql

# Linux
sudo systemctl start postgresql
```

### Authentication Failed
```
Error: password authentication failed for user "postgres"
```
**Solution:** Reset postgres password or update .env file

### Port Already in Use
```
Error: Port 5432 is already in use
```
**Solution:** Check if another PostgreSQL instance is running

## Migration from MongoDB (if needed)

If you have existing MongoDB data, you'll need to:

1. Export MongoDB data
2. Transform the data structure (ObjectId → UUID)
3. Import into PostgreSQL

Contact support for migration scripts if needed.

## Performance Tips

1. **Indexes** - Already configured on frequently queried fields
2. **Connection Pooling** - Configured with max 5 connections
3. **JSONB** - Used for flexible fields (faster than JSON)
4. **Prepared Statements** - Sequelize uses them automatically

## Support

For issues or questions:
- Check Sequelize docs: https://sequelize.org/
- PostgreSQL docs: https://www.postgresql.org/docs/
- Open an issue in the repository
