import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '../../services/applicationService';
import LoadingSpinner from '../../components/LoadingSpinner';
import { User, Mail, Phone, MapPin, Briefcase, FileText, Calendar } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getFileUrl } from '../../utils/constants';
import toast from 'react-hot-toast';

const JobApplications = () => {
  const { jobId } = useParams();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedApplication, setSelectedApplication] = useState(null);

  const { data: applicationsData, isLoading } = useQuery({
    queryKey: ['jobApplications', jobId, statusFilter],
    queryFn: () => applicationService.getJobApplications(jobId, { status: statusFilter }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, comment }) => applicationService.updateApplicationStatus(id, status, comment),
    onSuccess: () => {
      toast.success('Application status updated');
      queryClient.invalidateQueries(['jobApplications', jobId]);
      setSelectedApplication(null);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });

  const handleStatusChange = (applicationId, newStatus) => {
    const comment = prompt('Add a comment (optional):');
    updateStatusMutation.mutate({ id: applicationId, status: newStatus, comment });
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'badge-warning',
      reviewing: 'badge-primary',
      shortlisted: 'badge-success',
      interviewed: 'badge-primary',
      offered: 'badge-success',
      rejected: 'badge-danger',
    };
    return colors[status] || 'badge';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const applications = applicationsData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Applications</h1>
          <p className="text-gray-600 mt-2">
            {applicationsData?.total || 0} applications received
          </p>
        </div>

        {/* Filter */}
        <div className="card mb-6">
          <div className="flex items-center space-x-4">
            <label className="text-sm font-medium text-gray-700">Filter by status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input max-w-xs"
            >
              <option value="">All Applications</option>
              <option value="pending">Pending</option>
              <option value="reviewing">Reviewing</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interviewed">Interviewed</option>
              <option value="offered">Offered</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        {applications.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600">Applications will appear here once candidates apply</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {applications.map((application) => (
              <div key={application.id} className="card">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    {application.applicant?.avatar ? (
                      <img
                        src={application.applicant.avatar}
                        alt={application.applicant.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{application.applicant?.name}</h3>
                      <p className="text-sm text-gray-600">{application.applicant?.email}</p>
                    </div>
                  </div>
                  <span className={`badge ${getStatusColor(application.status)} capitalize`}>
                    {application.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  {application.applicant?.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 mr-2" />
                      <span>{application.applicant.phone}</span>
                    </div>
                  )}
                  {application.applicant?.location?.city && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>
                        {application.applicant.location.city}, {application.applicant.location.country}
                      </span>
                    </div>
                  )}
                  {application.applicant?.experience !== undefined && (
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2" />
                      <span>{application.applicant.experience} years experience</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Applied {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>

                {application.applicant?.skills?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {application.applicant.skills.slice(0, 5).map((skill, index) => (
                        <span key={index} className="px-2 py-1 bg-primary-100 text-primary-800 text-xs rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {application.coverLetter && (
                  <div className="mb-4 p-3 bg-gray-50 rounded">
                    <p className="text-sm font-medium text-gray-700 mb-1">Cover Letter</p>
                    <p className="text-sm text-gray-600 line-clamp-3">{application.coverLetter}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-gray-200">
                  {application.resume && (
                    <a
                      href={getFileUrl(application.resume)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-outline flex-1 text-sm"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      View Resume
                    </a>
                  )}
                  <select
                    value={application.status}
                    onChange={(e) => handleStatusChange(application.id, e.target.value)}
                    className="input flex-1 text-sm"
                    disabled={updateStatusMutation.isLoading}
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interviewed">Interviewed</option>
                    <option value="offered">Offered</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplications;
