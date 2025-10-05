import { Link } from 'react-router-dom';
import { MapPin, Briefcase, DollarSign, Clock, Building2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { getFileUrl } from '../utils/constants';

const JobCard = ({ job }) => {
  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return 'Not disclosed';
    
    const formatAmount = (amount) => {
      if (amount >= 100000) return `${(amount / 100000).toFixed(1)}L`;
      if (amount >= 1000) return `${(amount / 1000).toFixed(0)}K`;
      return amount;
    };

    const range = salary.min && salary.max 
      ? `${formatAmount(salary.min)} - ${formatAmount(salary.max)}`
      : salary.min 
        ? `${formatAmount(salary.min)}+`
        : `Up to ${formatAmount(salary.max)}`;

    return `${salary.currency} ${range}/${salary.period}`;
  };

  return (
    <Link to={`/jobs/${job.id}`} className="card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          {job.company?.logo ? (
            <img src={getFileUrl(job.company.logo)} alt={job.company?.name} className="w-12 h-12 rounded-lg object-cover" />
          ) : (
            <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center">
              <Building2 className="h-6 w-6 text-primary-600" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 hover:text-primary-600">{job.title}</h3>
            <p className="text-sm text-gray-600">{job.company?.name}</p>
          </div>
        </div>
        <span className="badge badge-primary capitalize">{job.jobType}</span>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{job.location.city}, {job.location.country}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Briefcase className="h-4 w-4 mr-2" />
          <span className="capitalize">{job.experienceLevel}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <DollarSign className="h-4 w-4 mr-2" />
          <span>{formatSalary(job.salary)}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
        </div>
      </div>

      <p className="text-sm text-gray-600 line-clamp-2 mb-4">{job.description}</p>

      <div className="flex flex-wrap gap-2">
        {job.skills?.slice(0, 3).map((skill, index) => (
          <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
            {skill}
          </span>
        ))}
        {job.skills?.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
            +{job.skills.length - 3} more
          </span>
        )}
      </div>
    </Link>
  );
};

export default JobCard;
