import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { jobService } from '../../services/jobService';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Plus, Edit, Trash2, Eye, Users, Briefcase } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

const EmployerJobs = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['myJobs'],
    queryFn: () => jobService.getMyJobs(),
  });

  const deleteJobMutation = useMutation({
    mutationFn: (id) => jobService.deleteJob(id),
    onSuccess: () => {
      toast.success('Job deleted successfully');
      queryClient.invalidateQueries(['myJobs']);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete job');
    },
  });

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      deleteJobMutation.mutate(id);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: 'badge-success',
      closed: 'badge-danger',
      draft: 'badge bg-gray-100 text-gray-700',
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

  const jobs = data?.data || [];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Job Postings</h1>
            <p className="text-gray-600 mt-2">Manage your job listings and applications</p>
          </div>
          <Link to="/employer/post-job" className="btn btn-primary flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Post New Job
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="card text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-600 mb-6">Start by posting your first job opening</p>
            <Link to="/employer/post-job" className="btn btn-primary inline-flex items-center">
              <Plus className="h-5 w-5 mr-2" />
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div key={job.id} className="card">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div className="flex-1 mb-4 md:mb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-sm text-gray-600">{job.company?.name}</p>
                      </div>
                      <span className={`badge ${getStatusColor(job.status)} capitalize ml-4`}>
                        {job.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-3">
                      <span className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {job.applicationsCount} applications
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {job.views} views
                      </span>
                      <span>
                        Posted {formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="badge badge-primary capitalize">{job.jobType}</span>
                      <span className="badge badge-success">{job.category}</span>
                      <span className="badge bg-gray-100 text-gray-700 capitalize">{job.experienceLevel}</span>
                    </div>
                  </div>

                  <div className="flex md:flex-col gap-2">
                    <Link
                      to={`/employer/jobs/${job.id}/applications`}
                      className="btn btn-outline flex items-center justify-center"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Applications
                    </Link>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="btn btn-secondary flex items-center justify-center"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(job.id, job.title)}
                      className="btn bg-red-50 text-red-600 hover:bg-red-100 flex items-center justify-center"
                      disabled={deleteJobMutation.isLoading}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerJobs;
