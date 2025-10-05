import api from '../utils/api';

export const jobService = {
  // Get all jobs with filters
  getJobs: async (params = {}) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  // Get single job
  getJob: async (id) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  // Create job (employer only)
  createJob: async (jobData) => {
    const response = await api.post('/jobs', jobData);
    return response.data;
  },

  // Update job (employer only)
  updateJob: async (id, jobData) => {
    const response = await api.put(`/jobs/${id}`, jobData);
    return response.data;
  },

  // Delete job (employer only)
  deleteJob: async (id) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },

  // Get my posted jobs (employer only)
  getMyJobs: async () => {
    const response = await api.get('/jobs/my/posted');
    return response.data;
  },

  // Get job statistics
  getJobStats: async (id) => {
    const response = await api.get(`/jobs/${id}/stats`);
    return response.data;
  },
};
