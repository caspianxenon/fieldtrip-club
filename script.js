// ============================================
// FieldTrip Club - Main JavaScript File
// ============================================

// ============================================
// AUTHENTICATION - REGISTRATION
// ============================================

function selectUserType(type) {
  document.getElementById('userTypeSelection').style.display = 'none';
  if (type === 'excursor') {
    document.getElementById('excursorForm').style.display = 'block';
  } else {
    document.getElementById('eventHolderForm').style.display = 'block';
  }
}

function backToTypeSelection() {
  document.getElementById('userTypeSelection').style.display = 'block';
  document.getElementById('excursorForm').style.display = 'none';
  document.getElementById('eventHolderForm').style.display = 'none';
}

// Register Excursor
async function registerExcursor(email, password, name, phone) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone: phone,
          user_type: 'excursor'
        }
      }
    });

    if (error) throw error;

    // Create user profile
    await ensureUserProfile(data.user.id, email);

    // Show success message
    document.getElementById('excursorForm').style.display = 'none';
    document.getElementById('successSection').style.display = 'block';
    document.getElementById('successMessage').textContent =
      `Welcome, ${name}! You can now log in with your email and password.`;

    // Clear form
    document.getElementById('excursorSignupForm').reset();
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed: ' + error.message);
  }
}

// Register Event Holder
async function registerEventHolder(email, password, name, phone) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone: phone,
          user_type: 'event_holder'
        }
      }
    });

    if (error) throw error;

    // Create user profile
    await ensureUserProfile(data.user.id, email);

    // Show success message with additional info
    document.getElementById('eventHolderForm').style.display = 'none';
    document.getElementById('successSection').style.display = 'block';
    document.getElementById('successMessage').textContent =
      `Welcome, ${name}! Check your email to verify your account. After verification, you can log in to create trips.`;

    // Clear form
    document.getElementById('eventHolderSignupForm').reset();
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed: ' + error.message);
  }
}

// Handle registration forms
function setupRegistrationHandlers() {
  const excursorForm = document.getElementById('excursorSignupForm');
  const eventHolderForm = document.getElementById('eventHolderSignupForm');

  if (excursorForm) {
    excursorForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('excursor-name').value;
      const email = document.getElementById('excursor-email').value;
      const phone = document.getElementById('excursor-phone').value;
      const password = document.getElementById('excursor-password').value;
      const confirmPassword = document.getElementById('excursor-confirm').value;

      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      await registerExcursor(email, password, name, phone);
    });
  }

  if (eventHolderForm) {
    eventHolderForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('eh-name').value;
      const email = document.getElementById('eh-email').value;
      const phone = document.getElementById('eh-phone').value;
      const password = document.getElementById('eh-password').value;
      const confirmPassword = document.getElementById('eh-confirm').value;

      if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
      }

      await registerEventHolder(email, password, name, phone);
    });
  }
}

// ============================================
// AUTHENTICATION - LOGIN
// ============================================

async function handleLogin(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Ensure profile exists
    await ensureUserProfile(data.user.id, email);

    // Save session
    localStorage.setItem('currentUser', JSON.stringify(data.user));

    // Show success and redirect
    const loginSuccess = document.getElementById('loginSuccess');
    if (loginSuccess) {
      loginSuccess.style.display = 'block';
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1500);
    } else {
      window.location.href = 'dashboard.html';
    }
  } catch (error) {
    console.error('Login error:', error);
    const errorBox = document.getElementById('loginError');
    if (errorBox) {
      errorBox.style.display = 'block';
      errorBox.innerHTML = '<strong>Login Failed:</strong> ' + error.message;
    } else {
      alert('Login failed: ' + error.message);
    }
  }
}

function setupLoginHandlers() {
  const loginForm = document.getElementById('loginFormElement');
  const forgotPasswordLink = document.getElementById('forgotPasswordLink');
  const backToLoginLink = document.getElementById('backToLoginLink');

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email').value;
      const password = document.getElementById('login-password').value;
      await handleLogin(email, password);
    });
  }

  if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('loginForm').style.display = 'none';
      document.getElementById('forgotPasswordForm').style.display = 'block';
    });
  }

  if (backToLoginLink) {
    backToLoginLink.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById('loginForm').style.display = 'block';
      document.getElementById('forgotPasswordForm').style.display = 'none';
    });
  }
}

// ============================================
// PASSWORD RESET
// ============================================

