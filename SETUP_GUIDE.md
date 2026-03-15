# FieldTrip Club MVP - Supabase Backend Setup Guide

## Overview

FieldTrip Club is a fully functional platform for organizing and joining field trips. This MVP uses **Supabase** as the backend for authentication, database, and storage while maintaining compatibility with static hosting on Render.

## Architecture

- **Frontend**: Pure HTML, CSS, and JavaScript (static site)
- **Backend**: Supabase (PostgreSQL database, auth, storage)
- **Hosting**: Render (static site hosting)
- **Client Library**: Supabase JavaScript client (via CDN)

## Supabase Configuration

### Project Details
- **Project URL**: https://pfwswcbysfeprsbazjrn.supabase.co
- **Anon Public Key**: sb_publishable_mI5DzSsjUZ1enmDjgPwuAA_YSS4GrwB

### Database Tables Structure

The app uses the following Supabase tables:

1. **trips** - Stores trip information
   - `id`: UUID (primary key)
   - `title`: Text
   - `location`: Text
   - `date`: Date
   - `description`: Text
   - `capacity`: Integer
   - `created_by`: UUID (references auth.users)
   - `created_at`: Timestamp
   - `updated_at`: Timestamp

2. **trip_members** - Tracks users who joined trips
   - `id`: UUID (primary key)
   - `trip_id`: UUID (references trips)
   - `user_id`: UUID (references auth.users)
   - `joined_at`: Timestamp
   - Unique constraint on (trip_id, user_id)

3. **trip_comments** - Stores trip comments
   - `id`: UUID (primary key)
   - `trip_id`: UUID (references trips)
   - `user_id`: UUID (references auth.users)
   - `comment`: Text
   - `created_at`: Timestamp
   - `updated_at`: Timestamp

4. **user_profiles** - Stores user profile information
   - `id`: UUID (references auth.users)
   - `full_name`: Text
   - `bio`: Text
   - `photo_url`: Text
   - `created_at`: Timestamp
   - `updated_at`: Timestamp

### Initial Setup Instructions

#### 1. Create Supabase Tables

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Run the SQL in `supabase_setup.sql` to create all tables with proper constraints and Row Level Security (RLS) policies

#### 2. Enable Row Level Security (RLS)

The setup script automatically enables RLS on all tables. RLS policies ensure:
- Trips are viewable by everyone (public)
- Only trip creators can edit or delete their trips
- Users can only join/leave trips themselves
- Comments are viewable by all, but users can only edit their own
- User profiles are viewable by all, but users can only edit their own

#### 3. Set Up Email Verification (Optional but Recommended)

1. In Supabase Console → Authentication → Providers
2. Enable Email provider
3. Configure email templates for verification, password reset, etc.

## File Structure

```
fieldtrip-club/
├── index.html                 # Homepage with featured trips feed
├── register.html              # User registration page
├── login.html                 # User login page
├── dashboard.html             # User dashboard (create/manage trips)
├── trips.html                 # Browse all trips with search/filter
├── trip.html                  # Individual trip details page
├── profile.html               # User profile page
├── app.js                     # Supabase client & utility functions
├── script.js                  # Main application logic
├── style.css                  # All styling
├── supabase_setup.sql         # Database schema & RLS setup
└── README.md                  # This file
```

## Core Features

### 1. Authentication
- **Register**: Create new account as Excursor (participant) or Event Holder (organizer)
- **Login**: Sign in with email and password
- **Session Persistence**: Automatic session management with Supabase
- **Logout**: Clear session and redirect to home
- **Password Reset**: Email-based password recovery

### 2. Trip Management
- **Create Trips**: Event Holders can create new trips with:
  - Title, location, date, description, capacity
- **View Trips**: Browse all trips with real-time participant counts
- **Join Trips**: Users can join available trips
- **Leave Trips**: Users can leave trips they've joined
- **Delete Trips**: Trip creators can delete their trips
- **Search**: Search trips by title, location, or description
- **Filter**: Filter by date, location, and availability

### 3. Trip Details & Comments
- **Trip Details Page**: View full trip information with:
  - Trip description and schedule
  - List of trip members
  - Member count and availability
  - Comments section
- **Comments**: Users can view and post comments on trips
- **Share**: Share trips via link or WhatsApp

### 4. User Profiles
- **View Profile**: See user information and trip history
- **Profile Stats**: Display trips created and trips joined
- **Public Profiles**: View other users' profiles and their trip activity

### 5. Dashboard
- **Trip Management**: View and manage your created and joined trips
- **User Info**: Display current user information
- **Create Trips**: Quick form to create new trips

## API Functions (app.js)

### Authentication
```javascript
// Check authentication status
const user = await getCurrentUser();
const isAuth = await isAuthenticated();

// Require authentication on protected pages
const user = await requireAuth('login.html');
```

### Users & Profiles
```javascript
// Manage user profiles
await ensureUserProfile(userId, email);
const profile = await getUserProfile(userId);
await updateUserProfile(userId, updates);
```

