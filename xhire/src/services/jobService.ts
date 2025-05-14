import { Tweet, FilterOptions } from '../types';
import { tweetService } from './tweetService';
import { twitterApi } from './twitterApi';
import { geminiApi } from './geminiApi';
import { xhireApi } from './xhireApi';

// Check if API keys are configured
const isTwitterConfigured = !!import.meta.env.VITE_TWITTER_BEARER_TOKEN;
const isGeminiConfigured = !!import.meta.env.VITE_GEMINI_API_KEY;
const isXhireApiConfigured = !!import.meta.env.VITE_XHIRE_API_ENDPOINT;
const useOwnerKeys = import.meta.env.VITE_USE_OWNER_KEYS === 'true';

// API status cache
let apiStatus = {
  twitter: isTwitterConfigured,
  gemini: isGeminiConfigured
};

// Initialize API status
const updateApiStatus = async () => {
  if (isXhireApiConfigured) {
    try {
      apiStatus = await xhireApi.getApiStatus();
    } catch (error) {
      console.error('Failed to get API status:', error);
    }
  } else {
    apiStatus = {
      twitter: isTwitterConfigured,
      gemini: isGeminiConfigured
    };
  }
};

// Initial status update
updateApiStatus();

export const jobService = {
  /**
   * Get tweets based on filter options
   * Uses the owner's Twitter API keys by default
   */
  getTweets: async (filters?: Partial<FilterOptions>): Promise<Tweet[]> => {
    try {
      let tweets: Tweet[];
      let source: string = 'mock'; // Track the data source

      // If XHire API is configured, use it
      if (isXhireApiConfigured) {
        console.log('Using XHire API for data with filters:', filters);
        tweets = await xhireApi.getTweets(filters);
        source = 'xhire';
      }
      // If Twitter API is configured, use it
      else if (isTwitterConfigured) {
        console.log('Using Twitter API with owner\'s credentials with filters:', filters);
        tweets = await twitterApi.searchTweets(filters);
        source = 'twitter';
        
        if (tweets.length === 0) {
          console.warn('Twitter API returned no tweets. Falling back to mock data for demonstration.');
          tweets = await tweetService.getTweets(filters);
          source = 'mock-fallback-empty';
        }
      } else {
        // Otherwise use mock data
        console.warn('API credentials not configured. Using mock data for demonstration.');
        tweets = await tweetService.getTweets(filters);
        source = 'mock-unconfigured';
      }

      // If we got tweets from Twitter/XHire and Gemini is configured, add AI summaries
      if ((source === 'twitter' || source === 'xhire') && isGeminiConfigured && tweets.length > 0) {
        console.log(`Using Gemini API with owner's credentials for AI summaries (Source: ${source})`);
        return await geminiApi.processTweetsWithAI(tweets);
      }
      
      // Return tweets without summary if Gemini isn't configured or source was mock
      return tweets;
      
    } catch (error) {
      console.error('Error in job service getTweets:', error);
      console.warn('Falling back to mock data due to API error');
      
      // Fallback to mock data if API calls fail
      return tweetService.getTweets(filters);
    }
  },
  
  /**
   * Get a single tweet by ID
   * Uses the owner's Twitter API keys by default
   */
  getTweetById: async (id: string): Promise<Tweet | undefined> => {
    try {
      let tweet: Tweet | undefined;
      
      // If XHire API is configured, use it
      if (isXhireApiConfigured) {
        console.log('Using XHire API for tweet', id);
        tweet = await xhireApi.getTweetById(id);
      }
      // If Twitter API is configured, use it
      else if (isTwitterConfigured) {
        console.log('Using Twitter API with owner\'s credentials for tweet', id);
        tweet = await twitterApi.getTweetById(id);
        
        if (!tweet) {
          console.warn(`Tweet ${id} not found in Twitter API. Falling back to mock data.`);
          tweet = await tweetService.getTweetById(id);
        }
        
        // If tweet exists and Gemini API is configured, add AI summary
        if (tweet && isGeminiConfigured && !tweet.ai_summary) {
          console.log('Using Gemini API with owner\'s credentials for AI summary');
          const summary = await geminiApi.generateJobSummary(tweet);
          tweet = {
            ...tweet,
            ai_summary: summary
          };
        }
      } else {
        // Otherwise use mock data
        console.warn('API credentials not configured. Using mock data for demonstration.');
        tweet = await tweetService.getTweetById(id);
      }
      
      return tweet;
    } catch (error) {
      console.error('Error in job service getTweetById:', error);
      console.warn('Falling back to mock data due to API error');
      
      // Fallback to mock data if API calls fail
      return tweetService.getTweetById(id);
    }
  },
  
  /**
   * Check if Twitter API is configured and working
   */
  isTwitterConfigured: () => apiStatus.twitter,
  
  /**
   * Check if Gemini API is configured and working
   */
  isGeminiConfigured: () => apiStatus.gemini,
  
  /**
   * Check if XHire API is configured
   */
  isXhireApiConfigured: () => isXhireApiConfigured,
  
  /**
   * Check if using owner's API keys
   */
  isUsingOwnerKeys: () => useOwnerKeys,
  
  /**
   * Force refresh of API status
   */
  refreshApiStatus: async () => {
    await updateApiStatus();
    return apiStatus;
  }
}; 