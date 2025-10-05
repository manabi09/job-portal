import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { companyService } from '../../services/companyService';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Building2, Upload } from 'lucide-react';

const CompanyProfile = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    companySize: '',
    foundedYear: '',
    website: '',
    location: {
      headquarters: {
        city: '',
        state: '',
        country: '',
      },
    },
    benefits: '',
    culture: '',
  });

  // Check if user already has a company
  const { data: existingCompany } = useQuery({
    queryKey: ['myCompany'],
    queryFn: () => companyService.getMyCompany(),
    enabled: !!user?.companyId,
  });

  useEffect(() => {
    if (existingCompany?.data) {
      const company = existingCompany.data;
      setFormData({
        name: company.name || '',
        description: company.description || '',
        industry: company.industry || '',
        companySize: company.companySize || '',
        foundedYear: company.foundedYear || '',
        website: company.website || '',
        location: {
          headquarters: {
            city: company.location?.headquarters?.city || '',
            state: company.location?.headquarters?.state || '',
            country: company.location?.headquarters?.country || '',
          },
        },
        benefits: company.benefits?.join('\n') || '',
        culture: company.culture || '',
      });
    }
  }, [existingCompany]);

  const createCompanyMutation = useMutation({
    mutationFn: (data) => companyService.createCompany(data),
    onSuccess: (response) => {
      // Update user context with new companyId
      if (response.user) {
        updateUser(response.user);
      }
      toast.success('Company profile created successfully!');
      navigate('/employer/jobs');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create company');
    },
  });

  const updateCompanyMutation = useMutation({
    mutationFn: (data) => companyService.updateCompany(user.companyId, data),
    onSuccess: () => {
      toast.success('Company profile updated successfully!');
      navigate('/employer/jobs');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update company');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const field = name.split('.')[2];
      setFormData({
        ...formData,
        location: {
          headquarters: {
            ...formData.location.headquarters,
            [field]: value,
          },
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSubmit = {
      ...formData,
      benefits: formData.benefits.split('\n').map(b => b.trim()).filter(b => b),
      foundedYear: formData.foundedYear ? parseInt(formData.foundedYear) : undefined,
    };

    if (user?.companyId) {
      updateCompanyMutation.mutate(dataToSubmit);
    } else {
      createCompanyMutation.mutate(dataToSubmit);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-2">
            <Building2 className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">
              {user?.companyId ? 'Edit Company Profile' : 'Create Company Profile'}
            </h1>
          </div>
          <p className="text-gray-600">
            {user?.companyId 
              ? 'Update your company information' 
              : 'Set up your company profile to start posting jobs'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  required
                  placeholder="e.g. Acme Corporation"
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
                  placeholder="Tell us about your company, what you do, and what makes you unique..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                  <select name="industry" value={formData.industry} onChange={handleChange} className="input" required>
                    <option value="">Select Industry</option>
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Education">Education</option>
                    <option value="Retail">Retail</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Consulting">Consulting</option>
                    <option value="Media">Media</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company Size *</label>
                  <select name="companySize" value={formData.companySize} onChange={handleChange} className="input" required>
                    <option value="">Select Size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="501-1000">501-1000 employees</option>
                    <option value="1000+">1000+ employees</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Founded Year</label>
                  <input
                    type="number"
                    name="foundedYear"
                    value={formData.foundedYear}
                    onChange={handleChange}
                    className="input"
                    min="1800"
                    max={new Date().getFullYear()}
                    placeholder="e.g. 2010"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="input"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Headquarters Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  name="location.headquarters.city"
                  value={formData.location.headquarters.city}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <input
                  type="text"
                  name="location.headquarters.state"
                  value={formData.location.headquarters.state}
                  onChange={handleChange}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <input
                  type="text"
                  name="location.headquarters.country"
                  value={formData.location.headquarters.country}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>
            </div>
          </div>

          {/* Culture */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Culture</label>
            <textarea
              name="culture"
              value={formData.culture}
              onChange={handleChange}
              rows={4}
              className="input"
              placeholder="Describe your company culture, values, and work environment..."
            />
          </div>

          {/* Benefits */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Benefits & Perks (one per line)</label>
            <textarea
              name="benefits"
              value={formData.benefits}
              onChange={handleChange}
              rows={4}
              className="input"
              placeholder="Health insurance&#10;401(k) matching&#10;Flexible work hours&#10;Remote work options"
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
              disabled={createCompanyMutation.isLoading || updateCompanyMutation.isLoading}
              className="btn btn-primary"
            >
              {createCompanyMutation.isLoading || updateCompanyMutation.isLoading
                ? 'Saving...'
                : user?.companyId
                ? 'Update Company'
                : 'Create Company'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompanyProfile;