async function handleForgotPassword(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password.html'
    });

    if (error) throw error;

    document.getElementById('forgotPasswordFormElement').style.display = 'none';
    document.getElementById('resetLinkSent').style.display = 'block';
    document.getElementById('resetEmailMessage').textContent =
      `A password reset link has been sent to ${email}. Please check your email.`;
  } catch (error) {
    console.error('Password reset error:', error);
    alert('Error: ' + error.message);
  }
}

function setupForgotPasswordHandlers() {
  const forgotForm = document.getElementById('forgotPasswordFormElement');

  if (forgotForm) {
    forgotForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email').value;
      await handleForgotPassword(email);
    });
  }
}

// ============================================
// DASHBOARD - TRIPS MANAGEMENT
// ============================================

async function loadDashboard() {
  const user = await requireAuth();
  if (!user) return;

  // Load user info
  const profile = await getUserProfile(user.id);
  const userName = document.getElementById('userName');
  const userEmail = document.getElementById('userEmail');

  if (userName) userName.textContent = profile?.full_name || user.email;
  if (userEmail) userEmail.textContent = user.email;

  // Load created trips
  const createdTrips = await getUserCreatedTrips(user.id);
  const joinedTrips = await getUserJoinedTrips(user.id);

  displayUserTrips(createdTrips, joinedTrips);

  // Load trip counts
  const tripsCreatedCount = document.getElementById('tripsCreatedCount');
  if (tripsCreatedCount) {
    tripsCreatedCount.textContent = createdTrips.length;
  }
}

function displayUserTrips(createdTrips, joinedTrips) {
  const createdContainer = document.getElementById('createdTripsContainer');
  const joinedContainer = document.getElementById('myTripsContainer');

  if (createdContainer) {
    if (createdTrips.length === 0) {
      createdContainer.innerHTML = '<p style="color: #666;">You haven\'t created any trips yet.</p>';
    } else {
      createdContainer.innerHTML = createdTrips.map(trip => `
        <div class="trip-item-dashboard">
          <div class="trip-info">
            <h4>${trip.title}</h4>
            <p><strong>Location:</strong> ${trip.location}</p>
            <p><strong>Date:</strong> ${formatDate(trip.date)}</p>
            <p><strong>Capacity:</strong> ${trip.capacity}</p>
          </div>
          <div class="trip-actions">
            <a href="trip.html?id=${trip.id}" class="btn btn-secondary">View Details</a>
            <button onclick="deleteTrip('${trip.id}')" class="btn btn-danger">Delete</button>
          </div>
        </div>
      `).join('');
    }
  }

  if (joinedContainer) {
    if (joinedTrips.length === 0) {
      joinedContainer.innerHTML = '<p style="color: #666;">You haven\'t joined any trips yet.</p>';
    } else {
      joinedContainer.innerHTML = joinedTrips.map(trip => `
        <div class="trip-item-dashboard">
          <div class="trip-info">
            <h4>${trip.title}</h4>
            <p><strong>Location:</strong> ${trip.location}</p>
            <p><strong>Date:</strong> ${formatDate(trip.date)}</p>
            <p><strong>Organizer:</strong> ${trip.created_by}</p>
          </div>
          <div class="trip-actions">
            <a href="trip.html?id=${trip.id}" class="btn btn-secondary">View Details</a>
            <button onclick="leaveTrip('${trip.id}')" class="btn btn-warning">Leave Trip</button>
          </div>
        </div>
      `).join('');
    }
  }
}

async function createTrip(e) {
  e.preventDefault();
  const user = await requireAuth();
  if (!user) return;

  try {
    const tripData = {
      title: document.getElementById('trip-name').value,
      location: document.getElementById('trip-location').value,
      date: document.getElementById('trip-date').value,
      description: document.getElementById('trip-description').value,
      capacity: parseInt(document.getElementById('trip-capacity').value),
    };

    const createdTrip = await createTrip(tripData);
    alert('Trip created successfully!');

    // Reload dashboard
    document.getElementById('createTripForm').reset();
    loadDashboard();
  } catch (error) {
    console.error('Error creating trip:', error);
    alert('Error creating trip: ' + error.message);
  }
}

async function deleteTrip(tripId) {
  if (!confirm('Are you sure you want to delete this trip?')) return;

  try {
    await deleteTrip(tripId);
    alert('Trip deleted successfully!');
    loadDashboard();
  } catch (error) {
    console.error('Error deleting trip:', error);
    alert('Error deleting trip: ' + error.message);
  }
}

async function leaveTrip(tripId) {
  if (!confirm('Are you sure you want to leave this trip?')) return;

  try {
    await leaveTrip(tripId);
    alert('You have left the trip!');
    loadDashboard();
  } catch (error) {
    console.error('Error leaving trip:', error);
    alert('Error leaving trip: ' + error.message);
  }
}

