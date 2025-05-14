// Job-related tweet from Twitter API
export interface Tweet {
  id: string;
  text: string;
  created_at: string;
  user: {
    id: string;
    name: string;
    username: string;
    profile_image_url: string;
    verified: boolean;
  };
  entities?: any;
  tweet_url: string;
  ai_summary?: {
    role?: string;
    company?: string;
    location?: string;
    how_to_apply?: string;
    salary?: string;
  };
}

// Filter options for job search
export interface FilterOptions {
  jobType: string[];
  roles: string[];
  dateRange: '24h' | '7d' | '30d';
  verifiedOnly: boolean;
  directQuery?: string; // Direct search query for Twitter API
  customSearch?: string; // Custom search term for mock data
}

// Plan types for pricing
export type PlanType = 'free' | 'basic' | 'pro';

// Pricing plan details
export interface PricingPlan {
  type: PlanType;
  name: string;
  price: string;
  features: string[];
  cta: string;
  popular?: boolean;
} 