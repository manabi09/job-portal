import api from '../utils/api';

export const companyService = {
  // Get all companies
  getCompanies: async (params = {}) => {
    const response = await api.get('/companies', { params });
    return response.data;
  },

  // Get single company
  getCompany: async (id) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  // Create company (employer only)
  createCompany: async (companyData) => {
    const response = await api.post('/companies', companyData);
    return response.data;
  },

  // Update company (employer only)
  updateCompany: async (id, companyData) => {
    const response = await api.put(`/companies/${id}`, companyData);
    return response.data;
  },

  // Delete company (employer only)
  deleteCompany: async (id) => {
    const response = await api.delete(`/companies/${id}`);
    return response.data;
  },

  // Get my company (employer only)
  getMyCompany: async () => {
    const response = await api.get('/companies/my/company');
    return response.data;
  },

  // Upload company logo
  uploadLogo: async (id, file) => {
    const formData = new FormData();
    formData.append('logo', file);
    const response = await api.post(`/companies/${id}/logo`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};