// ============================================
// TRIPS LISTING & BROWSING
// ============================================

async function loadTripsPage() {
  const trips = await getAllTrips();
  displayTripsGrid(trips);

  // Setup search and filter handlers
  const searchInput = document.getElementById('searchInput');
  const filterUpcoming = document.getElementById('filterUpcoming');

  if (searchInput) {
    searchInput.addEventListener('input', async (e) => {
      if (e.target.value.trim() === '') {
        displayTripsGrid(trips);
      } else {
        const results = await searchTrips(e.target.value);
        displayTripsGrid(results);
      }
    });
  }

  if (filterUpcoming) {
    filterUpcoming.addEventListener('change', async () => {
      if (filterUpcoming.checked) {
        const upcomingTrips = trips.filter(trip => isUpcomingTrip(trip.date));
        displayTripsGrid(upcomingTrips);
      } else {
        displayTripsGrid(trips);
      }
    });
  }
}

async function displayTripsGrid(trips) {
  const tripsContainer = document.getElementById('tripsGrid');
  if (!tripsContainer) return;

  if (trips.length === 0) {
    tripsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No trips found.</p>';
    return;
  }

  const user = await getCurrentUser();

  tripsContainer.innerHTML = await Promise.all(trips.map(async (trip) => {
    const memberCount = await getTripMemberCount(trip.id);
    const spotsLeft = trip.capacity - memberCount;
    const userJoined = user ? await hasUserJoinedTrip(trip.id, user.id) : false;

    return `
      <div class="trip-card">
        <div class="trip-header">
          <h3>${trip.title}</h3>
          <span class="trip-badge">${daysUntilTrip(trip.date)} days away</span>
        </div>
        <p class="trip-location">📍 ${trip.location}</p>
        <p class="trip-date">📅 ${formatDate(trip.date)}</p>
        <p class="trip-description">${trip.description}</p>
        <div class="trip-meta">
          <span>${memberCount} / ${trip.capacity} spots filled</span>
          <span style="color: ${spotsLeft > 0 ? '#27ae60' : '#e74c3c'};">
            ${spotsLeft > 0 ? spotsLeft + ' spots left' : 'FULL'}
          </span>
        </div>
        <div class="trip-actions">
          <a href="trip.html?id=${trip.id}" class="btn btn-primary">View Details</a>
          ${user && !userJoined && spotsLeft > 0 ? `
            <button onclick="joinTripFromCard('${trip.id}')" class="btn btn-success">Join Trip</button>
          ` : user && userJoined ? `
            <button class="btn btn-disabled">✓ Joined</button>
          ` : !user ? `
            <a href="login.html" class="btn btn-secondary">Login to Join</a>
          ` : `
            <button class="btn btn-disabled">FULL</button>
          `}
        </div>
      </div>
    `;
  })).then(results => results.join(''));
}

async function joinTripFromCard(tripId) {
  const user = await requireAuth();
  if (!user) return;

  try {
    await joinTrip(tripId);
    alert('Successfully joined the trip!');
    await loadTripsPage();
  } catch (error) {
    alert('Error joining trip: ' + error.message);
  }
}

// ============================================
// TRIP DETAILS PAGE
// ============================================

async function loadTripDetailsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const tripId = urlParams.get('id');

  if (!tripId) {
    window.location.href = 'trips.html';
    return;
  }

  const trip = await getTripById(tripId);
  if (!trip) {
    alert('Trip not found');
    window.location.href = 'trips.html';
    return;
  }

  // Display trip details
  const tripTitle = document.getElementById('tripTitle');
  const tripDetails = document.getElementById('tripDetails');
  const tripMembers = document.getElementById('tripMembers');
  const tripComments = document.getElementById('tripComments');

  if (tripTitle) tripTitle.textContent = trip.title;

  const memberCount = await getTripMemberCount(tripId);
  const members = await getTripMembers(tripId);
  const comments = await getTripComments(tripId);
  const user = await getCurrentUser();
  const userJoined = user ? await hasUserJoinedTrip(tripId, user.id) : false;

  if (tripDetails) {
    tripDetails.innerHTML = `
      <div class="trip-detail-card">
        <h3>${trip.title}</h3>
        <p><strong>Location:</strong> ${trip.location}</p>
        <p><strong>Date:</strong> ${formatDate(trip.date)}</p>
        <p><strong>Description:</strong> ${trip.description}</p>
        <p><strong>Capacity:</strong> ${memberCount} / ${trip.capacity}</p>
        <div class="trip-actions" style="margin-top: 2rem;">
          ${user && !userJoined && memberCount < trip.capacity ? `
            <button onclick="joinTripDetail('${trip.id}')" class="btn btn-primary">Join This Trip</button>
          ` : user && userJoined ? `
            <button class="btn btn-disabled">✓ You've Joined This Trip</button>
            <button onclick="leaveTripDetail('${trip.id}')" class="btn btn-warning">Leave Trip</button>
          ` : !user ? `
            <a href="login.html" class="btn btn-secondary">Login to Join</a>
          ` : `
            <button class="btn btn-disabled">Trip is Full</button>
          `}
        </div>
      </div>
    `;
  }

  if (tripMembers) {
    if (members.length === 0) {
      tripMembers.innerHTML = '<p>No members yet.</p>';
    } else {
      tripMembers.innerHTML = `
        <h3>Trip Members (${members.length})</h3>
        <ul>
          ${members.map(m => `
            <li>${m.user_profiles?.full_name || 'Anonymous'} - Joined ${formatDate(m.joined_at)}</li>
          `).join('')}
        </ul>
      `;
    }
  }

  if (tripComments) {
    displayComments(tripId, comments);
  }

  // Setup comment form
  const commentForm = document.getElementById('commentForm');
  if (commentForm && user) {
    commentForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const commentText = document.getElementById('commentText').value;
      await addCommentToTrip(tripId, commentText);
    });
  }
}

