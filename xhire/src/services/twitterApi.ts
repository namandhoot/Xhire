import axios from 'axios';
import { Tweet, FilterOptions } from '../types';

// Check if Twitter API key is configured
const TWITTER_API_KEY = import.meta.env.VITE_TWITTER_BEARER_TOKEN;
const isConfigured = !!TWITTER_API_KEY && TWITTER_API_KEY.length > 20; // Basic validation

// Use a local CORS proxy to avoid CORS issues
const USE_PROXY = true; // Always use proxy to avoid CORS issues
const PROXY_BASE_URL = 'http://localhost:8080/'; // Default cors-anywhere proxy
const TWITTER_API_URL = 'https://api.twitter.com/2';

// Full proxy URL with target
const PROXY_URL = `${PROXY_BASE_URL}${TWITTER_API_URL}`;

// Log API configuration status
console.log('Twitter API configuration status:', isConfigured ? 'Configured' : 'Not configured');
if (isConfigured) {
  console.log('Twitter API key length:', TWITTER_API_KEY.length);
  console.log('Twitter API key format:', 
    TWITTER_API_KEY.substring(0, 5) + '...' + 
    TWITTER_API_KEY.substring(TWITTER_API_KEY.length - 5)
  );
  console.log('Using proxy:', USE_PROXY ? PROXY_URL : 'No');
}

// Create an axios instance for Twitter API requests
const twitterApiClient = axios.create({
  baseURL: USE_PROXY ? PROXY_URL : TWITTER_API_URL,
  headers: {
    'Authorization': `Bearer ${TWITTER_API_KEY}`,
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest' // Required for some CORS proxies
  }
});

// Add request and response interceptors for debugging
twitterApiClient.interceptors.request.use(
  config => {
    console.log('Twitter API Request:', {
      method: config.method,
      url: config.url,
      params: config.params,
      headers: {
        ...config.headers,
        // Redact the actual token value for security
        Authorization: config.headers?.Authorization 
          ? `Bearer ${config.headers.Authorization.toString().substring(7, 12)}...` 
          : undefined
      }
    });
    return config;
  },
  error => {
    console.error('Twitter API Request Error:', error);
    return Promise.reject(error);
  }
);

twitterApiClient.interceptors.response.use(
  response => {
    console.log('Twitter API Response Status:', response.status);
    return response;
  },
  error => {
    // Provide detailed error information
    const errorDetails = {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    };
    
    // Check for CORS errors
    if (error.message?.includes('CORS') || error.message?.includes('cross-origin')) {
      console.error('CORS Error Detected - Make sure the proxy server is running:', errorDetails);
      console.error('Try starting the proxy with: node /Users/naman/Xhire/cors-proxy.js');
    } else {
      console.error('Twitter API Response Error:', errorDetails);
    }
    
    return Promise.reject(error);
  }
);

// Twitter API response interfaces
interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
  verified: boolean;
}

interface TwitterTweet {
  id: string;
  text: string;
  created_at: string;
  author_id: string;
  entities?: any;
}

