import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { jobService } from '../../services/jobService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Briefcase } from 'lucide-react';

const PostJob = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    jobType: 'full-time',
    experienceLevel: 'mid',
    location: {
      city: '',
      state: '',
      country: '',
      remote: false,
    },
    salary: {
      min: '',
      max: '',
      currency: 'USD',
      period: 'yearly',
    },
    skills: '',
    requirements: '',
    responsibilities: '',
    benefits: '',
    openings: 1,
    applicationDeadline: '',
  });

  const createJobMutation = useMutation({
    mutationFn: (data) => jobService.createJob(data),
    onSuccess: () => {
      toast.success('Job posted successfully!');
      navigate('/employer/jobs');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to post job');
    },
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        location: { ...formData.location, [field]: field === 'remote' ? checked : value },
      });
    } else if (name.startsWith('salary.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        salary: { ...formData.salary, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user?.company) {
      toast.error('Please create a company profile first');
      navigate('/employer/company');
      return;
    }

    const dataToSubmit = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
      requirements: formData.requirements.split('\n').map(s => s.trim()).filter(s => s),
      responsibilities: formData.responsibilities.split('\n').map(s => s.trim()).filter(s => s),
      benefits: formData.benefits.split('\n').map(s => s.trim()).filter(s => s),
      salary: {
        ...formData.salary,
        min: formData.salary.min ? parseInt(formData.salary.min) : 0,
        max: formData.salary.max ? parseInt(formData.salary.max) : 0,
      },
    };

    createJobMutation.mutate(dataToSubmit);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Briefcase className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
          </div>
          <p className="text-gray-600">Fill in the details to post a job opening</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="input"
                  required
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="input"
                  required
                  placeholder="Describe the role, team, and what makes this opportunity exciting..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <select name="category" value={formData.category} onChange={handleChange} className="input" required>
                    <option value="">Select Category</option>
                    <option value="Software Development">Software Development</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Design">Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Sales">Sales</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Finance">Finance</option>
                    <option value="Operations">Operations</option>
                    <option value="Customer Support">Customer Support</option>
                    <option value="Product Management">Product Management</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type *</label>
                  <select name="jobType" value={formData.jobType} onChange={handleChange} className="input" required>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="freelance">Freelance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level *</label>
                  <select name="experienceLevel" value={formData.experienceLevel} onChange={handleChange} className="input" required>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="lead">Lead</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Openings *</label>
                  <input
                    type="number"
                    name="openings"
                    value={formData.openings}
                    onChange={handleChange}
                    className="input"
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  name="location.city"
                  value={formData.location.city}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="location.state"
                  value={formData.location.state}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input
                  type="text"
                  name="location.country"
                  value={formData.location.country}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="location.remote"
                  checked={formData.location.remote}
                  onChange={handleChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Remote position</span>
              </label>
            </div>
          </div>

          {/* Salary */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Salary Range</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Salary</label>
                <input
                  type="number"
                  name="salary.min"
                  value={formData.salary.min}
                  onChange={handleChange}
                  className="input"
                  placeholder="50000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Salary</label>
                <input
                  type="number"
                  name="salary.max"
                  value={formData.salary.max}
                  onChange={handleChange}
                  className="input"
                  placeholder="100000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select name="salary.currency" value={formData.salary.currency} onChange={handleChange} className="input">
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="INR">INR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                <select name="salary.period" value={formData.salary.period} onChange={handleChange} className="input">
                  <option value="hourly">Hourly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills (comma-separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="input"
              placeholder="JavaScript, React, Node.js, MongoDB"
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Requirements (one per line)</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows={4}
              className="input"
              placeholder="Bachelor's degree in Computer Science&#10;5+ years of experience&#10;Strong problem-solving skills"
            />
          </div>

          {/* Responsibilities */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Responsibilities (one per line)</label>
            <textarea
              name="responsibilities"
              value={formData.responsibilities}
              onChange={handleChange}
              rows={4}
              className="input"
              placeholder="Design and develop scalable applications&#10;Collaborate with cross-functional teams&#10;Mentor junior developers"
            />
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Benefits (one per line)</label>
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              rows={4}
              className="input"
              placeholder="Health insurance&#10;401(k) matching&#10;Flexible work hours&#10;Remote work options"
            />
          </div>

          {/* Application Deadline */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline (Optional)</label>
            <input
              type="date"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              className="input"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/employer/jobs')}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createJobMutation.isLoading}
              className="btn btn-primary"
            >
              {createJobMutation.isLoading ? 'Posting...' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
