# job-portal
Full-stack job portal with PostgreSQL
# Job Portal - Indeed/Internshala Clone

A modern, full-stack job portal application built with React, Node.js, Express, and MongoDB.

## Features

### For Job Seekers
- 🔍 Advanced job search with filters (location, salary, experience, job type)
- 📝 Easy job application process
- 👤 Profile management with resume upload
- 📊 Application tracking dashboard
- 🔔 Job alerts and notifications
- ⭐ Save favorite jobs

### For Employers
- 📢 Post job openings
- 👥 Manage applications
- 📈 View application analytics
- 🏢 Company profile management
- 🔍 Search candidate database

### General Features
- 🔐 Secure authentication (JWT)
- 🎨 Modern, responsive UI with TailwindCSS
- 🚀 RESTful API architecture
- 📱 Mobile-friendly design
- 🔒 Role-based access control

## Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Lucide React** - Icons
- **Axios** - HTTP client
- **React Query** - Data fetching

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File uploads

## Project Structure

```
job-portal/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
├── frontend/
│   ├── public/          # Static files
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── contexts/    # React contexts
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # API services
│   │   ├── utils/       # Utility functions
│   │   └── App.jsx      # Root component
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Backend Setup

1. **Install and Setup PostgreSQL:**
```bash
# Create database
psql -U postgres
CREATE DATABASE job_portal;
\q
```

2. Navigate to backend directory:
```bash
cd backend
```

3. Install dependencies:
```bash
npm install
```

4. Create `.env` file:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=job_portal
DB_USER=postgres
DB_PASSWORD=your_postgres_password
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

5. Start the server:
```bash
npm run dev
```

Backend will run on `http://localhost:5000`

**Note:** Sequelize will automatically create all tables on first run!

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Job Endpoints
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (employer only)
- `PUT /api/jobs/:id` - Update job (employer only)
- `DELETE /api/jobs/:id` - Delete job (employer only)

### Application Endpoints
- `GET /api/applications` - Get user applications
- `POST /api/applications` - Apply for job
- `PUT /api/applications/:id` - Update application status
- `GET /api/applications/job/:jobId` - Get applications for a job

### Company Endpoints
- `GET /api/companies` - Get all companies
- `GET /api/companies/:id` - Get single company
- `POST /api/companies` - Create company profile
- `PUT /api/companies/:id` - Update company

## Environment Variables

### Backend
| Variable | Description | Required |
|----------|-------------|----------|
| PORT | Server port | Yes |
| DB_HOST | PostgreSQL host | Yes |
| DB_PORT | PostgreSQL port | Yes |
| DB_NAME | Database name | Yes |
| DB_USER | Database user | Yes |
| DB_PASSWORD | Database password | Yes |
| JWT_SECRET | Secret key for JWT | Yes |
| JWT_EXPIRE | JWT expiration time | Yes |
| NODE_ENV | Environment (development/production) | Yes |

### Frontend
| Variable | Description | Required |
|----------|-------------|----------|
| VITE_API_URL | Backend API URL | Yes |

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Building for Production

#### Backend
```bash
cd backend
npm start
```

#### Frontend
```bash
cd frontend
npm run build
```

## Code Style

This project follows clean code principles:
- ✅ Modular architecture
- ✅ Clear separation of concerns
- ✅ Comprehensive error handling
- ✅ Input validation
- ✅ Security best practices
- ✅ Well-commented code
- ✅ Consistent naming conventions

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes
- Input sanitization
- CORS configuration
- Rate limiting
- Helmet.js security headers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License

## Support

For support, email support@jobportal.com or open an issue in the repository.

## Roadmap

- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Video interview integration
- [ ] AI-powered job recommendations
- [ ] Chat system between employers and candidates
- [ ] Mobile app (React Native)

---

Built with ❤️ by developers, for developers
