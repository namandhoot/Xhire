import axios from 'axios';
import { Tweet, FilterOptions } from '../types';

// Get the custom API endpoint from environment variables
const API_ENDPOINT = import.meta.env.VITE_XHIRE_API_ENDPOINT;
const isConfigured = !!API_ENDPOINT;

// Create an axios instance for the custom API
const xhireApiClient = axios.create({
  baseURL: API_ENDPOINT,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const xhireApi = {
  /**
   * Check if the custom API is configured
   */
  isConfigured: () => isConfigured,

  /**
   * Get API status information
   */
  getApiStatus: async (): Promise<{ twitter: boolean, gemini: boolean }> => {
    if (!isConfigured) {
      return { twitter: false, gemini: false };
    }
    
    try {
      const response = await xhireApiClient.get('/status');
      return response.data;
    } catch (error) {
      console.error('Error checking API status:', error);
      return { twitter: false, gemini: false };
    }
  },
  
  /**
   * Get tweets from the custom API
   */
  getTweets: async (filters?: Partial<FilterOptions>): Promise<Tweet[]> => {
    if (!isConfigured) {
      throw new Error('Custom API endpoint is not configured. Please set VITE_XHIRE_API_ENDPOINT in your .env file.');
    }
    
    try {
      console.log('Fetching tweets from XHire API...');
      const response = await xhireApiClient.get('/tweets', { params: filters });
      return response.data;
    } catch (error) {
      console.error('Error fetching tweets from XHire API:', error);
      throw new Error('Failed to fetch tweets from the API. Please try again later.');
    }
  },
  
  /**
   * Get a single tweet by ID
   */
  getTweetById: async (id: string): Promise<Tweet | undefined> => {
    if (!isConfigured) {
      throw new Error('Custom API endpoint is not configured. Please set VITE_XHIRE_API_ENDPOINT in your .env file.');
    }
    
    try {
      console.log(`Fetching tweet ${id} from XHire API...`);
      const response = await xhireApiClient.get(`/tweets/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching tweet by ID:', error);
      return undefined;
    }
  }
}; 