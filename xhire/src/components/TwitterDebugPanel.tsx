import { useState, useEffect } from 'react';
import { twitterApi } from '../services/twitterApi';
import { FiSearch, FiAlertTriangle, FiCheckCircle, FiCopy, FiInfo, FiServer } from 'react-icons/fi';
import axios from 'axios';

// We now use a local CORS proxy 
const USE_PROXY = true;
const PROXY_BASE_URL = 'http://localhost:8080'; // Default cors-anywhere proxy
const TWITTER_API_URL = 'https://api.twitter.com/2';

const TwitterDebugPanel: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('("hiring" OR "looking for" OR "job opening") -is:retweet lang:en');
  const [maxResults, setMaxResults] = useState(10);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [tokenDetails, setTokenDetails] = useState({ length: 0, start: '', end: '' });
  const [proxyStatus, setProxyStatus] = useState<'checking' | 'running' | 'not_running'>('checking');

  // Get token details on mount
  useEffect(() => {
    const token = import.meta.env.VITE_TWITTER_BEARER_TOKEN || '';
    if (token) {
      setTokenDetails({
        length: token.length,
        start: token.substring(0, 5),
        end: token.substring(token.length - 5)
      });
    }
    
    // Check if proxy is running
    checkProxyStatus();
  }, []);
  
  // Check if the proxy server is running
  const checkProxyStatus = async () => {
    try {
      await axios.get(`${PROXY_BASE_URL}/${TWITTER_API_URL}/tweets/search/recent?query=test&max_results=1`, {
        timeout: 2000 // 2 second timeout
      });
      setProxyStatus('running');
    } catch (error) {
      console.log('Proxy check error:', error);
      setProxyStatus('not_running');
    }
  };

  const handleSearch = async () => {
    setIsLoading(true);
    setSearchResults(null);
    setError(null);

    try {
      // Create a raw fetch request to test the API directly
      const TWITTER_API_KEY = import.meta.env.VITE_TWITTER_BEARER_TOKEN;
      
      if (!TWITTER_API_KEY) {
        throw new Error('Twitter API key not configured');
      }
      
      // Create URL with search params
      const params = new URLSearchParams({
        query: searchQuery,
        max_results: maxResults.toString(),
        'tweet.fields': 'created_at,entities,author_id',
        'user.fields': 'name,username,profile_image_url,verified',
        'expansions': 'author_id'
      });
      
      // Use proxy URL
      const url = `${PROXY_BASE_URL}/${TWITTER_API_URL}/tweets/search/recent?${params.toString()}`;
      
      console.log('Making API request through proxy:', url);
      console.log('Using Authorization header with Bearer token length:', TWITTER_API_KEY.length);
      
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${TWITTER_API_KEY}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });
      
      // Show complete response info for debugging
      console.log('Twitter API Response:', {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      });
      
      setSearchResults(response.data);
    } catch (err: any) {
      const errorMessage = err.response 
        ? `Error ${err.response.status}: ${err.response.statusText}\n${JSON.stringify(err.response.data, null, 2)}`
        : err.message;
      
      // Check for CORS errors specifically
      const isCorsError = 
        err.message?.includes('CORS') || 
        err.message?.includes('cross-origin') ||
        err.message?.includes('Cross-Origin');
      
      if (isCorsError) {
        setError(`CORS Error: ${err.message}\n\nPlease make sure the CORS proxy server is running:\n\n1. Open a new terminal\n2. Run: node /Users/naman/Xhire/cors-proxy.js\n3. Try again after the proxy is running`);
      } else if (proxyStatus === 'not_running') {
        setError(`Proxy server not running. Please start the CORS proxy server:\n\n1. Open a new terminal\n2. Run: node /Users/naman/Xhire/cors-proxy.js\n3. Try again after the proxy is running on port 8080`);
      } else {
        setError(errorMessage);
      }
      
      console.error('Twitter debug search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyCommand = () => {
    const command = `# Start the proxy server in a new terminal:\nnode /Users/naman/Xhire/cors-proxy.js\n\n# Then in another terminal, test the API:\ncurl -X GET "${PROXY_BASE_URL}/${TWITTER_API_URL}/tweets/search/recent?query=${encodeURIComponent(searchQuery)}&max_results=${maxResults}" -H "Authorization: Bearer YOUR_BEARER_TOKEN" -H "X-Requested-With: XMLHttpRequest"`;
    
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <h3 className="font-semibold mb-3 text-secondary">Twitter API Debug Tool</h3>
      <div className="space-y-3">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm mb-3">
          <div className="font-medium mb-1">Twitter Token Information</div>
          <div className="text-xs font-mono">
            <div>Token Length: {tokenDetails.length} characters</div>
            {tokenDetails.length > 0 && (
              <div>Format: {tokenDetails.start}...{tokenDetails.end}</div>
            )}
            <div className="mt-1">
              <span className="font-normal text-gray-500">Twitter API tokens typically start with "AAAA" and are ~100+ characters long.</span>
            </div>
          </div>
          
          <div className="mt-2 font-medium flex items-center">
            <FiServer className="mr-1" /> CORS Proxy Status
          </div>
          <div className={`text-xs ${
            proxyStatus === 'running' 
              ? 'text-green-600' 
              : proxyStatus === 'checking' 
                ? 'text-blue-600' 
                : 'text-red-600'
          }`}>
            {proxyStatus === 'running' && '✅ Proxy is running'}
            {proxyStatus === 'checking' && '⏳ Checking proxy status...'}
            {proxyStatus === 'not_running' && (
              <>
                ❌ Proxy not detected. Please run:
                <pre className="bg-gray-100 p-1 mt-1 whitespace-pre-wrap">
                  node /Users/naman/Xhire/cors-proxy.js
                </pre>
              </>
            )}
          </div>
          
          <div className="flex justify-between items-center mt-2">
            <button
              onClick={copyCommand}
              className="text-xs flex items-center text-blue-600 hover:text-blue-800"
            >
              <FiCopy className="mr-1" />
              {copied ? "Copied!" : "Copy commands for testing"}
            </button>
            <button 
              onClick={checkProxyStatus}
              className="text-xs flex items-center text-blue-600 hover:text-blue-800"
            >
              Recheck Proxy
            </button>
          </div>
        </div>
      
        <div className="flex flex-col">
          <label className="text-sm font-medium text-dark mb-1">Search Query</label>
          <textarea
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="p-2 border border-lighter rounded min-h-[60px]"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex flex-col flex-1">
            <label className="text-sm font-medium text-dark mb-1">Max Results</label>
            <input
              type="number"
              value={maxResults}
              onChange={(e) => setMaxResults(parseInt(e.target.value) || 10)}
              min={5}
              max={100}
              className="p-2 border border-lighter rounded"
            />
          </div>
          
          <button
            onClick={handleSearch}
            disabled={isLoading || proxyStatus !== 'running'}
            className={`flex items-center self-end h-10 px-4 rounded ${
              isLoading || proxyStatus !== 'running' 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-primary hover:bg-blue-600 cursor-pointer'
            } text-white transition-colors`}
          >
            <FiSearch className="mr-2" />
            {isLoading ? 'Searching...' : 'Test Search'}
          </button>
        </div>
        
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            <div className="flex items-center font-medium mb-1">
              <FiAlertTriangle className="mr-1" />
              Error
            </div>
            <pre className="whitespace-pre-wrap text-xs font-mono overflow-auto max-h-[200px]">
              {error}
            </pre>
          </div>
        )}
        
        {searchResults && (
          <div className="p-3 bg-gray-50 border border-gray-200 rounded text-sm">
            <div className="flex items-center font-medium mb-1 text-green-700">
              <FiCheckCircle className="mr-1" />
              Search Results
            </div>
            <div className="mb-2">
              Found {searchResults.data?.length || 0} tweets
            </div>
            <div className="overflow-auto max-h-[300px] p-2 bg-gray-100 rounded text-xs font-mono">
              {JSON.stringify(searchResults, null, 2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwitterDebugPanel; 