import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { companyService } from '../services/companyService';
import LoadingSpinner from '../components/LoadingSpinner';
import JobCard from '../components/JobCard';
import { Building2, MapPin, Users, Calendar, Globe, Award, Facebook, Instagram } from 'lucide-react';
import { getFileUrl } from '../utils/constants';

const CompanyDetails = () => {
  const { id } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['company', id],
    queryFn: () => companyService.getCompany(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const company = data?.data;

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Company not found</h2>
          <Link to="/companies" className="text-primary-600 hover:text-primary-700">
            Back to companies
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Company Header */}
        <div className="card mb-6">
          <div className="flex items-start space-x-6 mb-6">
            {company.logo ? (
              <img src={getFileUrl(company.logo)} alt={company.name} className="w-24 h-24 rounded-lg object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-lg bg-primary-100 flex items-center justify-center">
                <Building2 className="h-12 w-12 text-primary-600" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
              <p className="text-lg text-gray-600 mb-4">{company.industry}</p>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    {company.location?.headquarters?.city}, {company.location?.headquarters?.country}
                  </span>
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  <span>{company.companySize} employees</span>
                </div>
                {company.foundedYear && (
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>Founded in {company.foundedYear}</span>
                  </div>
                )}
              </div>

              {/* Social Links */}
              {(company.website || company.socialLinks) && (
                <div className="flex gap-3 mt-4">
                  {company.website && (
                    <a
                      href={company.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-primary-600"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                  {company.socialLinks?.linkedin && (
                    <a
                      href={company.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-primary-600"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {company.socialLinks?.twitter && (
                    <a
                      href={company.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-primary-600"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {company.socialLinks?.facebook && (
                    <a
                      href={company.socialLinks.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-primary-600"
                    >
                      <Facebook className="h-5 w-5" />
                    </a>
                  )}
                  {company.socialLinks?.instagram && (
                    <a
                      href={company.socialLinks.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-primary-600"
                    >
                      <Instagram className="h-5 w-5" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">About Us</h2>
            <p className="text-gray-700 whitespace-pre-line">{company.description}</p>
          </div>

          {/* Culture */}
          {company.culture && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Company Culture</h2>
              <p className="text-gray-700 whitespace-pre-line">{company.culture}</p>
            </div>
          )}

          {/* Benefits */}
          {company.benefits?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-3">Benefits & Perks</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {company.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Open Positions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Open Positions</h2>
          {company.jobs?.length === 0 ? (
            <div className="card text-center py-12">
              <p className="text-gray-600">No open positions at the moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {company.jobs?.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;
