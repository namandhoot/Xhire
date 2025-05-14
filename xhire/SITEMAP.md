# XHire Application Sitemap

## Pages

### Home Page (/)
- Hero section with application introduction
- Search bar for job filtering
- Advanced filters panel
  - Job Type (Full-time, Internship, Freelance, Remote)
  - Role categories
  - Date range filter
  - Verified accounts toggle
- Job feed with real-time Twitter job postings
- Pro plan upsell banner for non-subscribers

### Bookmarks Page (/bookmarks)
- List of saved job tweets
- Empty state when no bookmarks available
- Pro plan upsell banner

### Pricing Page (/pricing)
- Comparison of subscription plans
  - Free plan
  - Pro plan
  - Team plan
- Features list for each plan
- FAQ section about pricing and features

## Components

### Layout
- Header with navigation menu
- Main content area
- Footer with site links

### Header
- Logo and brand name
- Navigation links
  - Home
  - Bookmarks (for logged-in users)
  - Pricing (for non-subscribers)
- User account menu (for logged-in users)
- Sign In / Register buttons (for non-logged in users)

### Footer
- Logo and tagline
- Quick links section
- Resources section
- Connect section with social media links
- Copyright information

### Job Card
- Tweet author information with verification badge
- Job content with keyword highlighting
- AI-generated job summary
- "View on Twitter" link
- Bookmark/save toggle

### Filters
- Job type checkboxes
- Role selection interface
- Date range selector
- Verified accounts toggle
- Filter tags display for active filters

### Empty State
- Used when no jobs match filters or no bookmarks exist
- Customizable illustration, message, and action button

### Loading Spinner
- Visual indicator for loading states

## Data Flow

1. User visits the homepage
2. Application loads mock tweet data (or real Twitter API data in production)
3. User can filter jobs using search bar and advanced filters
4. Filtered job results are displayed in the feed
5. User can bookmark jobs (stored in localStorage)
6. Bookmarked jobs can be viewed on the Bookmarks page
7. User can remove bookmarks from both the main feed and Bookmarks page

## Future Pages (Planned)

### Login/Register Page (/login, /register)
- Sign in form
- Registration form
- OAuth options (Twitter, Google)

### Profile Page (/profile)
- User information management
- Skills selection for personalized job feed
- Subscription management

### Job Alerts Page (/alerts)
- Email notification preferences
- Frequency settings (daily, weekly)
- Alert criteria management 