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
  entities?: {
    urls?: Array<{
      url: string;
      expanded_url: string;
      display_url: string;
    }>;
    hashtags?: Array<{
      tag: string;
    }>;
  };
  ai_summary?: {
    role?: string;
    company?: string;
    location?: string;
    how_to_apply?: string;
    salary?: string;
  };
  tweet_url?: string; // Direct URL to the tweet on Twitter
}

export interface FilterOptions {
  jobType: string[];
  roles: string[];
  dateRange: string;
  verifiedOnly: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  bookmarks: string[];
  skills: string[];
  isPro: boolean;
}

export type JobAlertFrequency = 'daily' | 'weekly' | 'never'; 