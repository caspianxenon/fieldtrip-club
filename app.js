// ============================================
// FieldTrip Club - Supabase Configuration & Utilities
// ============================================

const SUPABASE_URL = "https://pfwswcbysfeprsbazjrn.supabase.co";
const SUPABASE_KEY = "sb_publishable_mI5DzSsjUZ1enmDjgPwuAA_YSS4GrwB";

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================
// AUTHENTICATION UTILITIES
// ============================================

// Check if user is authenticated
async function isAuthenticated() {
  const { data: { user } } = await supabase.auth.getUser();
  return user !== null;
}

// Get current user
async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// Get current user session
async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// Check authentication and redirect if not logged in
async function requireAuth(redirectTo = 'login.html') {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = redirectTo;
    return false;
  }
  return user;
}

// ============================================
// USER PROFILE UTILITIES
// ============================================

// Create or get user profile
async function ensureUserProfile(userId, email) {
  try {
    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!existingProfile) {
      // Create new profile
      await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          full_name: email.split('@')[0],
        });
    }
    return true;
  } catch (error) {
    console.error('Error ensuring user profile:', error);
    return false;
  }
}

// Get user profile
async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

// Update user profile
async function updateUserProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    return null;
  }
}

// ============================================
// TRIP UTILITIES
// ============================================

// Get all trips
async function getAllTrips(limit = 100, offset = 0) {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*, created_by(*)')
      .order('date', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching trips:', error);
    return [];
  }
}

// Get trip by ID with details
async function getTripById(tripId) {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching trip:', error);
    return null;
  }
}

// Get trips created by user
async function getUserCreatedTrips(userId) {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('created_by', userId)
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user trips:', error);
    return [];
  }
}

// Get trips joined by user
async function getUserJoinedTrips(userId) {
  try {
    const { data, error } = await supabase
      .from('trip_members')
      .select('trip_id, trips(*)')
      .eq('user_id', userId);

    if (error) throw error;
    return data?.map(m => m.trips) || [];
  } catch (error) {
    console.error('Error fetching joined trips:', error);
    return [];
  }
}

// Create trip
async function createTrip(tripData) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('trips')
      .insert({
        title: tripData.title,
        location: tripData.location,
        date: tripData.date,
        description: tripData.description,
        capacity: tripData.capacity,
        created_by: user.id,
      })
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error creating trip:', error);
    throw error;
  }
}

// Update trip
async function updateTrip(tripId, updates) {
  try {
    const { data, error } = await supabase
      .from('trips')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', tripId)
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error updating trip:', error);
    throw error;
  }
}

// Delete trip
async function deleteTrip(tripId) {
  try {
    const { error } = await supabase
      .from('trips')
      .delete()
      .eq('id', tripId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting trip:', error);
    throw error;
  }
}

// Search trips
async function searchTrips(query) {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .or(`title.ilike.%${query}%,location.ilike.%${query}%,description.ilike.%${query}%`)
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error searching trips:', error);
    return [];
  }
}

// Filter trips by date range
async function filterTripsByDate(startDate, endDate) {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error filtering trips:', error);
    return [];
  }
}

// ============================================
// TRIP MEMBERS UTILITIES
// ============================================

// Get trip member count
async function getTripMemberCount(tripId) {
  try {
    const { count, error } = await supabase
      .from('trip_members')
      .select('*', { count: 'exact', head: true })
      .eq('trip_id', tripId);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error fetching member count:', error);
    return 0;
  }
}

// Get trip members list
async function getTripMembers(tripId) {
  try {
    const { data, error } = await supabase
      .from('trip_members')
      .select('user_id, user_profiles(*), joined_at')
      .eq('trip_id', tripId)
      .order('joined_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching trip members:', error);
    return [];
  }
}

// Check if user joined trip
async function hasUserJoinedTrip(tripId, userId) {
  try {
    const { data, error } = await supabase
      .from('trip_members')
      .select('id')
      .eq('trip_id', tripId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return data !== null;
  } catch (error) {
    console.error('Error checking trip membership:', error);
    return false;
  }
}

// Join trip
async function joinTrip(tripId) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    // Check if already joined
    const alreadyJoined = await hasUserJoinedTrip(tripId, user.id);
    if (alreadyJoined) throw new Error('Already joined this trip');

    const { data, error } = await supabase
      .from('trip_members')
      .insert({
        trip_id: tripId,
        user_id: user.id,
      })
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error joining trip:', error);
    throw error;
  }
}

// Leave trip
async function leaveTrip(tripId) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { error } = await supabase
      .from('trip_members')
      .delete()
      .eq('trip_id', tripId)
      .eq('user_id', user.id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error leaving trip:', error);
    throw error;
  }
}

// ============================================
// TRIP COMMENTS UTILITIES
// ============================================

// Get trip comments
async function getTripComments(tripId) {
  try {
    const { data, error } = await supabase
      .from('trip_comments')
      .select('*, user_profiles(*)')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

// Add comment to trip
async function addTripComment(tripId, comment) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('trip_comments')
      .insert({
        trip_id: tripId,
        user_id: user.id,
        comment: comment,
      })
      .select();

    if (error) throw error;
    return data?.[0] || null;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

// Delete comment
async function deleteComment(commentId) {
  try {
    const { error } = await supabase
      .from('trip_comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Format date
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Format date for input
function formatDateForInput(dateString) {
  return dateString.split('T')[0];
}

// Get days until trip
function daysUntilTrip(tripDate) {
  const today = new Date();
  const trip = new Date(tripDate);
  const diffTime = trip - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Check if trip is upcoming
function isUpcomingTrip(tripDate) {
  return daysUntilTrip(tripDate) > 0;
}

// Update navigation based on auth state
async function updateNavigation() {
  const user = await getCurrentUser();
  const dashboardLink = document.getElementById('dashboardLink');
  const registerLink = document.getElementById('registerLink');
  const loginLink = document.getElementById('loginLink');
  const logoutLink = document.getElementById('logoutLink');

  if (user) {
    if (dashboardLink) dashboardLink.style.display = 'block';
    if (registerLink) registerLink.style.display = 'none';
    if (loginLink) loginLink.style.display = 'none';
    if (logoutLink) logoutLink.style.display = 'block';
  } else {
    if (dashboardLink) dashboardLink.style.display = 'none';
    if (registerLink) registerLink.style.display = 'block';
    if (loginLink) loginLink.style.display = 'block';
    if (logoutLink) logoutLink.style.display = 'none';
  }
}

// Logout
async function logout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.href = 'index.html';
  } catch (error) {
    console.error('Error logging out:', error);
    alert('Error logging out');
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', updateNavigation);

// ============================================
// SERVICE WORKER REGISTRATION
// ============================================

// Register service worker for offline support
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then((registration) => {
                console.log('Service Worker registered:', registration);
            })
            .catch((error) => {
                console.error('Service Worker registration failed:', error);
            });
    });
}