### Trips CRUD
```javascript
// Get trips
const trips = await getAllTrips();
const userTrips = await getUserCreatedTrips(userId);
const joinedTrips = await getUserJoinedTrips(userId);
const trip = await getTripById(tripId);

// Search & filter
const results = await searchTrips(query);
const filtered = await filterTripsByDate(startDate, endDate);

// Create/update/delete
const newTrip = await createTrip(tripData);
await updateTrip(tripId, updates);
await deleteTrip(tripId);
```

### Trip Participation
```javascript
// Join/leave trips
await joinTrip(tripId);
await leaveTrip(tripId);

// Check membership
const joined = await hasUserJoinedTrip(tripId, userId);
const count = await getTripMemberCount(tripId);
const members = await getTripMembers(tripId);
```

### Comments
```javascript
// Get and post comments
const comments = await getTripComments(tripId);
await addTripComment(tripId, comment);
await deleteComment(commentId);
```

## Development & Testing

### Local Testing
1. Clone the repository
2. Open `index.html` in a browser
3. Create an account on register.html
4. Browse trips on trips.html
5. Create and manage trips in the dashboard
6. Test all features

### Browser Console Debugging
All Supabase operations log to the console by default. Open DevTools (F12) → Console to see:
- Authentication events
- Database queries
- Error messages
- User data

## Deployment to Render

### 1. Prepare Repository
1. Commit all changes to Git
2. Push to GitHub repository

### 2. Deploy on Render
1. Go to [render.com](https://render.com)
2. Connect your GitHub account
3. Create a new "Static Site" service
4. Select your repository
5. Set build command: (leave empty)
6. Set publish directory: `./` (root)
7. Deploy

### 3. Domain Configuration
1. After deployment, Render provides a default domain
2. Optionally connect a custom domain
3. All routes automatically 301 redirect to index.html for SPA support

## Environment Variables

No environment variables needed! The Supabase credentials are hardcoded in `app.js` as public keys (safe for frontend use).

If you want to keep credentials private, consider:
1. Using Supabase environment restrictions (IP whitelist)
2. Implementing a proxy backend later
3. Using Supabase JWT tokens for added security

## Security Considerations

### RLS Policies
All tables have RLS enabled to:
- Prevent direct database access
- Enforce user authorization
- Protect data privacy

### Rate Limiting
Consider implementing rate limiting on:
- Trip creation (prevent spam)
- Comments (prevent flooding)
- Authentication attempts (brute force prevention)

### CORS
Supabase automatically handles CORS for JavaScript clients from any domain.

## Performance Optimization

### Database Indexing
All key columns are indexed:
- `trips(created_by)`
- `trips(date)`
- `trip_members(user_id)`
- `trip_members(trip_id)`
- `trip_comments(trip_id)`

### Frontend Optimization
- CSS and JS are minified in production
- Images are lazy-loaded
- Infinite scroll can be added to trips feed

## Future Enhancements

### Planned Features
1. **Trip Photos**: Upload and display trip images
2. **Ratings & Reviews**: Rate trips and trip organizers
3. **Notifications**: Email/push notifications for trip updates
4. **Payments**: Stripe integration for paid trips
5. **Maps**: Google Maps/Mapbox integration for trip locations
6. **Recommendations**: AI-powered trip recommendations
7. **Groups**: Create groups and plan group trips
8. **Invitations**: Invite specific users to trips

### Backend Considerations
- These features require either:
  - Edge functions (Supabase) for backend logic
  - A separate Node.js/Python backend
  - Render's serverless functions

## Troubleshooting

### Common Issues

**Q: Users can't log in**
- Verify Supabase credentials in app.js
- Check SQL setup was run correctly
- Ensure user confirmed email (if email verification enabled)

**Q: Trips not showing**
- Check browser console for errors
- Verify RLS policies allow SELECT
- Ensure trip data exists in Supabase dashboard

**Q: Comments not saving**
- Check user is authenticated
- Verify trip_comments table exists
- Check console for database errors

**Q: Session not persisting**
- Verify Supabase session stored correctly
- Check browser localStorage is enabled
- Try clearing cache and cookies

### Debug Mode
Add to `app.js` to enable verbose logging:
```javascript
supabase.on('*', (event, session) => {
  console.log('Supabase event:', event, session);
});
```

## Support & Resources

- **Supabase Docs**: https://supabase.com/docs
- **JavaScript Client**: https://supabase.com/docs/reference/javascript
- **Render Docs**: https://render.com/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

## License

This project is open source. Feel free to modify and deploy!

## Contact & Feedback

For issues, questions, or feature requests, please:
1. Check troubleshooting section above
2. Review browser console for errors
3. Check Supabase dashboard for database issues
4. Open an issue on GitHub

---

**Last Updated**: March 15, 2026
**Version**: 1.0.0 (MVP)
