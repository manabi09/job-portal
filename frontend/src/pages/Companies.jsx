import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { companyService } from '../services/companyService';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import { Building2, MapPin, Users, Search } from 'lucide-react';
import { getFileUrl } from '../utils/constants';

const Companies = () => {
  const [filters, setFilters] = useState({
    search: '',
    industry: '',
    companySize: '',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['companies', filters],
    queryFn: () => companyService.getCompanies(filters),
  });

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Companies</h1>

          {/* Search and Filters */}
          <div className="card">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="input pl-10"
                />
              </div>

              <select
                value={filters.industry}
                onChange={(e) => handleFilterChange('industry', e.target.value)}
                className="input"
              >
                <option value="">All Industries</option>
                <option value="Technology">Technology</option>
                <option value="Finance">Finance</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Education">Education</option>
                <option value="Retail">Retail</option>
                <option value="Manufacturing">Manufacturing</option>
              </select>

              <select
                value={filters.companySize}
                onChange={(e) => handleFilterChange('companySize', e.target.value)}
                className="input"
              >
                <option value="">All Sizes</option>
                <option value="1-10">1-10 employees</option>
                <option value="11-50">11-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner />
          </div>
        ) : data?.data?.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600">No companies found.</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {data?.count} of {data?.total} companies
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data?.data?.map((company) => (
                <Link
                  key={company.id}
                  to={`/companies/${company.id}`}
                  className="card hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start space-x-4 mb-4">
                    {company.logo ? (
                      <img src={getFileUrl(company.logo)} alt={company.name} className="w-16 h-16 rounded-lg object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-primary-100 flex items-center justify-center">
                        <Building2 className="h-8 w-8 text-primary-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600">
                        {company.name}
                      </h3>
                      <p className="text-sm text-gray-600">{company.industry}</p>
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2 mb-4">{company.description}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{company.location?.headquarters?.city || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{company.companySize}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Companies;
