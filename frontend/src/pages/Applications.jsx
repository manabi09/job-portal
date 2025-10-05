import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationService } from '../services/applicationService';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { MapPin, Briefcase, Calendar, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { getFileUrl } from '../utils/constants';

const Applications = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['myApplications'],
    queryFn: () => applicationService.getMyApplications(),
  });

  const withdrawMutation = useMutation({
    mutationFn: (id) => applicationService.withdrawApplication(id),
    onSuccess: () => {
      toast.success('Application withdrawn successfully');
      queryClient.invalidateQueries(['myApplications']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to withdraw application');
    },
  });

  const getStatusColor = (status) => {
    const colors = {
      pending: 'badge-warning',
      reviewing: 'badge-primary',
      shortlisted: 'badge-success',
      interviewed: 'badge-primary',
      offered: 'badge-success',
      rejected: 'badge-danger',
      withdrawn: 'badge bg-gray-100 text-gray-700',
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

  const applications = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Applications</h1>
          <p className="text-gray-600 mt-2">Track the status of your job applications</p>
        </div>

        {applications.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
            <p className="text-gray-600 mb-6">Start applying to jobs to see them here</p>
            <Link to="/jobs" className="btn btn-primary">
              Browse Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <div key={application.id} className="card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex items-start space-x-4 mb-4 md:mb-0">
                    {application.job?.company?.logo ? (
                      <img
                        src={getFileUrl(application.job.company.logo)}
                        alt={application.job.company.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-primary-600" />
                      </div>
                    )}
                    <div>
                      <Link
                        to={`/jobs/${application.job?.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-primary-600"
                      >
                        {application.job?.title}
                      </Link>
                      <p className="text-sm text-gray-600">{application.job?.company?.name}</p>
                      <div className="flex flex-wrap gap-3 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {application.job?.location?.city}, {application.job?.location?.country}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Applied {formatDistanceToNow(new Date(application.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    <span className={`badge ${getStatusColor(application.status)} capitalize`}>
                      {application.status}
                    </span>
                    {application.status !== 'withdrawn' && 
                     application.status !== 'rejected' && 
                     application.status !== 'offered' && (
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to withdraw this application?')) {
                            withdrawMutation.mutate(application.id);
                          }
                        }}
                        className="text-sm text-red-600 hover:text-red-700"
                        disabled={withdrawMutation.isLoading}
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </div>

                {application.coverLetter && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-1">Cover Letter</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{application.coverLetter}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Applications;
