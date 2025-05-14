import { useState, useEffect } from 'react';
import { FiTwitter, FiCode, FiAlertCircle, FiCheck, FiServer, FiActivity, FiInfo, FiCheckCircle, FiX } from 'react-icons/fi';
import { jobService } from '../services/jobService';
import { twitterApi } from '../services/twitterApi';
import RefreshButton from './RefreshButton';

const ApiStatusIndicator: React.FC = () => {
  const [key, setKey] = useState(0); // Used to force re-render on refresh
  const isTwitterConfigured = jobService.isTwitterConfigured();
  const isGeminiConfigured = jobService.isGeminiConfigured();
  const isXhireApiConfigured = jobService.isXhireApiConfigured();
  const isUsingOwnerKeys = jobService.isUsingOwnerKeys();
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{success: boolean, message: string} | null>(null);
  const [status, setStatus] = useState({
    twitter: false,
    gemini: false
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Handler for refresh button
  const handleRefresh = () => {
    setKey(prev => prev + 1); // Force re-render
  };
  
  // Handler for test API connection button
  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const success = await twitterApi.testConnection();
      
      if (success) {
        setTestResult({
          success: true,
          message: 'Twitter API connection successful! You should now see real-time data.'
        });
      } else {
        setTestResult({
          success: false,
          message: 'Twitter API connection failed. Check your API key and network connection.'
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Twitter API connection error: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsTesting(false);
    }
  };
  
  useEffect(() => {
    checkApiStatus();
  }, []);
  
  const checkApiStatus = async () => {
    setIsRefreshing(true);
    
    try {
      const apiStatus = await jobService.refreshApiStatus();
      setStatus(apiStatus);
    } catch (error) {
      console.error('Failed to check API status', error);
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // If using XHire API, we display different information
  if (isXhireApiConfigured) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-3 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-secondary">Data Source</h3>
          <RefreshButton onRefresh={handleRefresh} />
        </div>
        <div className="space-y-3">
          <div className="flex items-center">
            <FiServer className="mr-2 text-green-500" />
            <div className="flex-1">
              <div className="font-medium">XHire API</div>
              <div className="text-sm text-dark">
                Using data from XHire's centralized API service
              </div>
            </div>
            <FiCheck className="text-green-500" />
          </div>
          
          {/* Show specific API status when available */}
          <div className="flex items-center">
            <FiTwitter className={`mr-2 ${isTwitterConfigured ? 'text-green-500' : 'text-gray-400'}`} />
            <div className="flex-1">
              <div className="font-medium">Twitter Data</div>
              <div className="text-sm text-dark">
                {isTwitterConfigured 
                  ? 'Real-time Twitter data available' 
                  : 'Twitter data managed by XHire API'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center">
            <FiCode className={`mr-2 ${isGeminiConfigured ? 'text-green-500' : 'text-gray-400'}`} />
            <div className="flex-1">
              <div className="font-medium">AI Summaries</div>
              <div className="text-sm text-dark">
                {isGeminiConfigured 
                  ? 'AI-generated job summaries available' 
                  : 'Job summaries managed by XHire API'}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // If using owner's API keys
  if (isUsingOwnerKeys) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-3 mb-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="font-semibold text-secondary">Data Source</h3>
          <RefreshButton onRefresh={handleRefresh} />
        </div>
        <div className="space-y-3">
          <div className="flex items-center">
            <FiTwitter className={`mr-2 ${isTwitterConfigured ? 'text-green-500' : 'text-red-500'}`} />
            <div className="flex-1">
              <div className="font-medium">Twitter API</div>
              <div className="text-sm text-dark">
                {isTwitterConfigured 
                  ? 'Using XHire\'s Twitter API credentials' 
                  : 'Twitter API credentials not configured'}
              </div>
            </div>
            {isTwitterConfigured ? (
              <FiCheck className="text-green-500" />
            ) : (
              <FiAlertCircle className="text-red-500" />
            )}
          </div>
          
          <div className="flex items-center">
            <FiCode className={`mr-2 ${isGeminiConfigured ? 'text-green-500' : 'text-red-500'}`} />
            <div className="flex-1">
              <div className="font-medium">Gemini AI API</div>
              <div className="text-sm text-dark">
                {isGeminiConfigured 
                  ? 'Using XHire\'s Gemini API credentials' 
                  : 'Gemini API credentials not configured'}
              </div>
            </div>
            {isGeminiConfigured ? (
              <FiCheck className="text-green-500" />
            ) : (
              <FiAlertCircle className="text-red-500" />
            )}
          </div>
          
          <div className="pt-2">
            <button
              onClick={handleTestConnection}
              disabled={isTesting || !isTwitterConfigured}
              className={`flex items-center ${isTesting ? 'opacity-50 cursor-not-allowed' : ''} text-sm py-1 px-3 rounded bg-primary text-white hover:bg-blue-600 transition-colors`}
            >
              <FiActivity className={`mr-1 ${isTesting ? 'animate-spin' : ''}`} />
              {isTesting ? 'Testing Connection...' : 'Test Twitter API Connection'}
            </button>
            
            {testResult && (
              <div className={`mt-2 p-2 text-sm rounded ${testResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {testResult.message}
              </div>
            )}
          </div>
          
          <div className="text-xs text-gray-500 pt-2 border-t border-lighter">
            <strong>API Details:</strong> Make sure your Twitter API has Read access (v2) and required permissions.
            <br />
            <code>Twitter Bearer Token:</code> {TWITTER_API_KEY ? `${TWITTER_API_KEY.substring(0, 5)}...${TWITTER_API_KEY.substring(TWITTER_API_KEY.length - 5)}` : 'Not configured'}
          </div>
        </div>
      </div>
    );
  }
  
  // Original component for when user needs to provide API keys
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 relative">
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold text-dark flex items-center">
          <FiInfo className="mr-2" />
          API Status
        </h3>
        <button
          onClick={checkApiStatus}
          disabled={isRefreshing}
          className="text-blue-600 hover:text-blue-800 text-sm flex items-center"
        >
          {isRefreshing ? "Checking..." : "Refresh"}
        </button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {status.twitter 
              ? <FiCheckCircle className="text-green-500 mr-2" /> 
              : <FiAlertCircle className="text-orange-500 mr-2" />
            }
            <span className="text-dark">Twitter API</span>
          </div>
          <div className={`text-sm ${status.twitter ? 'text-green-600' : 'text-orange-600'}`}>
            {status.twitter ? 'Connected' : 'Not Connected'}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {status.gemini 
              ? <FiCheckCircle className="text-green-500 mr-2" /> 
              : <FiAlertCircle className="text-orange-500 mr-2" />
            }
            <span className="text-dark">Gemini API</span>
          </div>
          <div className={`text-sm ${status.gemini ? 'text-green-600' : 'text-orange-600'}`}>
            {status.gemini ? 'Connected' : 'Not Connected'}
          </div>
        </div>
        
        {(!status.twitter || !status.gemini) && (
          <div className="mt-3 text-xs text-dark">
            <span className="font-medium">Important:</span> For real-time data, ensure:
            <ol className="list-decimal pl-5 my-1 space-y-1">
              <li>Your API keys are set in the <code>.env</code> file</li>
              <li className="font-medium">The proxy server is running with: <code>node /Users/naman/Xhire/cors-proxy.js</code></li>
              <li>Refresh the page after starting the proxy</li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

// Extract the Twitter API key to display in the UI
const TWITTER_API_KEY = import.meta.env.VITE_TWITTER_BEARER_TOKEN || '';

export default ApiStatusIndicator; 