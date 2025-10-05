import { Link } from 'react-router-dom';
import { Search, Briefcase, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.append('search', searchQuery);
    if (location) params.append('location', location);
    navigate(`/jobs?${params.toString()}`);
  };

  const features = [
    {
      icon: <Briefcase className="h-8 w-8 text-primary-600" />,
      title: 'Thousands of Jobs',
      description: 'Browse through thousands of job opportunities from top companies worldwide.',
    },
    {
      icon: <Users className="h-8 w-8 text-primary-600" />,
      title: 'Top Companies',
      description: 'Connect with leading employers and startups looking for talented professionals.',
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-primary-600" />,
      title: 'Career Growth',
      description: 'Find opportunities that match your skills and help you grow professionally.',
    },
  ];

  const categories = [
    'Software Development',
    'Data Science',
    'Design',
    'Marketing',
    'Sales',
    'Finance',
    'Operations',
    'Customer Support',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Dream Job Today
            </h1>
            <p className="text-xl text-primary-100">
              Thousands of jobs in top companies. Start your career journey now.
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-2 flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Job title, keywords, or company"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full outline-none text-gray-900"
                />
              </div>
              <div className="flex-1 flex items-center px-4 border-t md:border-t-0 md:border-l border-gray-200 pt-2 md:pt-0">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="City or country"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full outline-none text-gray-900"
                />
              </div>
              <button type="submit" className="btn btn-primary md:w-auto">
                Search Jobs
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Browse by Category</h2>
            <p className="text-gray-600">Find jobs in your preferred industry</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/jobs?category=${encodeURIComponent(category)}`}
                className="card text-center hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-900">{category}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of job seekers and employers on our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register?role=jobseeker" className="btn bg-white text-primary-600 hover:bg-gray-100">
              I'm Looking for a Job
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link to="/register?role=employer" className="btn bg-primary-700 text-white hover:bg-primary-800">
              I'm Hiring
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
