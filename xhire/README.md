# XHire - Job Hunt, Reimagined via X (Twitter)

XHire is a web platform that helps users discover real-time job opportunities posted on Twitter (X) using advanced search logic and curated filtering. It bridges the gap between recruiters/startups posting directly on Twitter and job seekers who miss out on these opportunities.

## Features

- **Job Feed via Twitter API**: View tweets with job opportunities in chronological order
- **Advanced Filters**: Filter by job type, roles, date range, and verified accounts
- **Tweet Summary**: AI-generated summaries of job tweets with key information
- **Bookmarking**: Save interesting job tweets to revisit later
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS
- **API Integration**: 
  - Twitter API v2 for tweet data
  - Google Gemini API for AI summaries
- **State Management**: React Hooks and Context API
- **Routing**: React Router
- **UI Components**: Custom components with TailwindCSS
- **Icons**: React Icons

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/xhire.git
   cd xhire
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Configure API Keys (if you're the application owner):
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit the `.env` file with your Twitter and Gemini API keys:
     ```
     VITE_TWITTER_BEARER_TOKEN=your_twitter_bearer_token_here
     VITE_GEMINI_API_KEY=your_gemini_api_key_here
     VITE_USE_OWNER_KEYS=true
     ```
   - If API keys are not provided, the application will use mock data

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## API Configuration

The application is designed to use the owner's API keys to search for job tweets. This means:

1. **No User Configuration Required**: End users don't need to provide their own API keys
2. **Owner Keys Used**: The API keys set by the application owner will be used for all searches
3. **Mock Data Fallback**: If owner keys are not set or API calls fail, the app will use mock data
4. **Centralized Management**: Only the application owner needs to handle API credentials

### Twitter API (X)
To configure as the application owner:
1. Apply for a Twitter Developer account: https://developer.twitter.com/
2. Create a project and get a Bearer Token
3. Add the token to your `.env` file with `VITE_TWITTER_BEARER_TOKEN`

### Google Gemini API
To configure as the application owner:
1. Get a Gemini API key: https://ai.google.dev/
2. Add the key to your `.env` file with `VITE_GEMINI_API_KEY`

## Project Structure

- `/src`: Source code
  - `/components`: Reusable UI components
  - `/pages`: Application pages
  - `/services`: API services and data fetching
    - `tweetService.ts`: Mock data service
    - `twitterApi.ts`: Twitter API integration
    - `geminiApi.ts`: Gemini API integration
    - `xhireApi.ts`: XHire's centralized API service
    - `jobService.ts`: Unified service that combines APIs with fallbacks
  - `/types`: TypeScript interfaces and types
  - `/hooks`: Custom React hooks
  - `/assets`: Static assets (images, icons, etc.)

## Future Enhancements

- **Job Alerts**: Daily or weekly email alerts based on user preferences
- **Skill-based Feed**: Personalized job feed based on user's skills
- **Chrome Extension**: Highlight jobs directly on Twitter
- **Resume Analyzer**: Match jobs with user's resume score
- **AI-Powered Apply Assistant**: Auto-generate job application responses

## License

This project is licensed under the MIT License - see the LICENSE file for details.
