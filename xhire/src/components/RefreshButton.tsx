import { useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';
import { jobService } from '../services/jobService';

interface RefreshButtonProps {
  onRefresh?: () => void;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    try {
      // Refresh API status
      await jobService.refreshApiStatus();
      
      // Call the onRefresh callback if provided
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error refreshing API status:', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  return (
    <button
      className="flex items-center text-primary hover:text-blue-600 transition-colors text-sm"
      onClick={handleRefresh}
      disabled={isRefreshing}
      aria-label="Refresh API status"
    >
      <FiRefreshCw className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
      <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
    </button>
  );
};

export default RefreshButton; 