import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService';
import { User, Mail, Phone, MapPin, Briefcase, Upload, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { getFileUrl } from '../utils/constants';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    bio: user?.bio || '',
    skills: user?.skills?.join(', ') || '',
    experience: user?.experience || 0,
    location: {
      city: user?.location?.city || '',
      state: user?.location?.state || '',
      country: user?.location?.country || '',
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data) => authService.updateProfile(data),
    onSuccess: (response) => {
      updateUser(response.data);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const uploadResumeMutation = useMutation({
    mutationFn: (file) => authService.uploadResume(file),
    onSuccess: (response) => {
      updateUser(response.data);
      toast.success('Resume uploaded successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload resume');
    },
  });

  const uploadAvatarMutation = useMutation({
    mutationFn: (file) => authService.uploadAvatar(file),
    onSuccess: (response) => {
      updateUser(response.data);
      toast.success('Avatar uploaded successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to upload avatar');
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        location: { ...formData.location, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSubmit = {
      ...formData,
      skills: formData.skills.split(',').map(s => s.trim()).filter(s => s),
    };
    updateProfileMutation.mutate(dataToSubmit);
  };

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadResumeMutation.mutate(file);
    }
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      uploadAvatarMutation.mutate(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>

        {/* Avatar Section */}
        <div className="card mb-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              {user?.avatar ? (
                <img src={getFileUrl(user.avatar)} alt={user.name} className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary-600" />
                </div>
              )}
              <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700">
                <Upload className="h-4 w-4" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Resume Section (Job Seekers Only) */}
        {user?.role === 'jobseeker' && (
          <div className="card mb-6">
            <h3 className="text-lg font-semibold mb-4">Resume</h3>
            <div className="flex items-center justify-between">
              <div>
                {user?.resume ? (
                  <a href={getFileUrl(user.resume)} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                    View Current Resume
                  </a>
                ) : (
                  <p className="text-gray-600">No resume uploaded</p>
                )}
              </div>
              <label className="btn btn-outline cursor-pointer">
                <Upload className="h-4 w-4 mr-2" />
                Upload Resume
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        {/* Profile Information */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold">Profile Information</h3>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn btn-outline">
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={4}
                  className="input"
                  placeholder="Tell us about yourself..."
                />
              </div>

              {user?.role === 'jobseeker' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma-separated)</label>
                    <input
                      type="text"
                      name="skills"
                      value={formData.skills}
                      onChange={handleChange}
                      className="input"
                      placeholder="JavaScript, React, Node.js"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="input"
                      min="0"
                    />
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    className="input"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                  <input
                    type="text"
                    name="location.country"
                    value={formData.location.country}
                    onChange={handleChange}
                    className="input"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateProfileMutation.isLoading}
                  className="btn btn-primary"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updateProfileMutation.isLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center text-gray-700">
                <Mail className="h-5 w-5 mr-3 text-gray-400" />
                <span>{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center text-gray-700">
                  <Phone className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{user.phone}</span>
                </div>
              )}
              {user?.location?.city && (
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 mr-3 text-gray-400" />
                  <span>
                    {user.location.city}
                    {user.location.state && `, ${user.location.state}`}
                    {user.location.country && `, ${user.location.country}`}
                  </span>
                </div>
              )}
              {user?.role === 'jobseeker' && user?.experience !== undefined && (
                <div className="flex items-center text-gray-700">
                  <Briefcase className="h-5 w-5 mr-3 text-gray-400" />
                  <span>{user.experience} years of experience</span>
                </div>
              )}
              {user?.bio && (
                <div className="pt-4 border-t border-gray-200">
                  <p className="text-gray-700">{user.bio}</p>
                </div>
              )}
              {user?.skills?.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
