import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Jobs from './pages/Jobs';
import JobDetails from './pages/JobDetails';
import Applications from './pages/Applications';
import Profile from './pages/Profile';
import Companies from './pages/Companies';
import CompanyDetails from './pages/CompanyDetails';

// Employer Pages
import CompanyProfile from './pages/employer/CompanyProfile';
import PostJob from './pages/employer/PostJob';
import EmployerJobs from './pages/employer/EmployerJobs';
import JobApplications from './pages/employer/JobApplications';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/companies/:id" element={<CompanyDetails />} />

          {/* Job Seeker Protected Routes */}
          <Route
            path="/applications"
            element={
              <ProtectedRoute requiredRole="jobseeker">
                <Applications />
              </ProtectedRoute>
            }
          />

          {/* Employer Protected Routes */}
          <Route
            path="/employer/company"
            element={
              <ProtectedRoute requiredRole="employer">
                <CompanyProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/jobs"
            element={
              <ProtectedRoute requiredRole="employer">
                <EmployerJobs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/post-job"
            element={
              <ProtectedRoute requiredRole="employer">
                <PostJob />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/jobs/:jobId/applications"
            element={
              <ProtectedRoute requiredRole="employer">
                <JobApplications />
              </ProtectedRoute>
            }
          />

          {/* Common Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 404 Route */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                  <p className="text-gray-600 mb-4">Page not found</p>
                  <a href="/" className="text-primary-600 hover:text-primary-700">
                    Go back home
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

export default App;
