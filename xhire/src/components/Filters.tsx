import { useState } from 'react';
import { FilterOptions } from '../types';
import { FiFilter, FiChevronDown, FiX } from 'react-icons/fi';

interface FiltersProps {
  onFilterChange: (filters: Partial<FilterOptions>) => void;
}

const Filters: React.FC<FiltersProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    jobType: [],
    roles: [],
    dateRange: '30d',
    verifiedOnly: false,
  });
  
  // Job type options
  const jobTypeOptions = ['Full-time', 'Internship', 'Freelance', 'Remote'];
  
  // Role options
  const roleOptions = [
    'Frontend Developer',
    'Backend Developer',
    'Full Stack Developer',
    'Product Manager',
    'UI/UX Designer',
    'Data Scientist',
    'DevOps Engineer',
    'Marketing Specialist',
    'Content Writer',
  ];
  
  // Date range options
  const dateRangeOptions = [
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' },
    { value: '30d', label: 'Last 30 days' },
  ];
  
  // Handle job type change
  const handleJobTypeChange = (jobType: string) => {
    const updatedJobTypes = filters.jobType.includes(jobType)
      ? filters.jobType.filter(type => type !== jobType)
      : [...filters.jobType, jobType];
    
    const updatedFilters = {
      ...filters,
      jobType: updatedJobTypes,
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  // Handle role change
  const handleRoleChange = (role: string) => {
    const updatedRoles = filters.roles.includes(role)
      ? filters.roles.filter(r => r !== role)
      : [...filters.roles, role];
    
    const updatedFilters = {
      ...filters,
      roles: updatedRoles,
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  // Handle date range change
  const handleDateRangeChange = (dateRange: string) => {
    const updatedFilters = {
      ...filters,
      dateRange,
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  // Handle verified only toggle
  const handleVerifiedOnlyChange = (checked: boolean) => {
    const updatedFilters = {
      ...filters,
      verifiedOnly: checked,
    };
    
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };
  
  // Clear all filters
  const clearFilters = () => {
    const resetFilters = {
      jobType: [],
      roles: [],
      dateRange: '30d',
      verifiedOnly: false,
    };
    
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };
  
  // Count active filters
  const activeFilterCount = 
    filters.jobType.length + 
    filters.roles.length + 
    (filters.dateRange !== '30d' ? 1 : 0) + 
    (filters.verifiedOnly ? 1 : 0);
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <button 
          className="flex items-center btn-secondary"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FiFilter className="mr-2" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-2 bg-primary text-white text-xs px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
          <FiChevronDown className={`ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        {activeFilterCount > 0 && (
          <button 
            className="text-dark hover:text-secondary text-sm"
            onClick={clearFilters}
          >
            Clear all
          </button>
        )}
      </div>
      
      {isOpen && (
        <div className="bg-white shadow-md rounded-lg p-4 mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Job Type */}
          <div>
            <h3 className="font-medium mb-2">Job Type</h3>
            <div className="space-y-2">
              {jobTypeOptions.map(type => (
                <label key={type} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="form-checkbox text-primary h-4 w-4 mr-2"
                    checked={filters.jobType.includes(type)}
                    onChange={() => handleJobTypeChange(type)}
                  />
                  <span>{type}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Date Range */}
          <div>
            <h3 className="font-medium mb-2">Date Range</h3>
            <div className="space-y-2">
              {dateRangeOptions.map(option => (
                <label key={option.value} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    className="form-radio text-primary h-4 w-4 mr-2"
                    checked={filters.dateRange === option.value}
                    onChange={() => handleDateRangeChange(option.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
            
            {/* Verified Only */}
            <div className="mt-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="form-checkbox text-primary h-4 w-4 mr-2"
                  checked={filters.verifiedOnly}
                  onChange={(e) => handleVerifiedOnlyChange(e.target.checked)}
                />
                <span>Verified accounts only</span>
              </label>
            </div>
          </div>
          
          {/* Roles */}
          <div className="md:col-span-2">
            <h3 className="font-medium mb-2">Roles</h3>
            <div className="flex flex-wrap gap-2">
              {roleOptions.map(role => (
                <div 
                  key={role}
                  className={`px-3 py-1 rounded-full text-sm cursor-pointer transition-colors ${
                    filters.roles.includes(role) 
                      ? 'bg-primary text-white' 
                      : 'bg-lighter text-dark hover:bg-light'
                  }`}
                  onClick={() => handleRoleChange(role)}
                >
                  {role}
                  {filters.roles.includes(role) && (
                    <FiX className="inline ml-1" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Display selected filters */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.jobType.map(type => (
            <div 
              key={type}
              className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full text-xs flex items-center"
            >
              {type}
              <button 
                className="ml-1"
                onClick={() => handleJobTypeChange(type)}
              >
                <FiX />
              </button>
            </div>
          ))}
          
          {filters.roles.map(role => (
            <div 
              key={role}
              className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full text-xs flex items-center"
            >
              {role}
              <button 
                className="ml-1"
                onClick={() => handleRoleChange(role)}
              >
                <FiX />
              </button>
            </div>
          ))}
          
          {filters.dateRange !== '30d' && (
            <div className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full text-xs flex items-center">
              {dateRangeOptions.find(option => option.value === filters.dateRange)?.label}
              <button 
                className="ml-1"
                onClick={() => handleDateRangeChange('30d')}
              >
                <FiX />
              </button>
            </div>
          )}
          
          {filters.verifiedOnly && (
            <div className="bg-primary bg-opacity-10 text-primary px-2 py-1 rounded-full text-xs flex items-center">
              Verified only
              <button 
                className="ml-1"
                onClick={() => handleVerifiedOnlyChange(false)}
              >
                <FiX />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Filters; 