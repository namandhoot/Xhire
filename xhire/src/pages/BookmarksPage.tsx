import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBookmark } from 'react-icons/fi';
import { Tweet } from '../types';
import { jobService } from '../services/jobService';
import Layout from '../components/Layout';
import JobCard from '../components/JobCard';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ApiStatusIndicator from '../components/ApiStatusIndicator';

const BookmarksPage: React.FC = () => {
  const [bookmarkedTweets, setBookmarkedTweets] = useState<Tweet[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn] = useState<boolean>(true); // Mocked logged in state
  const [showApiStatus, setShowApiStatus] = useState<boolean>(true);

  // Load bookmarks from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
      const parsedBookmarks = JSON.parse(savedBookmarks);
      setBookmarks(parsedBookmarks);
      fetchBookmarkedTweets(parsedBookmarks);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Fetch bookmarked tweets
  const fetchBookmarkedTweets = async (bookmarkIds: string[]) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (bookmarkIds.length === 0) {
        setBookmarkedTweets([]);
        setIsLoading(false);
        return;
      }

      // For each bookmark ID, fetch the tweet details
      // In a real app, we'd have a batch API for this
      const tweetsPromises = bookmarkIds.map(id => jobService.getTweetById(id));
      const tweets = await Promise.all(tweetsPromises);
      
      // Filter out any undefined tweets (in case a bookmarked tweet was deleted)
      setBookmarkedTweets(tweets.filter(tweet => tweet !== undefined) as Tweet[]);
    } catch (err) {
      setError('Failed to fetch bookmarked tweets. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle removing a bookmark
  const handleToggleBookmark = (tweetId: string) => {
    const updatedBookmarks = bookmarks.filter(id => id !== tweetId);
    setBookmarks(updatedBookmarks);
    localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
    
    // Update the bookmarked tweets list
    setBookmarkedTweets(prevTweets => prevTweets.filter(tweet => tweet.id !== tweetId));
  };

  return (
    <Layout isLoggedIn={isLoggedIn} username="User">
      <section className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Your Bookmarked Jobs
          </h1>
          <p className="text-dark">
            Save interesting job opportunities to apply to later
          </p>
        </div>
        
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
        
        {/* Bookmarked Jobs */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-10">
              <LoadingSpinner size="large" />
            </div>
          ) : error ? (
            <EmptyState
              title="Error loading bookmarks"
              message={error}
              action={
                <button 
                  className="btn-primary"
                  onClick={() => fetchBookmarkedTweets(bookmarks)}
                >
                  Try Again
                </button>
              }
            />
          ) : bookmarkedTweets.length === 0 ? (
            <EmptyState
              title="No bookmarks yet"
              message="Save jobs to easily find them later. Browse jobs to start bookmarking."
              icon={<FiBookmark size={48} className="text-light" />}
              action={
                <Link to="/" className="btn-primary">
                  Browse Jobs
                </Link>
              }
            />
          ) : (
            bookmarkedTweets.map(tweet => (
              <JobCard
                key={tweet.id}
                tweet={tweet}
                isBookmarked={true}
                onBookmark={handleToggleBookmark}
              />
            ))
          )}
        </div>
        
        {/* Upgrade CTA */}
        <div className="mt-12 bg-primary bg-opacity-5 p-6 rounded-lg border border-primary border-opacity-20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-semibold mb-2">Upgrade to Pro</h3>
              <p className="text-dark">
                Save up to 50 bookmarks and get personalized job alerts
              </p>
            </div>
            <button className="btn-primary">
              Upgrade Now
            </button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default BookmarksPage; 