import { useState, useEffect } from 'react';
import { FiRefreshCw, FiSearch, FiTerminal } from 'react-icons/fi';
import { Tweet, FilterOptions } from '../types';
import { jobService } from '../services/jobService';
import { twitterApi } from '../services/twitterApi';
import Layout from '../components/Layout';
import JobCard from '../components/JobCard';
import Filters from '../components/Filters';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ApiStatusIndicator from '../components/ApiStatusIndicator';
import TwitterDebugPanel from '../components/TwitterDebugPanel';

const HomePage: React.FC = () => {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterOptions, setFilterOptions] = useState<Partial<FilterOptions>>({});
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isLoggedIn] = useState<boolean>(false); // Mock logged in state
  const [showApiStatus, setShowApiStatus] = useState<boolean>(true);
  const [debugMode, setDebugMode] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);

  // Fetch tweets on component mount
  useEffect(() => {
    fetchTweets();
    // Load bookmarks from localStorage
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  // Fetch tweets when filter options change
  useEffect(() => {
    fetchTweets();
  }, [filterOptions]);

  // Log raw tweets for debugging
  useEffect(() => {
    if (debugMode) {
      console.log('Raw tweets from API:', tweets);
    }
  }, [tweets, debugMode]);

  const fetchTweets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await jobService.getTweets(filterOptions);
      setTweets(data);
    } catch (err) {
      setError('Failed to fetch job tweets. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Direct search function that uses jobService to handle API logic
  const searchJobsDirectly = async (query: string) => {
    if (!query.trim()) {
      // If search is empty, just use regular fetch with existing filters
      fetchTweets();
      return;
    }

    try {
      setIsSearching(true);
      setIsLoading(true);
      setError(null);
      
      console.log('Searching jobs with query:', query);
      
      // Create a search query that combines job terms with user's query
      const searchQuery = `("hiring" OR "job opening") ${query} -is:retweet lang:en`;
      
      // Prepare filters, prioritizing the direct search query
      // Use type assertion to satisfy TypeScript
      const searchFilters = {
        ...filterOptions,
        directQuery: searchQuery,
        // Clear other potentially conflicting filters when doing a direct search?
        // jobType: [], 
        // roles: [],
      } as Partial<FilterOptions>; // Assert type here
      
      // Call jobService.getTweets with the direct query filter
      const data = await jobService.getTweets(searchFilters);
      
      setTweets(data);
      
      if (data.length === 0) {
        setError('No jobs found matching your search. Try different keywords.');
      }
      
    } catch (err: any) {
      setError(`Failed to search jobs: ${err.message}`);
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTweets();
  };

  const handleFilterChange = (filters: Partial<FilterOptions>) => {
    setFilterOptions(filters);
  };

  const handleToggleBookmark = (tweetId: string) => {
    let updatedBookmarks: string[];
    
    if (bookmarks.includes(tweetId)) {
      updatedBookmarks = bookmarks.filter(id => id !== tweetId);
    } else {
      updatedBookmarks = [...bookmarks, tweetId];
    }
    
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
  };

  // Handle search input submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    searchJobsDirectly(searchTerm);
  };

  // Toggle debug mode with keyboard shortcut (Ctrl + Shift + D)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setDebugMode(prev => !prev);
        console.log('Debug mode:', !debugMode);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [debugMode]);

  // Filter tweets by search term for client-side filtering
  const filteredTweets = tweets.filter(tweet => {
    if (!searchTerm || isSearching) return true; // Skip client-side filtering if server search is active
    const tweetText = tweet.text.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    
    // Check if search term is in tweet text or user name
    return tweetText.includes(searchTermLower) || 
      tweet.user.name.toLowerCase().includes(searchTermLower) ||
      (tweet.ai_summary?.role?.toLowerCase().includes(searchTermLower) || false);
  });

  return (
    <Layout isLoggedIn={isLoggedIn}>
      <section className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Job Hunt, Reimagined via 
            <span className="text-primary"> X</span>
          </h1>
          <p className="text-dark text-lg mb-6">
            Discover real-time job opportunities posted on Twitter, filtered by your skills and preferences
          </p>
        </div>
        
        {/* Debug Mode Indicator */}
        {debugMode && (
          <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
            <div className="flex items-center justify-center text-yellow-700">
              <FiTerminal className="mr-2" />
              <span className="font-medium">Debug Mode Active</span>
            </div>
          </div>
        )}
        
        {/* API Status Indicator */}
        {showApiStatus && (
          <div className="mb-6 relative">
            <button 
              className="absolute top-3 right-3 text-dark hover:text-secondary transition-colors"
              onClick={() => setShowApiStatus(false)}
              aria-label="Close API status"
            >
              ✕
            </button>
            <ApiStatusIndicator />
          </div>
        )}
        
        {/* Twitter Debug Panel (only shown in debug mode) */}
        {debugMode && <TwitterDebugPanel />}
        
        {/* Search & Filters */}
        <div className="mb-6">
          <form onSubmit={handleSearchSubmit} className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-dark" />
            </div>
            <input
              type="text"
              placeholder="Search for jobs by keyword, company, or role..."
              className="input pl-10 pr-24 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 btn-primary h-8 px-3 rounded"
              disabled={isSearching}
            >
              {isSearching ? 'Searching...' : 'Search Jobs'}
            </button>
          </form>
          
          <Filters onFilterChange={handleFilterChange} />
        </div>
        
        {/* Refresh Button */}
        <div className="flex justify-between items-center mb-4">
          <div className="text-dark">
            {filteredTweets.length} job opportunities found
            {debugMode && (
              <span className="ml-2 text-xs text-gray-500">
                (raw count: {tweets.length})
              </span>
            )}
          </div>
          <div className="flex items-center">
            {debugMode && (
              <button
                className="text-sm text-yellow-700 bg-yellow-50 hover:bg-yellow-100 px-3 py-1 rounded border border-yellow-200 mr-3"
                onClick={() => setDebugMode(false)}
              >
                Exit Debug Mode
              </button>
            )}
            <button 
              className="flex items-center text-primary hover:text-blue-600 transition-colors"
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <FiRefreshCw className={`mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
        
        {/* Debug Info */}
        {debugMode && (
          <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs font-mono">
            <div className="font-medium mb-1">Debug Information:</div>
            <div>API Status: {jobService.isTwitterConfigured() ? 'Configured' : 'Not Configured'}</div>
            <div>Using Owner Keys: {jobService.isUsingOwnerKeys() ? 'Yes' : 'No'}</div>
            <div>Filter Options: {JSON.stringify(filterOptions)}</div>
            <div>First Tweet Type: {tweets.length > 0 ? typeof tweets[0] : 'N/A'}</div>
          </div>
        )}
        
        {/* Job Cards */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-10">
              <LoadingSpinner size="large" />
            </div>
          ) : error ? (
            <EmptyState
              title="Error loading jobs"
              message={error}
              action={
                <button 
                  className="btn-primary"
                  onClick={fetchTweets}
                >
                  Try Again
                </button>
              }
            />
          ) : filteredTweets.length === 0 ? (
            <EmptyState
              title="No jobs found"
              message="Try adjusting your filters or search term to see more results."
              action={
                <button 
                  className="btn-primary"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterOptions({});
                  }}
                >
                  Reset Filters
                </button>
              }
            />
          ) : (
            filteredTweets.map(tweet => (
              <JobCard
                key={tweet.id}
                tweet={tweet}
                isBookmarked={bookmarks.includes(tweet.id)}
                onBookmark={handleToggleBookmark}
              />
            ))
          )}
        </div>
        
        {/* Pro Upsell */}
        {!isLoggedIn && (
          <div className="mt-12 bg-primary bg-opacity-5 p-6 rounded-lg border border-primary border-opacity-20 text-center">
            <h3 className="text-xl font-semibold mb-2">Get More Job Opportunities</h3>
            <p className="text-dark mb-4">
              Upgrade to Pro for unlimited bookmarks, personalized job alerts, and AI-powered insights.
            </p>
            <button className="btn-primary">
              Upgrade to Pro
            </button>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default HomePage; 