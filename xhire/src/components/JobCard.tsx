import { useState } from 'react';
import { Tweet } from '../types';
import { FiExternalLink, FiBookmark, FiCheck, FiTwitter } from 'react-icons/fi';

interface JobCardProps {
  tweet: Tweet;
  isBookmarked: boolean;
  onBookmark: (tweetId: string) => void;
}

const JobCard: React.FC<JobCardProps> = ({ tweet, isBookmarked, onBookmark }) => {
  const [showFullText, setShowFullText] = useState(false);
  
  // Format the date to a readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric',
      year: 'numeric' 
    });
  };
  
  // Highlight keywords in tweet text
  const highlightKeywords = (text: string) => {
    const keywords = ['hiring', 'job', 'remote', 'full-time', 'freelance', 'internship'];
    let highlightedText = text;
    
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      highlightedText = highlightedText.replace(regex, match => `<span class="text-primary font-medium">${match}</span>`);
    });
    
    return { __html: highlightedText };
  };
  
  // Truncate text for preview
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  // Get the tweet URL
  const getTweetUrl = () => {
    if (tweet.tweet_url) {
      return tweet.tweet_url;
    }
    return `https://twitter.com/${tweet.user.username}/status/${tweet.id}`;
  };
  
  return (
    <div className="card flex flex-col w-full mb-4 hover:border-primary hover:border transition-all">
      {/* Header with user info */}
      <div className="flex items-center mb-3">
        <img 
          src={tweet.user.profile_image_url} 
          alt={tweet.user.name} 
          className="w-10 h-10 rounded-full mr-3"
        />
        <div className="flex flex-col">
          <div className="flex items-center">
            <span className="font-semibold">{tweet.user.name}</span>
            {tweet.user.verified && (
              <svg className="w-4 h-4 ml-1 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
              </svg>
            )}
          </div>
          <span className="text-dark text-sm">@{tweet.user.username} • {formatDate(tweet.created_at)}</span>
        </div>
      </div>
      
      {/* Tweet content */}
      <div className="mb-4">
        {showFullText ? (
          <p 
            className="text-secondary mb-2" 
            dangerouslySetInnerHTML={highlightKeywords(tweet.text)} 
          />
        ) : (
          <p 
            className="text-secondary mb-2" 
            dangerouslySetInnerHTML={highlightKeywords(truncateText(tweet.text, 180))} 
          />
        )}
        {tweet.text.length > 180 && (
          <button 
            className="text-primary text-sm font-medium hover:underline" 
            onClick={() => setShowFullText(!showFullText)}
          >
            {showFullText ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>
      
      {/* AI Summary */}
      {tweet.ai_summary && (
        <div className="bg-lightest p-3 rounded-lg mb-4">
          <h3 className="font-medium mb-2">AI Summary:</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {tweet.ai_summary.role && (
              <div>
                <span className="text-dark">Role:</span> {tweet.ai_summary.role}
              </div>
            )}
            {tweet.ai_summary.company && (
              <div>
                <span className="text-dark">Company:</span> {tweet.ai_summary.company}
              </div>
            )}
            {tweet.ai_summary.location && (
              <div>
                <span className="text-dark">Location:</span> {tweet.ai_summary.location}
              </div>
            )}
            {tweet.ai_summary.salary && (
              <div>
                <span className="text-dark">Salary:</span> {tweet.ai_summary.salary}
              </div>
            )}
            {tweet.ai_summary.how_to_apply && (
              <div className="col-span-2">
                <span className="text-dark">How to Apply:</span> {tweet.ai_summary.how_to_apply}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex justify-between mt-auto pt-2 border-t border-lighter">
        <a 
          href={getTweetUrl()} 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center text-primary hover:underline"
          onClick={(e) => {
            // Add analytics tracking here if needed
            console.log(`Clicked to view tweet ${tweet.id} on Twitter`);
          }}
        >
          <FiTwitter className="mr-1" />
          <span>View on Twitter</span>
        </a>
        
        <button 
          className={`flex items-center ${isBookmarked ? 'text-primary' : 'text-dark'} hover:text-primary`}
          onClick={() => onBookmark(tweet.id)}
        >
          {isBookmarked ? (
            <>
              <FiCheck className="mr-1" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <FiBookmark className="mr-1" />
              <span>Save</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default JobCard; 