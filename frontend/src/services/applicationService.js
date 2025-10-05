import api from '../utils/api';

export const applicationService = {
  // Apply for a job
  applyForJob: async (applicationData) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },

  // Get my applications
  getMyApplications: async () => {
    const response = await api.get('/applications');
    return response.data;
  },

  // Get single application
  getApplication: async (id) => {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },

  // Get applications for a job (employer only)
  getJobApplications: async (jobId, params = {}) => {
    const response = await api.get(`/applications/job/${jobId}`, { params });
    return response.data;
  },

  // Update application status (employer only)
  updateApplicationStatus: async (id, status, comment) => {
    const response = await api.put(`/applications/${id}/status`, { status, comment });
    return response.data;
  },

  // Withdraw application
  withdrawApplication: async (id) => {
    const response = await api.put(`/applications/${id}/withdraw`);
    return response.data;
  },

  // Add note to application (employer only)
  addNote: async (id, text) => {
    const response = await api.post(`/applications/${id}/notes`, { text });
    return response.data;
  },
};
