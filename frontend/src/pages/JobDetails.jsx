import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { jobService } from '../services/jobService';
import { applicationService } from '../services/applicationService';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building2,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { getFileUrl } from '../utils/constants';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isJobSeeker, user } = useAuth();
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');

  const { data: jobData, isLoading } = useQuery({
    queryKey: ['job', id],
    queryFn: () => jobService.getJob(id),
  });

  const applyMutation = useMutation({
    mutationFn: (data) => applicationService.applyForJob(data),
    onSuccess: () => {
      toast.success('Application submitted successfully!');
      setShowApplicationModal(false);
      setCoverLetter('');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to submit application');
    },
  });

  const handleApply = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!user?.resume) {
      toast.error('Please upload your resume in your profile first');
      navigate('/profile');
      return;
    }

    setShowApplicationModal(true);
  };

  const submitApplication = () => {
    applyMutation.mutate({
      jobId: id,
      coverLetter,
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const job = jobData?.data;

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job not found</h2>
          <Link to="/jobs" className="text-primary-600 hover:text-primary-700">
            Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Not disclosed';
    const range = salary.min && salary.max 
      ? `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()}`
      : salary.min 
        ? `${salary.min.toLocaleString()}+`
        : `Up to ${salary.max.toLocaleString()}`;
    return `${salary.currency} ${range}/${salary.period}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back
        </button>

        <div className="card mb-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4">
              {job.company?.logo ? (
                <img src={getFileUrl(job.company.logo)} alt={job.company.name} className="w-16 h-16 rounded-lg object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-primary-100 flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-primary-600" />
                </div>
              )}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                <Link to={`/companies/${job.company.id}`} className="text-lg text-primary-600 hover:text-primary-700">
                  {job.company.name}
                </Link>
              </div>
            </div>
            {isJobSeeker && (
              <button onClick={handleApply} className="btn btn-primary">
                Apply Now
              </button>
            )}
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-5 w-5 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="font-medium">{job.location.city}, {job.location.country}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <Briefcase className="h-5 w-5 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Job Type</p>
                <p className="font-medium capitalize">{job.jobType}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-5 w-5 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Salary</p>
                <p className="font-medium">{formatSalary(job.salary)}</p>
              </div>
            </div>
            <div className="flex items-center text-gray-600">
              <Clock className="h-5 w-5 mr-2" />
              <div>
                <p className="text-xs text-gray-500">Posted</p>
                <p className="font-medium">{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</p>
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="badge badge-primary capitalize">{job.experienceLevel}</span>
            <span className="badge badge-success">{job.category}</span>
            {job.location.remote && <span className="badge badge-warning">Remote</span>}
            <span className="badge bg-gray-100 text-gray-700">{job.openings} opening(s)</span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Job Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>

          {/* Responsibilities */}
          {job.responsibilities?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Responsibilities</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {job.responsibilities.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Requirements */}
          {job.requirements?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {job.requirements.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Required Skills</h2>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Benefits */}
          {job.benefits?.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Benefits</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {job.benefits.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Apply Button */}
          {isJobSeeker && (
            <div className="pt-6 border-t border-gray-200">
              <button onClick={handleApply} className="w-full btn btn-primary">
                Apply for this Position
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <h2 className="text-2xl font-bold mb-4">Apply for {job.title}</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cover Letter (Optional)
              </label>
              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={6}
                className="input"
                placeholder="Tell us why you're a great fit for this role..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowApplicationModal(false)}
                className="btn btn-secondary"
                disabled={applyMutation.isLoading}
              >
                Cancel
              </button>
              <button
                onClick={submitApplication}
                className="btn btn-primary"
                disabled={applyMutation.isLoading}
              >
                {applyMutation.isLoading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
