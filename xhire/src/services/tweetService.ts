import { Tweet, FilterOptions } from '../types';

// Create sample mock tweets for testing
const mockTweets: Tweet[] = [
  {
    id: '1',
    text: "We're hiring a Frontend Engineer at TechStartup! Looking for someone with React, TypeScript, and CSS skills. Remote position with competitive salary. DM for details.",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
    user: {
      id: '100',
      name: 'Tech Startup Recruiter',
      username: 'techstartup',
      profile_image_url: 'https://via.placeholder.com/48',
      verified: true
    },
    ai_summary: {
      role: 'Frontend Engineer',
      company: 'TechStartup',
      location: 'Remote',
      how_to_apply: 'DM for details',
      salary: 'Competitive'
    },
    tweet_url: 'https://twitter.com/techstartup/status/1'
  },
  {
    id: '2',
    text: "We're expanding our product team @BigCorp! Hiring a Product Manager with 3+ years experience in SaaS. Based in SF but open to remote for the right candidate. Apply at jobs.bigcorp.com",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
    user: {
      id: '101',
      name: 'BigCorp Careers',
      username: 'bigcorp_jobs',
      profile_image_url: 'https://via.placeholder.com/48',
      verified: true
    },
    ai_summary: {
      role: 'Product Manager',
      company: 'BigCorp',
      location: 'San Francisco (Remote possible)',
      how_to_apply: 'Apply at jobs.bigcorp.com',
      salary: 'Not specified'
    },
    tweet_url: 'https://twitter.com/bigcorp_jobs/status/2'
  },
  {
    id: '3',
    text: "Exciting internship opportunity for CS students! Our AI team is looking for summer interns with Python experience. Paid position. Apply by May 1st. #hiring #internship",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    user: {
      id: '102',
      name: 'AI Research Lab',
      username: 'airesearch',
      profile_image_url: 'https://via.placeholder.com/48',
      verified: false
    },
    ai_summary: {
      role: 'AI Intern',
      company: 'AI Research Lab',
      location: 'Not specified',
      how_to_apply: 'Not specified in tweet',
      salary: 'Paid'
    },
    tweet_url: 'https://twitter.com/airesearch/status/3'
  },
  {
    id: '4',
    text: "Freelance opportunity: Looking for a graphic designer for a 3-month project. Experience with brand identity and packaging design required. Remote work, competitive rates. Email portfolio to jobs@designagency.com",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    user: {
      id: '103',
      name: 'Design Agency',
      username: 'designagency',
      profile_image_url: 'https://via.placeholder.com/48',
      verified: false
    },
    ai_summary: {
      role: 'Freelance Graphic Designer',
      company: 'Design Agency',
      location: 'Remote',
      how_to_apply: 'Email portfolio to jobs@designagency.com',
      salary: 'Competitive rates'
    },
    tweet_url: 'https://twitter.com/designagency/status/4'
  },
  {
    id: '5',
    text: "HIRING: Senior Backend Developer with experience in Node.js and PostgreSQL. Full-time position with benefits and flexible work arrangements. Apply here: example.com/careers #jobs #hiring #nodejs",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 24 hours ago
    user: {
      id: '104',
      name: 'Web Solutions Inc',
      username: 'websolutions',
      profile_image_url: 'https://via.placeholder.com/48',
      verified: true
    },
    ai_summary: {
      role: 'Senior Backend Developer',
      company: 'Web Solutions Inc',
      location: 'Flexible',
      how_to_apply: 'Apply at example.com/careers',
      salary: 'Not specified (includes benefits)'
    },
    tweet_url: 'https://twitter.com/websolutions/status/5'
  },
  {
    id: '6',
    text: "Remote position: Content Writer needed for our marketing team. Must have experience in SaaS industry. Full-time with health benefits and 401k. DM for details or apply at jobs.saascompany.com",
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(), // 30 hours ago
    user: {
      id: '105',
      name: 'SaaS Company',
      username: 'saascompany',
      profile_image_url: 'https://via.placeholder.com/48',
      verified: false
    },
    ai_summary: {
      role: 'Content Writer',
      company: 'SaaS Company',
      location: 'Remote',
      how_to_apply: 'DM or apply at jobs.saascompany.com',
      salary: 'Not specified (includes benefits)'
    },
    tweet_url: 'https://twitter.com/saascompany/status/6'
  }
];

export const tweetService = {
  /**
   * Get mock tweets with optional filtering
   */
  getTweets: async (filters?: Partial<FilterOptions>): Promise<Tweet[]> => {
    // Log mock service usage
    console.log('Using mock tweet service (API not available)');
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500 + 500));
    
    let results = [...mockTweets];
    
    // Apply filters
    if (filters) {
      // Custom search term - direct search override
      const customSearchFilters = filters as any;
      if (customSearchFilters.customSearch) {
        const searchTerm = customSearchFilters.customSearch.toLowerCase();
        console.log('Filtering mock tweets by custom search term:', searchTerm);
        
        results = results.filter(tweet => {
          const text = tweet.text.toLowerCase();
          const userName = tweet.user.name.toLowerCase();
          return text.includes(searchTerm) || 
                 userName.includes(searchTerm) ||
                 (tweet.ai_summary?.role?.toLowerCase().includes(searchTerm) || false);
        });
      }
      
      // Filter by job type
      if (filters.jobType && filters.jobType.length > 0) {
        const jobTypes = filters.jobType; // Store in a local variable to satisfy TypeScript
        results = results.filter(tweet => {
          const text = tweet.text.toLowerCase();
          return jobTypes.some(type => {
            if (type === 'Remote') return text.includes('remote');
            if (type === 'Internship') return text.includes('intern');
            if (type === 'Freelance') return text.includes('freelance') || text.includes('contract');
            if (type === 'Full-time') return text.includes('full-time') || text.includes('full time');
            return false;
          });
        });
      }
      
      // Filter by roles
      if (filters.roles && filters.roles.length > 0) {
        const roles = filters.roles; // Store in a local variable to satisfy TypeScript
        results = results.filter(tweet => {
          const text = tweet.text.toLowerCase();
          return roles.some(role => 
            text.includes(role.toLowerCase()) || 
            (tweet.ai_summary?.role?.toLowerCase().includes(role.toLowerCase()) || false)
          );
        });
      }
      
      // Filter by date range
      if (filters.dateRange) {
        const now = new Date();
        let cutoffDate = new Date();
        
        if (filters.dateRange === '24h') {
          cutoffDate.setHours(now.getHours() - 24);
        } else if (filters.dateRange === '7d') {
          cutoffDate.setDate(now.getDate() - 7);
        } else if (filters.dateRange === '30d') {
          cutoffDate.setDate(now.getDate() - 30);
        }
        
        results = results.filter(tweet => {
          const tweetDate = new Date(tweet.created_at);
          return tweetDate >= cutoffDate;
        });
      }
      
      // Filter verified accounts
      if (filters.verifiedOnly) {
        results = results.filter(tweet => tweet.user.verified);
      }
    }
    
    // Sort by most recent first
    results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    console.log(`Mock service returning ${results.length} tweets (after filtering)`);
    return results;
  },
  
  /**
   * Get a single tweet by ID
   */
  getTweetById: async (id: string): Promise<Tweet | undefined> => {
    // Log mock service usage
    console.log(`Using mock tweet service to fetch tweet ${id}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
    
    const tweet = mockTweets.find(t => t.id === id);
    
    if (!tweet) {
      console.warn(`Tweet ${id} not found in mock data`);
      return undefined;
    }
    
    return tweet;
  }
}; 