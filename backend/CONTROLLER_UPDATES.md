# Controller Updates for PostgreSQL/Sequelize

This document shows the key changes needed in controllers when migrating from MongoDB/Mongoose to PostgreSQL/Sequelize.

## Import Changes

```javascript
// OLD (MongoDB)
const User = require('../models/User');
const Job = require('../models/Job');

// NEW (PostgreSQL)
const { User, Job, Company, Application } = require('../models');
```

## Query Changes

### Find by ID
```javascript
// OLD
const user = await User.findById(id);

// NEW
const user = await User.findByPk(id);
```

### Find One
```javascript
// OLD
const user = await User.findOne({ email });

// NEW
const user = await User.findOne({ where: { email } });
```

### Find All with Filters
```javascript
// OLD
const jobs = await Job.find({ status: 'active', jobType: 'full-time' });

// NEW
const jobs = await Job.findAll({ 
  where: { 
    status: 'active', 
    jobType: 'full-time' 
  } 
});
```

### Find with Populate/Include
```javascript
// OLD
const user = await User.findById(id).populate('company', 'name logo');

// NEW
const user = await User.findByPk(id, {
  include: [{ 
    model: Company, 
    as: 'company', 
    attributes: ['name', 'logo'] 
  }]
});
```

### Select/Exclude Fields
```javascript
// OLD
const user = await User.findById(id).select('-password');

// NEW
const user = await User.findByPk(id, {
  attributes: { exclude: ['password'] }
});

// Include specific fields
const user = await User.findByPk(id, {
  attributes: ['id', 'name', 'email']
});
```

### Update
```javascript
// OLD
const user = await User.findByIdAndUpdate(
  id, 
  { name: 'New Name' }, 
  { new: true }
);

// NEW
await User.update(
  { name: 'New Name' }, 
  { where: { id } }
);
const user = await User.findByPk(id);
```

### Delete
```javascript
// OLD
await Job.findByIdAndDelete(id);
// OR
const job = await Job.findById(id);
await job.deleteOne();

// NEW
await Job.destroy({ where: { id } });
// OR
const job = await Job.findByPk(id);
await job.destroy();
```

### Count
```javascript
// OLD
const count = await Job.countDocuments({ status: 'active' });

// NEW
const count = await Job.count({ where: { status: 'active' } });
```

### Pagination
```javascript
// OLD
const jobs = await Job.find()
  .skip((page - 1) * limit)
  .limit(limit);

// NEW
const jobs = await Job.findAll({
  offset: (page - 1) * limit,
  limit: limit
});
```

### Sorting
```javascript
// OLD
const jobs = await Job.find().sort('-createdAt');

// NEW
const jobs = await Job.findAll({
  order: [['createdAt', 'DESC']]
});
```

### Search (Text Search)
```javascript
// OLD (MongoDB text index)
const jobs = await Job.find({ $text: { $search: searchQuery } });

// NEW (PostgreSQL ILIKE)
const { Op } = require('sequelize');
const jobs = await Job.findAll({
  where: {
    [Op.or]: [
      { title: { [Op.iLike]: `%${searchQuery}%` } },
      { description: { [Op.iLike]: `%${searchQuery}%` } }
    ]
  }
});
```

### Complex Queries
```javascript
// OLD
const jobs = await Job.find({
  status: 'active',
  'salary.min': { $gte: 50000 },
  skills: { $in: ['JavaScript', 'React'] }
});

// NEW
const { Op } = require('sequelize');
const jobs = await Job.findAll({
  where: {
    status: 'active',
    'salary.min': { [Op.gte]: 50000 },
    skills: { [Op.contains]: ['JavaScript', 'React'] }
  }
});
```

## ID References

```javascript
// OLD (MongoDB ObjectId)
user._id
job._id.toString()

// NEW (PostgreSQL UUID)
user.id
job.id
```

## Associations/Relationships

```javascript
// Already defined in models/index.js
// Use include in queries:

const job = await Job.findByPk(jobId, {
  include: [
    { model: Company, as: 'company' },
    { model: User, as: 'postedBy' },
    { model: Application, as: 'applications' }
  ]
});
```

## Transaction Example

```javascript
const { sequelize } = require('../config/database');

const t = await sequelize.transaction();

try {
  const user = await User.create({ name: 'John' }, { transaction: t });
  const company = await Company.create({ name: 'Acme', ownerId: user.id }, { transaction: t });
  
  await t.commit();
} catch (error) {
  await t.rollback();
  throw error;
}
```

## Key Differences Summary

| Feature | MongoDB/Mongoose | PostgreSQL/Sequelize |
|---------|------------------|----------------------|
| Find by ID | `findById(id)` | `findByPk(id)` |
| Find one | `findOne({ field })` | `findOne({ where: { field } })` |
| Find all | `find({ field })` | `findAll({ where: { field } })` |
| Update | `findByIdAndUpdate()` | `update() + findByPk()` |
| Delete | `findByIdAndDelete()` | `destroy()` |
| Populate | `.populate('field')` | `include: [{ model, as }]` |
| Select | `.select('field -other')` | `attributes: ['field']` |
| Sort | `.sort('-field')` | `order: [['field', 'DESC']]` |
| Skip/Limit | `.skip().limit()` | `offset, limit` |
| ID field | `_id` | `id` |

## Notes

1. **Always use `where` clause** for filtering in Sequelize
2. **UUIDs instead of ObjectIds** - No need for `.toString()`
3. **JSONB fields** - Access nested data with JSON operators
4. **Arrays** - Use `DataTypes.ARRAY()` and PostgreSQL array operators
5. **Transactions** - Built-in support for ACID compliance
6. **Associations** - Defined once in models/index.js, used everywhere

## Need Help?

- Check `models/index.js` for relationship definitions
- See `authController.js` for complete examples
- Refer to Sequelize docs: https://sequelize.org/docs/v6/