export const twitterApi = {
  /**
   * Check if Twitter API is configured
   */
  isConfigured: () => isConfigured,

  /**
   * Get direct Twitter URL for a tweet
   */
  getTweetUrl: (username: string, tweetId: string): string => {
    return `https://twitter.com/${username}/status/${tweetId}`;
  },
  
  /**
   * Search for tweets using advanced query
   * @param filters Optional filter options to refine search
   * @returns Array of tweets matching the search criteria
   */
  searchTweets: async (filters?: Partial<FilterOptions>): Promise<Tweet[]> => {
    if (!isConfigured) {
      console.warn('Twitter API is not configured. Please set VITE_TWITTER_BEARER_TOKEN in your .env file.');
      throw new Error('Twitter API is not configured. Please set VITE_TWITTER_BEARER_TOKEN in your .env file.');
    }
    
    try {
      console.log('Fetching real-time tweets from Twitter API with filters:', filters);
      
      // Build the search query based on filters
      let query = '("hiring" OR "looking for" OR "job opening") -is:retweet lang:en';
      
      // Use direct query if provided (for immediate search)
      // Cast to any to avoid TypeScript errors
      const filtersAny = filters as any;
      if (filtersAny?.directQuery) {
        console.log('Using direct query:', filtersAny.directQuery);
        query = filtersAny.directQuery;
      } else {
        // Otherwise build query from filter options
        
        // Add job type filters
        if (filters?.jobType && filters.jobType.length > 0) {
          const jobTypeTerms = filters.jobType.map(type => {
            if (type === 'Remote') return 'remote';
            if (type === 'Internship') return '(intern OR internship)';
            if (type === 'Freelance') return '(freelance OR contract)';
            if (type === 'Full-time') return '("full-time" OR "full time" OR permanent)';
            return '';
          }).filter(Boolean);
          
          if (jobTypeTerms.length > 0) {
            query += ` (${jobTypeTerms.join(' OR ')})`;
          }
        }
        
        // Add role filters
        if (filters?.roles && filters.roles.length > 0) {
          const roleTerms = filters.roles.map(role => {
            // Convert role names to appropriate search terms
            return `"${role.toLowerCase()}"`;
          });
          
          if (roleTerms.length > 0) {
            query += ` (${roleTerms.join(' OR ')})`;
          }
        }
      }
      
      // Handle date range
      let startTime = undefined;
      if (filters?.dateRange) {
        const now = new Date();
        if (filters.dateRange === '24h') {
          const date = new Date(now);
          date.setHours(now.getHours() - 24);
          startTime = date.toISOString();
        } else if (filters.dateRange === '7d') {
          const date = new Date(now);
          date.setDate(now.getDate() - 7);
          startTime = date.toISOString();
        } else if (filters.dateRange === '30d') {
          const date = new Date(now);
          date.setDate(now.getDate() - 30);
          startTime = date.toISOString();
        }
      }
      
      // Make the API request
      const params: any = {
        query,
        max_results: 25, // Reduced from 100 to improve response time
        'tweet.fields': 'created_at,entities,author_id,public_metrics',
        'user.fields': 'name,username,profile_image_url,verified',
        expansions: 'author_id'
      };
      
      // Add start_time if date range filter is applied
      if (startTime) {
        params.start_time = startTime;
      }
      
      console.log('Twitter API Query:', query);
      
      // Make the direct API request
      const response = await twitterApiClient.get('/tweets/search/recent', { params });
      
      // Log the response data structure for debugging
      console.log('Twitter API Response Structure:', {
        hasData: !!response.data.data,
        dataLength: response.data.data ? response.data.data.length : 0,
        hasIncludes: !!response.data.includes,
        hasUsers: response.data.includes ? !!response.data.includes.users : false
      });
      
      // Check if we have valid data
      if (!response.data.data || !Array.isArray(response.data.data) || response.data.data.length === 0) {
        console.warn('Twitter API returned no tweets:', response.data);
        return [];
      }
      
      // Process the Twitter API response into our Tweet format
      const tweets = response.data.data.map((tweet: TwitterTweet) => {
        // Find the user info from the includes
        const user = response.data.includes.users.find((u: TwitterUser) => u.id === tweet.author_id);
        
        if (!user) {
          console.warn(`User not found for tweet ${tweet.id}`);
          return null;
        }
        
        // Get direct URL to tweet
        const tweetUrl = twitterApi.getTweetUrl(user.username, tweet.id);
        
        return {
          id: tweet.id,
          text: tweet.text,
          created_at: tweet.created_at,
          user: {
            id: user.id,
            name: user.name,
            username: user.username,
            profile_image_url: user.profile_image_url,
            verified: user.verified || false
          },
          entities: tweet.entities,
          tweet_url: tweetUrl,
          ai_summary: undefined // Set to undefined initially
        };
      }).filter(Boolean) as Tweet[]; // Filter out null tweets (where user wasn't found)
      
      console.log(`Successfully processed ${tweets.length} tweets from Twitter API`);
      
      // Filter verified accounts if required
      if (filters?.verifiedOnly) {
        return tweets.filter((tweet: Tweet) => tweet.user.verified);
      }
      
      return tweets;
      
    } catch (error: any) {
      console.error('Error fetching tweets from Twitter API:', error);
      
      // Check for CORS errors 
      if (error.message?.includes('CORS') || error.message?.includes('cross-origin')) {
        console.error('CORS ERROR: You need to install a browser extension to handle CORS. See the debug panel for instructions.');
      }
      
      console.error('Error details:', {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        } : 'No response'
      });
      throw new Error(`Failed to fetch tweets from Twitter API: ${error.message}`);
    }
  },
  
  /**
   * Get a single tweet by ID
   * @param id Tweet ID
   * @returns Tweet object or undefined if not found
   */
  getTweetById: async (id: string): Promise<Tweet | undefined> => {
    if (!isConfigured) {
      console.warn('Twitter API is not configured. Please set VITE_TWITTER_BEARER_TOKEN in your .env file.');
      throw new Error('Twitter API is not configured. Please set VITE_TWITTER_BEARER_TOKEN in your .env file.');
    }
    
    try {
      console.log(`Fetching tweet ${id} from Twitter API...`);
      
      // Make the API request
      const response = await twitterApiClient.get(`/tweets/${id}`, {
        params: {
          'tweet.fields': 'created_at,entities',
          'user.fields': 'name,username,profile_image_url,verified',
          'expansions': 'author_id'
        }
      });
      
      // Log the response for debugging
      console.log('Tweet by ID response structure:', {
        hasData: !!response.data.data,
        hasIncludes: !!response.data.includes,
        hasUsers: response.data.includes ? !!response.data.includes.users : false
      });
      
      // Extract the tweet and user data
      const tweetData = response.data.data as TwitterTweet;
      const userData = response.data.includes.users[0] as TwitterUser;
      
      if (!tweetData || !userData) {
        console.warn(`Tweet ${id} or its user not found`);
        return undefined;
      }
      
      // Get direct URL to tweet
      const tweetUrl = twitterApi.getTweetUrl(userData.username, tweetData.id);
      
      return {
        id: tweetData.id,
        text: tweetData.text,
        created_at: tweetData.created_at,
        user: {
          id: userData.id,
          name: userData.name,
          username: userData.username,
          profile_image_url: userData.profile_image_url,
          verified: userData.verified || false
        },
        entities: tweetData.entities,
        tweet_url: tweetUrl,
        ai_summary: undefined // Set to undefined initially
      };
      
    } catch (error: any) {
      console.error('Error fetching tweet by ID:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        } : 'No response'
      });
      return undefined;
    }
  },
  
  /**
   * Test the Twitter API connection
   * @returns True if API is working, false otherwise
   */
  testConnection: async (): Promise<boolean> => {
    if (!isConfigured) {
      console.warn('Twitter API is not configured. Please set VITE_TWITTER_BEARER_TOKEN in your .env file.');
      return false;
    }
    
    try {
      console.log('Testing Twitter API connection...');
      
      // Make a simple test request
      const response = await twitterApiClient.get('/tweets/search/recent', {
        params: {
          query: 'twitter',
          max_results: '10'
        }
      });
      
      console.log('Twitter API test successful:', {
        status: response.status,
        hasData: !!response.data,
        tweetCount: response.data.data?.length || 0
      });
      
      return true;
    } catch (error: any) {
      console.error('Twitter API test failed:', error);
      
      // Check for CORS errors
      if (error.message?.includes('CORS') || error.message?.includes('cross-origin')) {
        console.error('CORS ERROR: You need to install a browser extension to handle CORS. See the debug panel for instructions.');
      }
      
      console.error('Error details:', {
        message: error.message,
        response: error.response ? {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        } : 'No response'
      });
      return false;
    }
  }
}; 