import axios from 'axios';
import { Tweet } from '../types';

// Create an axios instance for Gemini API requests
const geminiApiClient = axios.create({
  baseURL: 'https://generativelanguage.googleapis.com/v1',
  params: {
    key: import.meta.env.VITE_GEMINI_API_KEY
  }
});

export const geminiApi = {
  /**
   * Generate a summary of a job tweet using Gemini
   * @param tweet The tweet to summarize
   * @returns The AI-generated summary of the job tweet
   */
  generateJobSummary: async (tweet: Tweet): Promise<Tweet['ai_summary']> => {
    try {
      // Format the request for Gemini API
      const promptText = `
        Please analyze this job posting tweet and extract the following information:
        1. Job Role/Position
        2. Company Name
        3. Location (Remote/Hybrid/On-site, and city/country if mentioned)
        4. How to Apply (e.g., DM, email, link, etc.)
        5. Salary (if mentioned)

        Tweet: "${tweet.text}"
        
        Format the response as a JSON object with these fields:
        {
          "role": "extracted job role",
          "company": "extracted company name",
          "location": "extracted location",
          "how_to_apply": "extracted application method",
          "salary": "extracted salary information or 'Not specified'"
        }
        
        If any information is not available, use "Not specified" as the value.
      `;

      const payload = {
        contents: [
          {
            parts: [
              {
                text: promptText
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
          responseMimeType: "application/json"
        }
      };

      const response = await geminiApiClient.post('/models/gemini-1.5-pro:generateContent', payload);
      
      // Extract the JSON response from Gemini
      const generatedText = response.data.candidates[0].content.parts[0].text;
      
      // Find the JSON object in the response
      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        // Parse the JSON output
        try {
          const summaryObj = JSON.parse(jsonMatch[0]);
          return {
            role: summaryObj.role,
            company: summaryObj.company,
            location: summaryObj.location,
            how_to_apply: summaryObj.how_to_apply,
            salary: summaryObj.salary
          };
        } catch (parseError) {
          console.error('Error parsing Gemini JSON response:', parseError);
          return createDefaultSummary();
        }
      } else {
        console.error('No valid JSON found in Gemini response');
        return createDefaultSummary();
      }
      
    } catch (error) {
      console.error('Error generating job summary with Gemini:', error);
      return createDefaultSummary();
    }
  },
  
  /**
   * Process multiple tweets to add AI summaries
   * @param tweets Array of tweets to process
   * @returns Tweets with AI summaries added
   */
  processTweetsWithAI: async (tweets: Tweet[]): Promise<Tweet[]> => {
    try {
      // In production, you might want to batch these requests or
      // implement rate limiting to avoid API quota issues
      const processedTweets = await Promise.all(
        tweets.map(async (tweet) => {
          // Check if tweet already has a summary
          if (tweet.ai_summary) {
            return tweet;
          }
          
          // Generate summary
          const summary = await geminiApi.generateJobSummary(tweet);
          
          // Return tweet with summary
          return {
            ...tweet,
            ai_summary: summary
          };
        })
      );
      
      return processedTweets;
    } catch (error) {
      console.error('Error processing tweets with AI:', error);
      return tweets; // Return original tweets if processing fails
    }
  }
};

// Helper function to create a default summary when API fails
function createDefaultSummary(): Tweet['ai_summary'] {
  return {
    role: 'Not specified',
    company: 'Not specified',
    location: 'Not specified',
    how_to_apply: 'Not specified',
    salary: 'Not specified'
  };
} 