function displayComments(tripId, comments) {
  const tripComments = document.getElementById('tripComments');
  if (!tripComments) return;

  if (comments.length === 0) {
    tripComments.innerHTML = '<p>No comments yet. Be the first to comment!</p>';
  } else {
    tripComments.innerHTML = `
      <h3>Comments</h3>
      <div class="comments-list">
        ${comments.map(c => `
          <div class="comment-item">
            <p><strong>${c.user_profiles?.full_name || 'Anonymous'}</strong> - ${formatDate(c.created_at)}</p>
            <p>${c.comment}</p>
          </div>
        `).join('')}
      </div>
    `;
  }
}

async function addCommentToTrip(tripId, comment) {
  try {
    await addTripComment(tripId, comment);
    alert('Comment added!');
    document.getElementById('commentText').value = '';
    // Reload comments
    const comments = await getTripComments(tripId);
    displayComments(tripId, comments);
  } catch (error) {
    alert('Error adding comment: ' + error.message);
  }
}

async function joinTripDetail(tripId) {
  try {
    await joinTrip(tripId);
    alert('Successfully joined!');
    loadTripDetailsPage();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

async function leaveTripDetail(tripId) {
  if (!confirm('Are you sure?')) return;
  try {
    await leaveTrip(tripId);
    alert('You have left the trip.');
    loadTripDetailsPage();
  } catch (error) {
    alert('Error: ' + error.message);
  }
}

// ============================================
// USER PROFILE PAGE
// ============================================

async function loadProfilePage() {
  const urlParams = new URLSearchParams(window.location.search);
  const userId = urlParams.get('id');
  const user = await getCurrentUser();

  if (!userId && user) {
    // Load own profile
    const profile = await getUserProfile(user.id);
    const createdTrips = await getUserCreatedTrips(user.id);
    const joinedTrips = await getUserJoinedTrips(user.id);

    const profileContainer = document.getElementById('profileContainer');
    if (profileContainer) {
      profileContainer.innerHTML = `
        <div class="profile-card">
          <h2>${profile?.full_name || user.email}</h2>
          <p>${user.email}</p>
          <p>${profile?.bio || 'No bio added yet.'}</p>
        </div>
        <div class="profile-stats">
          <div class="stat">
            <span class="stat-number">${createdTrips.length}</span>
            <span class="stat-label">Trips Created</span>
          </div>
          <div class="stat">
            <span class="stat-number">${joinedTrips.length}</span>
            <span class="stat-label">Trips Joined</span>
          </div>
        </div>
      `;
    }
  }
}

// ============================================
// INITIALIZATION
// ============================================

// Setup handlers on page load
document.addEventListener('DOMContentLoaded', () => {
  // Check which page we're on and setup accordingly
  const path = window.location.pathname;

  if (path.includes('register.html')) {
    setupRegistrationHandlers();
  } else if (path.includes('login.html')) {
    setupLoginHandlers();
    setupForgotPasswordHandlers();
  } else if (path.includes('dashboard.html')) {
    loadDashboard();
  } else if (path.includes('trips.html')) {
    loadTripsPage();
  } else if (path.includes('trip.html')) {
    loadTripDetailsPage();
  } else if (path.includes('profile.html')) {
    loadProfilePage();
  }
});
