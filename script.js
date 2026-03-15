// ============ CONFIGURATION ============
const API_URL = 'http://localhost:5000/api';
let currentUser = null;
let currentUserType = null;
let otpEmail = null;

// ============ UTILITY FUNCTIONS ============

// Get token from localStorage
function getToken() {
    return localStorage.getItem('token');
}

// Set token in localStorage
function setToken(token) {
    localStorage.setItem('token', token);
}

// Get current user from localStorage
function getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// Set current user in localStorage
function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    currentUser = user;
    updateNavigation();
}

// Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentUserType');
    currentUser = null;
    currentUserType = null;
    alert('Logged out successfully');
    window.location.href = 'index.html';
}

// Update navigation based on login state
function updateNavigation() {
    const user = getCurrentUser();
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

// Make API request
async function apiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const token = getToken();
    if (token) {
        options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || 'API Error');
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// ============ REGISTRATION PAGE ============

// Select user type
function selectUserType(type) {
    currentUserType = type;
    
    if (type === 'excursor') {
        document.getElementById('userTypeSelection').style.display = 'none';
        document.getElementById('excursorForm').style.display = 'block';
    } else if (type === 'event_holder') {
        document.getElementById('userTypeSelection').style.display = 'none';
        document.getElementById('eventHolderForm').style.display = 'block';
    }
}

// Back to user type selection
function backToTypeSelection() {
    currentUserType = null;
    document.getElementById('userTypeSelection').style.display = 'block';
    document.getElementById('excursorForm').style.display = 'none';
    document.getElementById('eventHolderForm').style.display = 'none';
}

// Excursor signup
document.getElementById('excursorSignupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('excursor-name').value;
    const email = document.getElementById('excursor-email').value;
    const phone = document.getElementById('excursor-phone').value;
    const password = document.getElementById('excursor-password').value;
    const confirm = document.getElementById('excursor-confirm').value;

    if (password !== confirm) {
        alert('Passwords do not match');
        return;
    }

    try {
        const result = await apiCall('/auth/signup', 'POST', {
            name,
            email,
            phone,
            password,
            userType: 'excursor'
        });

        otpEmail = email;
        document.getElementById('excursorForm').style.display = 'none';
        document.getElementById('otpSection').style.display = 'block';
        document.getElementById('otpEmail').textContent = `We've sent an OTP to ${email}`;
    } catch (error) {
        alert(`Signup failed: ${error.message}`);
    }
});

// Event Holder signup
document.getElementById('eventHolderSignupForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('eh-name').value;
    const email = document.getElementById('eh-email').value;
    const phone = document.getElementById('eh-phone').value;
    const password = document.getElementById('eh-password').value;
    const confirm = document.getElementById('eh-confirm').value;

    if (password !== confirm) {
        alert('Passwords do not match');
        return;
    }

    try {
        const result = await apiCall('/auth/signup', 'POST', {
            name,
            email,
            phone,
            password,
            userType: 'event_holder'
        });

        otpEmail = email;
        document.getElementById('eventHolderForm').style.display = 'none';
        document.getElementById('otpSection').style.display = 'block';
        document.getElementById('otpEmail').textContent = `We've sent an OTP to ${email}`;
    } catch (error) {
        alert(`Signup failed: ${error.message}`);
    }
});

// OTP verification for signup
document.getElementById('otpForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const otp = document.getElementById('otp-input').value;

    if (otp.length !== 6) {
        alert('OTP must be 6 digits');
        return;
    }

    try {
        const result = await apiCall('/auth/verify-otp', 'POST', {
            email: otpEmail,
            otp
        });

        setToken(result.token);
        setCurrentUser(result.user);

        if (currentUserType === 'excursor') {
            // Excursor registration complete
            document.getElementById('otpSection').style.display = 'none';
            document.getElementById('successSection').style.display = 'block';
            document.getElementById('successMessage').textContent = `Welcome ${result.user.name}! Your account is ready. You can now join field trips!`;
            setTimeout(() => window.location.href = 'dashboard.html', 3000);
        } else if (currentUserType === 'event_holder') {
            // Continue to KYC
            document.getElementById('otpSection').style.display = 'none';
            document.getElementById('kycSection').style.display = 'block';
        }
    } catch (error) {
        alert(`OTP verification failed: ${error.message}`);
    }
});

// KYC form submission
document.getElementById('kycForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nationalId = document.getElementById('kyc-id').value;
    const firstName = document.getElementById('kyc-firstname').value;
    const lastName = document.getElementById('kyc-lastname').value;
    const dob = document.getElementById('kyc-dob').value;
    const idType = document.getElementById('kyc-type').value || 'national_id';

    try {
        const result = await apiCall('/kyc/start', 'POST', {
            nationalId,
            firstName,
            lastName,
            dateOfBirth: dob,
            idType
        });

        // Move to payment
        document.getElementById('kycSection').style.display = 'none';
        document.getElementById('paymentSection').style.display = 'block';
        
        const user = getCurrentUser();
        document.getElementById('mpesa-phone').value = user.phone || '';
        document.getElementById('kycSuccessMessage').style.display = 'block';
        document.getElementById('kycSuccessMessage').textContent = '✓ KYC verified! Proceed to payment.';
    } catch (error) {
        document.getElementById('kycErrorMessage').style.display = 'block';
        document.getElementById('kycErrorMessage').textContent = `❌ ${error.message}`;
        // Allow retry
        setTimeout(() => {
            document.getElementById('kycErrorMessage').style.display = 'none';
        }, 5000);
    }
});

// Retry KYC after failure
async function retryKYC() {
    try {
        await apiCall('/kyc/retry', 'POST', {});
        document.getElementById('kycSection').style.display = 'block';
        document.getElementById('paymentSection').style.display = 'none';
        document.getElementById('kycForm').reset();
    } catch (error) {
        alert(`Failed to retry KYC: ${error.message}`);
    }
}

// MPesa payment
document.getElementById('mpesaForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const phone = document.getElementById('mpesa-phone').value;

    try {
        const result = await apiCall('/payment/mpesa', 'POST', { phone });

        // Simulate payment flow
        setTimeout(() => {
            const paymentSuccess = confirm('Simulate successful MPesa payment?\nClick OK for success, Cancel for failure');
            
            if (paymentSuccess) {
                // Verify payment
                verifyMPesaPayment(result.transactionId);
            } else {
                document.getElementById('paymentStatus').style.display = 'block';
                document.getElementById('paymentError').style.display = 'block';
                document.getElementById('paymentErrorMsg').textContent = 'Payment could not be processed. Please try again.';
            }
        }, 2000);
    } catch (error) {
        alert(`Payment initiation failed: ${error.message}`);
    }
});

async function verifyMPesaPayment(transactionId, tripId = null) {
    try {
        const user = getCurrentUser();
        const result = await apiCall('/payment/verify', 'POST', { 
            transactionId,
            tripId,
            amount: 999
        });
        
        // Update user data
        user.paymentStatus = 'completed';
        setCurrentUser(user);

        document.getElementById('paymentStatus').style.display = 'block';
        document.getElementById('paymentSuccess').style.display = 'block';
        
        // Display ticket information if generated
        if (result.ticket) {
            displayTicketAfterPayment(result.ticket);
        }

        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 3000);
    } catch (error) {
        document.getElementById('paymentStatus').style.display = 'block';
        document.getElementById('paymentError').style.display = 'block';
        document.getElementById('paymentErrorMsg').textContent = error.message;
    }
}

function displayTicketAfterPayment(ticket) {
    const ticketDiv = document.getElementById('ticketDisplay');
    if (ticketDiv) {
        ticketDiv.innerHTML = `
            <div style="background: #f0f0f0; padding: 1.5rem; border-radius: 8px; margin-top: 1rem;">
                <h3>🎫 Your Ticket</h3>
                <p><strong>Ticket ID:</strong> ${ticket.ticketId}</p>
                <p><strong>Trip:</strong> ${ticket.tripName}</p>
                <p><strong>Date:</strong> ${ticket.tripDate}</p>
                <p><strong>Status:</strong> ✓ ${ticket.status}</p>
                <p><strong>Valid Until:</strong> ${new Date(ticket.validUntil).toLocaleDateString()}</p>
                ${ticket.qrCode ? `<p style="margin-top: 1rem; text-align: center;"><strong>QR Code:</strong> <br><img src="${ticket.qrCode}" alt="QR Code" style="max-width: 200px; border: 1px solid #ddd; padding: 0.5rem;"></p>` : ''}
            </div>
        `;
        ticketDiv.style.display = 'block';
    }
}

function retryPayment() {
    document.getElementById('mpesaForm').style.display = 'block';
    document.getElementById('paymentStatus').style.display = 'none';
}

// ============ LOGIN PAGE ============

// Forgot Password Link
document.getElementById('forgotPasswordLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('forgotPasswordForm').style.display = 'block';
});

// Back to Login from Forgot Password
document.getElementById('backToLoginLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('forgotPasswordForm').style.display = 'block';
    document.getElementById('resetLinkSent').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
});

document.getElementById('backToLoginLink2')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('forgotPasswordForm').style.display = 'none';
    document.getElementById('resetLinkSent').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
});

// Back to Login from OTP
document.getElementById('backToLoginFromOtp')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('loginOtpSection').style.display = 'none';
    document.getElementById('loginForm').style.display = 'block';
});

// Forgot Password Form Submission
document.getElementById('forgotPasswordFormElement')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('forgot-email').value;

    try {
        const result = await apiCall('/auth/forgot-password', 'POST', { email });
        
        document.getElementById('forgotPasswordFormElement').style.display = 'none';
        document.getElementById('resetLinkSent').style.display = 'block';
        document.getElementById('resetEmailMessage').textContent = 
            `✓ A password reset link has been sent to ${email}. Check your email and spam folder for instructions.`;
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

// Login form
document.getElementById('loginFormElement')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const result = await apiCall('/auth/login', 'POST', { email, password });
        
        otpEmail = email;
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('loginOtpSection').style.display = 'block';
        document.getElementById('loginOtpEmail').textContent = `OTP sent to ${email}`;
    } catch (error) {
        const errorDiv = document.getElementById('loginError');
        if (errorDiv) {
            errorDiv.style.display = 'block';
            errorDiv.textContent = `❌ ${error.message}`;
        }
        alert(`Login failed: ${error.message}`);
    }
});

// Login OTP verification
document.getElementById('loginOtpForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const otp = document.getElementById('login-otp').value;

    if (otp.length !== 6) {
        alert('OTP must be 6 digits');
        return;
    }

    try {
        const result = await apiCall('/auth/verify-otp', 'POST', {
            email: otpEmail,
            otp
        });

        setToken(result.token);
        setCurrentUser(result.user);

        // Smart redirect based on user type
        const redirectUrl = result.user.userType === 'event_holder' ? 'dashboard.html' : 'index.html';
        
        document.getElementById('loginOtpSection').style.display = 'none';
        document.getElementById('loginSuccess').style.display = 'block';
        setTimeout(() => window.location.href = redirectUrl, 2000);
    } catch (error) {
        alert(`OTP verification failed: ${error.message}`);
    }
});

// ============ DASHBOARD PAGE ============

async function loadDashboard() {
    const user = getCurrentUser();
    const token = getToken();

    if (!user || !token) {
        alert('Please login first');
        window.location.href = 'login.html';
        return;
    }

    try {
        const profileResult = await apiCall('/user/profile', 'GET');
        const dashboardResult = await apiCall('/user/dashboard', 'GET');

        // Update profile info
        document.getElementById('userName').textContent = profileResult.name;
        document.getElementById('userEmail').textContent = profileResult.email;
        document.getElementById('userType').textContent = 
            profileResult.userType === 'excursor' ? '👤 Excursor' : '📋 Event Holder';
        document.getElementById('userStatus').textContent = 
            profileResult.verified ? '✓ Verified' : '⏳ Pending';

        if (profileResult.userType === 'excursor') {
            document.getElementById('excursorDashboard').style.display = 'block';
            displayExcursorTrips(dashboardResult.trips || []);
        } else if (profileResult.userType === 'event_holder') {
            document.getElementById('eventHolderDashboard').style.display = 'block';
            document.getElementById('kycStatusDisplay').textContent = 
                profileResult.kycStatus === 'verified' ? '✓ Verified' : '⏳ ' + profileResult.kycStatus;
            document.getElementById('kycStatusDisplay').className = 
                profileResult.kycStatus === 'verified' ? 'status-badge success' : 'status-badge pending';
            
            document.getElementById('paymentStatusDisplay').textContent = 
                profileResult.paymentStatus === 'completed' ? '✓ Completed' : '⏳ ' + profileResult.paymentStatus;
            document.getElementById('paymentStatusDisplay').className = 
                profileResult.paymentStatus === 'completed' ? 'status-badge success' : 'status-badge pending';
            
            document.getElementById('tripsCreatedCount').textContent = dashboardResult.totalTripsCreated || 0;
            displayEventHolderTrips(dashboardResult.trips || []);
        }
    } catch (error) {
        alert(`Failed to load dashboard: ${error.message}`);
    }
}

function displayExcursorTrips(trips) {
    const container = document.getElementById('myTripsContainer');
    
    if (trips.length === 0) {
        container.innerHTML = '<p style="color: #666;">You haven\'t joined any trips yet.</p>';
        return;
    }

    container.innerHTML = trips.map(trip => `
        <div class="trip-item">
            <h3>${trip.icon} ${trip.name}</h3>
            <p><strong>Date:</strong> ${trip.date}</p>
            <p><strong>Location:</strong> ${trip.location}</p>
            <p><strong>Cost:</strong> KES ${trip.cost.toLocaleString()}</p>
        </div>
    `).join('');
}

function displayEventHolderTrips(trips) {
    const container = document.getElementById('createdTripsContainer');
    
    if (trips.length === 0) {
        container.innerHTML = '<p style="color: #666;">You haven\'t created any trips yet.</p>';
        return;
    }

    container.innerHTML = trips.map(trip => `
        <div class="trip-item">
            <h3>${trip.name}</h3>
            <p><strong>Date:</strong> ${trip.date}</p>
            <p><strong>Location:</strong> ${trip.location}</p>
            <p><strong>Registered:</strong> ${trip.registered}/${trip.capacity}</p>
            <p><strong>Current Cost:</strong> <span id="trip-cost-${trip.id}">KES ${trip.cost.toLocaleString()}</span></p>
            <div style="display: flex; gap: 1rem;">
                <button class="btn btn-sm btn-secondary" onclick="editTripCost(${trip.id})">Edit Cost</button>
            </div>
            <div id="edit-form-${trip.id}" style="display: none; margin-top: 1rem;">
                <div style="display: flex; gap: 0.5rem;">
                    <input type="number" id="cost-input-${trip.id}" placeholder="New cost" min="1000">
                    <button class="btn btn-sm btn-primary" onclick="saveTripCost(${trip.id})">Save</button>
                    <button class="btn btn-sm btn-ghost" onclick="cancelEditTripCost(${trip.id})">Cancel</button>
                </div>
            </div>
        </div>
    `).join('');
}

function editTripCost(tripId) {
    document.getElementById(`edit-form-${tripId}`).style.display = 'block';
}

function cancelEditTripCost(tripId) {
    document.getElementById(`edit-form-${tripId}`).style.display = 'none';
}

async function saveTripCost(tripId) {
    const newCost = parseFloat(document.getElementById(`cost-input-${tripId}`).value);

    if (isNaN(newCost) || newCost < 1000) {
        alert('Please enter a valid cost (minimum KES 1000)');
        return;
    }

    try {
        const result = await apiCall(`/trips/${tripId}`, 'PUT', { cost: newCost });
        document.getElementById(`trip-cost-${tripId}`).textContent = `KES ${newCost.toLocaleString()}`;
        document.getElementById(`edit-form-${tripId}`).style.display = 'none';
        alert('Trip cost updated successfully');
    } catch (error) {
        alert(`Failed to update trip: ${error.message}`);
    }
}

// Create trip form
document.getElementById('createTripForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('trip-name').value;
    const date = document.getElementById('trip-date').value;
    const location = document.getElementById('trip-location').value;
    const description = document.getElementById('trip-description').value;
    const cost = parseFloat(document.getElementById('trip-cost').value);
    const capacity = parseInt(document.getElementById('trip-capacity').value);

    try {
        const result = await apiCall('/trips', 'POST', {
            name,
            date,
            location,
            description,
            cost,
            capacity
        });

        alert(`Trip "${name}" created successfully!`);
        document.getElementById('createTripForm').reset();
        loadDashboard(); // Refresh dashboard
    } catch (error) {
        alert(`Failed to create trip: ${error.message}`);
    }
});

// ============ TRIPS PAGE ============

// Store trip images and payment status
const tripImages = {
    1: ['🏜️ Savanna View 1', '🦁 Wildlife 1', '🌅 Sunrise 1', '🐘 Elephant Herd'],
    2: ['⛰️ Peak View 1', '🌄 Mountain Trail', '☁️ High Altitude', '🏔️ Summit View'],
    3: ['🌊 Beach 1', '🏝️ Island View', '☀️ Sunset Beach', '🏄 Water Sports'],
    4: ['🌋 Gorge View', '♨️ Hot Spring', '🪨 Rock Formation', '🌳 Natural Beauty']
};

// Trip location coordinates (latitude, longitude)
const tripLocations = {
    1: { lat: -0.5029, lng: 37.1899, location: 'Mount Kenya, Kenya' },      // Mount Kenya
    2: { lat: -1.2921, lng: 36.8219, location: 'Nairobi, Kenya' },           // Nairobi
    3: { lat: -4.3369, lng: 39.2675, location: 'Mombasa, Kenya' },           // Coastal Kenya
    4: { lat: 0.3641, lng: 35.8116, location: 'Lake Baringo, Kenya' }        // Rift Valley
};

// Store map instances
const tripMaps = {};
const tripMapMarkers = {};

const tripPaymentStatus = {};
const tripTickets = {};
const paymentHistory = {}; // Track all payments per user
let allTrips = []; // Store all trips for filtering

// ============ MAP FUNCTIONS ============

// Initialize map for a trip
function initializeMap(tripId) {
    // Only initialize if Leaflet is available
    if (typeof L === 'undefined') return;
    
    const mapContainer = document.getElementById(`map-${tripId}`);
    if (!mapContainer) return;

    const tripData = tripLocations[tripId];
    if (!tripData) return;

    // Create map
    const map = L.map(`map-${tripId}`).setView([tripData.lat, tripData.lng], 10);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);

    // Add marker
    const marker = L.marker([tripData.lat, tripData.lng])
        .bindPopup(`<strong>${document.querySelector(`#trip-name-${tripId}`).textContent}</strong><br>${tripData.location}`)
        .addTo(map);

    // Store references
    tripMaps[tripId] = map;
    tripMapMarkers[tripId] = marker;

    // Fix map display after container resize
    setTimeout(() => {
        map.invalidateSize();
    }, 100);

    console.log(`✓ Map initialized for trip ${tripId}`);
}

// ============ TICKET GENERATION ============

// Generate unique ticket number

function generateTicketNumber() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let ticket = '';
    for (let i = 0; i < 5; i++) {
        ticket += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return ticket;
}

// ============ FILTERING & SEARCH ============

// Apply filters to trips
function filterTrips() {
    const searchInput = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const locationFilter = document.getElementById('locationFilter')?.value || '';
    const priceFilter = document.getElementById('priceFilter')?.value || '';
    const dateFilter = document.getElementById('dateFilter')?.value || '';

    const filtered = allTrips.filter(trip => {
        const matchesSearch = !searchInput || 
            trip.name.toLowerCase().includes(searchInput) ||
            trip.description.toLowerCase().includes(searchInput) ||
            trip.location.toLowerCase().includes(searchInput);

        const matchesLocation = !locationFilter || trip.location === locationFilter;

        const matchesPrice = !priceFilter || 
            (priceFilter === 'budget' && trip.cost <= 5000) ||
            (priceFilter === 'moderate' && trip.cost > 5000 && trip.cost <= 10000) ||
            (priceFilter === 'luxury' && trip.cost > 10000);

        const matchesDate = !dateFilter || trip.date === dateFilter;

        return matchesSearch && matchesLocation && matchesPrice && matchesDate;
    });

    displayFilteredTrips(filtered);
}

// Display filtered trips
function displayFilteredTrips(trips) {
    const tripsList = document.getElementById('trips-list');
    if (!tripsList) return;

    if (trips.length === 0) {
        tripsList.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">No trips match your filters. Try adjusting your search.</p>';
        return;
    }

    tripsList.innerHTML = trips.map(trip => generateTripCard(trip)).join('');
    
    // Initialize maps for filtered trips
    setTimeout(() => {
        trips.forEach(trip => {
            initializeMap(trip.id);
        });
    }, 100);
}

// Generate a single trip card (extracted for reusability)
function generateTripCard(trip) {
    const user = getCurrentUser();
    let actionButton = `<button class="btn btn-primary" onclick="joinTrip(${trip.id})">Join Trip</button>`;
    let paymentSection = '';
    let carouselSection = '';
    let ticketSection = '';

    if (user?.userType === 'excursor') {
        const paymentStatus = tripPaymentStatus[trip.id];
        const ticketNumber = tripTickets[trip.id];
        const spotsLeft = trip.capacity - trip.registered;

        carouselSection = `
            <div class="trip-carousel">
                <div class="carousel-container">
                    <div class="carousel-images" id="carousel-${trip.id}">
                        ${(tripImages[trip.id] || ['No images available']).map((img, idx) => `
                            <div class="carousel-image ${idx === 0 ? 'active' : ''}" style="display: ${idx === 0 ? 'block' : 'none'};">
                                ${img}
                            </div>
                        `).join('')}
                    </div>
                    <button class="carousel-nav prev" onclick="prevImage(${trip.id})">❮</button>
                    <button class="carousel-nav next" onclick="nextImage(${trip.id})">❯</button>
                    <div class="carousel-dots" id="dots-${trip.id}">
                        ${(tripImages[trip.id] || []).map((_, idx) => `
                            <span class="dot ${idx === 0 ? 'active' : ''}" onclick="goToImage(${trip.id}, ${idx})"></span>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        // Spots left indicator
        const spotsColor = spotsLeft <= 2 ? 'color: #d9534f;' : '';
        const spotsClass = spotsLeft <= 2 ? 'spots-warning' : '';

        if (paymentStatus === 'confirmed') {
            ticketSection = `
                <div class="ticket-confirmed">
                    <h4>✓ Payment Confirmed!</h4>
                    <div class="ticket-number">
                        <strong>Ticket:</strong> ${ticketNumber}
                    </div>
                </div>
            `;
            paymentSection = `
                <div class="payment-section">
                    <button class="btn btn-disabled" disabled>Payment Confirmed</button>
                </div>
            `;
        } else {
            paymentSection = `
                <div class="payment-section">
                    <button class="btn btn-primary" onclick="showMPesaPayment(${trip.id}, ${trip.cost}, '${trip.name}')">
                        💳 Pay Now (KES ${trip.cost.toLocaleString()})
                    </button>
                </div>
            `;
        }
    } else if (user?.userType === 'event_holder' && trip.createdBy === user.userId) {
        actionButton = `<button class="btn btn-secondary" onclick="editCost(${trip.id})">Edit Cost</button>`;
    }

    const spotsLeft = trip.capacity - trip.registered;
    const spotsColor = spotsLeft <= 2 ? 'color: #d9534f; font-weight: bold;' : '';
    const spotsWarning = spotsLeft <= 2 ? ' 🔴 Hurry!' : '';

    // Map section (only for Excursor viewing)
    let mapSection = '';
    if (user?.userType === 'excursor') {
        mapSection = `
            <div class="trip-map-section">
                <div id="map-${trip.id}" class="trip-map"></div>
            </div>
        `;
    }

    return `
        <div class="trip-item">
            ${carouselSection}
            <h3 id="trip-name-${trip.id}">${trip.icon} ${trip.name}</h3>
            <div class="trip-info-group">
                <strong>📅 Date:</strong>
                <span>${trip.date}</span>
            </div>
            <div class="trip-info-group">
                <strong>📍 Location:</strong>
                <span>${trip.location}</span>
            </div>
            <p><strong>Description:</strong></p>
            <p>${trip.description}</p>
            <div class="trip-info-group">
                <strong>👥 Registered:</strong>
                <span>${trip.registered} / ${trip.capacity} participants</span>
            </div>
            <div class="trip-info-group">
                <strong style="${spotsColor}">🎟️ Spots Left:</strong>
                <span style="${spotsColor}">${spotsLeft}${spotsWarning}</span>
            </div>
            ${mapSection}
            <div class="trip-cost">
                KES <span id="cost-${trip.id}">${trip.cost.toLocaleString()}</span>
            </div>
            ${ticketSection}
            ${paymentSection || ''}
            <div class="trip-actions">
                ${user?.userType === 'excursor' ? '' : actionButton}
            </div>
        </div>
    `;
}

async function displayTrips() {
    try {
        const trips = await apiCall('/trips', 'GET');
        allTrips = trips; // Store for filtering
        
        const tripsList = document.getElementById('trips-list');
        if (!tripsList) return;

        tripsList.innerHTML = trips.map(trip => generateTripCard(trip)).join('');
        
        // Initialize maps for all trips after rendering
        setTimeout(() => {
            trips.forEach(trip => {
                initializeMap(trip.id);
            });
        }, 100);
    } catch (error) {
        console.error('Failed to load trips:', error);
    }
}

// Carousel navigation functions
let currentImageIndex = {};

function prevImage(tripId) {
    const images = document.querySelectorAll(`#carousel-${tripId} .carousel-image`);
    const dots = document.querySelectorAll(`#dots-${tripId} .dot`);
    
    if (!currentImageIndex[tripId]) currentImageIndex[tripId] = 0;
    
    // Hide current
    images[currentImageIndex[tripId]].style.display = 'none';
    dots[currentImageIndex[tripId]].classList.remove('active');
    
    // Go to previous
    currentImageIndex[tripId] = (currentImageIndex[tripId] - 1 + images.length) % images.length;
    
    // Show new
    images[currentImageIndex[tripId]].style.display = 'block';
    dots[currentImageIndex[tripId]].classList.add('active');
}

function nextImage(tripId) {
    const images = document.querySelectorAll(`#carousel-${tripId} .carousel-image`);
    const dots = document.querySelectorAll(`#dots-${tripId} .dot`);
    
    if (!currentImageIndex[tripId]) currentImageIndex[tripId] = 0;
    
    // Hide current
    images[currentImageIndex[tripId]].style.display = 'none';
    dots[currentImageIndex[tripId]].classList.remove('active');
    
    // Go to next
    currentImageIndex[tripId] = (currentImageIndex[tripId] + 1) % images.length;
    
    // Show new
    images[currentImageIndex[tripId]].style.display = 'block';
    dots[currentImageIndex[tripId]].classList.add('active');
}

function goToImage(tripId, index) {
    const images = document.querySelectorAll(`#carousel-${tripId} .carousel-image`);
    const dots = document.querySelectorAll(`#dots-${tripId} .dot`);
    
    if (!currentImageIndex[tripId]) currentImageIndex[tripId] = 0;
    
    // Hide current
    images[currentImageIndex[tripId]].style.display = 'none';
    dots[currentImageIndex[tripId]].classList.remove('active');
    
    // Go to selected
    currentImageIndex[tripId] = index;
    
    // Show new
    images[currentImageIndex[tripId]].style.display = 'block';
    dots[currentImageIndex[tripId]].classList.add('active');
}

// MPesa payment simulation
function showMPesaPayment(tripId, cost, tripName) {
    const user = getCurrentUser();
    
    if (!user) {
        alert('Please login first');
        window.location.href = 'login.html';
        return;
    }

    // Prompt for phone number if not on user
    let phone = user.phone;
    if (!phone) {
        phone = prompt('Enter your MPesa phone number (254xxxxxxxxx):');
        if (!phone) return; // User cancelled
    }

    // Validate phone format
    if (!phone.match(/^254\d{9}$/)) {
        alert('Invalid phone format. Use 254xxxxxxxxx format.');
        return;
    }

    // Show payment confirmation dialog
    const confirmed = confirm(`Simulate MPesa Payment?\n\nTrip: ${tripName}\nAmount: KES ${cost.toLocaleString()}\nPhone: ${phone}\n\nClick OK to confirm payment, Cancel to abort.`);
    
    if (confirmed) {
        // Generate ticket
        const ticketNumber = generateTicketNumber();
        tripPaymentStatus[tripId] = 'confirmed';
        tripTickets[tripId] = ticketNumber;
        
        // Track in payment history
        const userId = user.userId;
        if (!paymentHistory[userId]) {
            paymentHistory[userId] = [];
        }
        paymentHistory[userId].push({
            tripId,
            tripName,
            amount: cost,
            ticket: ticketNumber,
            phone,
            timestamp: new Date().toLocaleString(),
            status: 'confirmed'
        });
        
        console.log(`✓ Payment Confirmed for Trip ${tripId}`);
        console.log(`Trip: ${tripName}`);
        console.log(`Amount: KES ${cost}`);
        console.log(`Phone: ${phone}`);
        console.log(`Ticket Number: ${ticketNumber}`);
        console.log('Payment History:', paymentHistory);
        
        // Refresh display
        displayTrips();
        
        // Show success message
        setTimeout(() => {
            alert(`✓ Payment Successful!\n\nYour ticket number is: ${ticketNumber}\n\nScreen will refresh now.`);
        }, 300);
    } else {
        console.log(`✗ Payment Cancelled for Trip ${tripId}`);
        alert('Payment cancelled by user.');
    }
}

async function joinTrip(tripId) {
    const user = getCurrentUser();

    if (!user) {
        alert('Please login first to join a trip');
        window.location.href = 'login.html';
        return;
    }

    if (user.userType !== 'excursor') {
        alert('Only Excursors can join trips');
        return;
    }

    try {
        const result = await apiCall(`/trips/${tripId}/join`, 'POST');
        alert(`✓ Successfully joined "${result.trip.name}"!`);
        displayTrips();
    } catch (error) {
        alert(`Failed to join trip: ${error.message}`);
    }
}

function editCost(tripId) {
    const costElement = document.getElementById(`cost-${tripId}`);
    const newCost = prompt('Enter new cost (KES):');

    if (newCost === null) return;

    const cost = parseFloat(newCost);
    if (isNaN(cost) || cost < 1000) {
        alert('Please enter a valid cost (minimum KES 1000)');
        return;
    }

    updateTripCost(tripId, cost);
}

async function updateTripCost(tripId, cost) {
    try {
        const result = await apiCall(`/trips/${tripId}`, 'PUT', { cost });
        document.getElementById(`cost-${tripId}`).textContent = cost.toLocaleString();
        alert('Trip cost updated successfully!');
    } catch (error) {
        alert(`Failed to update trip: ${error.message}`);
    }
}

// ============ PAYMENT HISTORY & DASHBOARD ============

// View payment history for Excursor
function viewPaymentHistory() {
    const user = getCurrentUser();
    if (!user) {
        alert('Please login first');
        return;
    }

    const userPayments = paymentHistory[user.userId] || [];
    
    if (userPayments.length === 0) {
        alert('You have no payment history yet.');
        return;
    }

    let historyText = '💳 YOUR PAYMENT HISTORY\n\n';
    let totalSpent = 0;
    
    userPayments.forEach((payment, idx) => {
        historyText += `${idx + 1}. ${payment.tripName}\n`;
        historyText += `   Amount: KES ${payment.amount.toLocaleString()}\n`;
        historyText += `   Ticket: ${payment.ticket}\n`;
        historyText += `   Date: ${payment.timestamp}\n`;
        historyText += `   Status: ${payment.status}\n\n`;
        totalSpent += payment.amount;
    });

    historyText += `─────────────────\nTotal Spent: KES ${totalSpent.toLocaleString()}\nTotal Trips: ${userPayments.length}`;
    alert(historyText);
    console.log('Payment History:', userPayments);
}

// ============ ADMIN DASHBOARD ============

// Show admin dashboard (for testing)
function showAdminDashboard() {
    const dashboardData = {
        totalUsers: 2,
        totalTrips: allTrips.length,
        totalPayments: Object.keys(paymentHistory).reduce((sum, userId) => sum + paymentHistory[userId].length, 0),
        totalRevenue: Object.keys(paymentHistory).reduce((sum, userId) => {
            return sum + paymentHistory[userId].reduce((userSum, payment) => userSum + payment.amount, 0);
        }, 0),
        trips: allTrips.map(trip => ({
            id: trip.id,
            name: trip.name,
            cost: trip.cost,
            registered: trip.registered,
            capacity: trip.capacity,
            available: trip.capacity - trip.registered
        })),
        payments: paymentHistory
    };

    console.clear();
    console.log('═══════════════════════════════════════');
    console.log('📊 ADMIN DASHBOARD');
    console.log('═══════════════════════════════════════');
    console.log(`Total Users: ${dashboardData.totalUsers}`);
    console.log(`Total Trips: ${dashboardData.totalTrips}`);
    console.log(`Total Payments: ${dashboardData.totalPayments}`);
    console.log(`Total Revenue: KES ${dashboardData.totalRevenue.toLocaleString()}`);
    console.log('');
    console.log('📍 TRIPS:');
    dashboardData.trips.forEach(trip => {
        console.log(`  [${trip.id}] ${trip.name}`);
        console.log(`      Cost: KES ${trip.cost.toLocaleString()}`);
        console.log(`      Spots: ${trip.registered}/${trip.capacity} (${trip.available} available)`);
    });
    console.log('');
    console.log('💳 PAYMENTS:');
    let paymentCount = 0;
    Object.keys(dashboardData.payments).forEach(userId => {
        dashboardData.payments[userId].forEach(payment => {
            paymentCount++;
            console.log(`  [${paymentCount}] User ${userId.substring(0, 8)}... paid KES ${payment.amount.toLocaleString()}`);
            console.log(`      Trip: ${payment.tripName}`);
            console.log(`      Ticket: ${payment.ticket}`);
            console.log(`      Date: ${payment.timestamp}`);
        });
    });
    console.log('═══════════════════════════════════════');
    alert('📊 Admin Dashboard opened in console (F12). Check browser console for detailed data.');
}

// ============ NEW FEATURES: GROUP BOOKING SYSTEM ============

// Create a group trip
async function createGroupTrip() {
    const user = getCurrentUser();
    if (!user) {
        alert('Please log in first');
        return;
    }

    const tripId = prompt('Enter Trip ID or select from list');
    const groupName = prompt('Enter group name:');
    const maxMembers = prompt('Max group members (e.g., 10):');

    if (!tripId || !groupName || !maxMembers) {
        alert('All fields required');
        return;
    }

    try {
        const result = await apiCall('/groups/create', 'POST', {
            tripId: parseInt(tripId),
            groupName,
            maxMembers: parseInt(maxMembers)
        });

        console.log('✓ Group created:', result);
        alert(`✓ Group "${groupName}" created!\nShare code: ${result.group.shareCode}\nShare link: ${result.group.shareLink}`);
        
        // Copy link to clipboard
        copyToClipboard(result.group.shareLink);
    } catch (error) {
        console.error('Group creation error:', error);
        alert(`Failed to create group: ${error.message}`);
    }
}

// Join a group trip
async function joinGroupTrip() {
    const user = getCurrentUser();
    if (!user) {
        alert('Please log in first');
        return;
    }

    const shareCode = prompt('Enter the group share code (6 characters):');
    if (!shareCode) return;

    try {
        const result = await apiCall('/groups/join', 'POST', { shareCode });
        console.log('✓ Joined group:', result);
        alert(`✓ Successfully joined "${result.group.groupName}"!\nMembers: ${result.group.memberCount}/${result.group.maxMembers}`);
        displayGroupMembers(result.group);
    } catch (error) {
        console.error('Join group error:', error);
        alert(`Failed to join group: ${error.message}`);
    }
}

// Display group members
function displayGroupMembers(group) {
    let membersList = `👥 GROUP: ${group.groupName}\n`;
    membersList += `Members: ${group.memberCount}/${group.maxMembers}\n\n`;
    
    group.members.forEach((member, idx) => {
        membersList += `${idx + 1}. ${member.name} (${member.email})\n`;
        membersList += `   Joined: ${new Date(member.joinedAt).toLocaleDateString()}\n`;
    });

    console.log(membersList);
}

// Update group member availability
async function updateGroupAvailability(groupId, status) {
    try {
        const notes = prompt(`Update availability to "${status}". Add notes (optional):`);
        
        const result = await apiCall(`/groups/${groupId}/update-availability`, 'POST', {
            status,
            notes: notes || ''
        });

        console.log('✓ Availability updated:', result);
        alert(`✓ Your availability is now "${status}"`);
    } catch (error) {
        console.error('Update availability error:', error);
        alert(`Failed to update: ${error.message}`);
    }
}

// Get group details
async function getGroupDetails(groupId) {
    try {
        const result = await apiCall(`/groups/${groupId}`);
        console.log('📍 Group Details:', result);
        
        let details = `👥 GROUP: ${result.groupName}\n`;
        details += `Creator: ${result.creatorName}\n`;
        details += `Members: ${result.memberCount}/${result.maxMembers}\n`;
        details += `Share Code: ${result.shareCode}\n\n`;
        details += `Members:\n`;
        result.members.forEach((m, i) => {
            details += `  ${i + 1}. ${m.name} - ${m.status}\n`;
        });

        alert(details);
        return result;
    } catch (error) {
        console.error('Get group error:', error);
        alert(`Failed to get group: ${error.message}`);
    }
}

// ============ REFERRAL SYSTEM ============

// Generate referral link
async function generateReferralLink() {
    const user = getCurrentUser();
    if (!user) {
        alert('Please log in first');
        return;
    }

    try {
        const result = await apiCall('/referral/generate-link', 'POST', {});
        console.log('✓ Referral link generated:', result);

        // Show dialog with copy option
        showReferralDialog(result.referralCode, result.referralLink);
    } catch (error) {
        console.error('Referral error:', error);
        alert(`Failed to generate link: ${error.message}`);
    }
}

// Show referral sharing dialog
function showReferralDialog(referralCode, referralLink) {
    const shareText = `
🎉 Join Field Trip Club Kenya through my referral link!
${referralLink}

Referral Code: ${referralCode}

Get bonus points when you join and complete your first trip!
    `;

    console.log('🎯 REFERRAL LINK:\n', shareText);

    // Show referral link in alert
    alert(`
🎯 YOUR REFERRAL LINK

Share this with friends to earn rewards!

Link: ${referralLink}

Code: ${referralCode}

✓ Link copied to console. Share it with your friends!
    `);
}

// Track referral completion
async function trackReferral(referralCode) {
    try {
        const result = await apiCall('/referral/track', 'POST', { referralCode });
        console.log('✓ Referral tracked:', result);
        alert(`✓ Referral applied!\nReferrer earned: ${result.referrerReward} points\nYour bonus: ${result.yourBonus} points`);
    } catch (error) {
        console.error('Track referral error:', error);
        alert(`Referral tracking failed: ${error.message}`);
    }
}

// ============ REWARDS & GAMIFICATION ============

// Get user rewards and badges
async function getUserRewards() {
    const user = getCurrentUser();
    if (!user) {
        alert('Please log in first');
        return;
    }

    try {
        const result = await apiCall('/rewards/user-rewards');
        console.log('🏆 User Rewards:', result);

        let rewardText = `🏆 YOUR REWARDS & ACHIEVEMENTS\n\n`;
        rewardText += `⭐ Points: ${result.points || 0}\n`;
        rewardText += `🎖️ Badges: ${result.badges?.length || 0}\n`;
        rewardText += `📍 Groups Created: ${result.groupsCreated || 0}\n`;
        rewardText += `👥 Groups Joined: ${result.groupsJoined || 0}\n`;
        rewardText += `🎯 Referrals: ${result.referralCount || 0}\n`;
        rewardText += `🚀 Trips Completed: ${result.tripsCompleted || 0}\n\n`;

        if (result.badges && result.badges.length > 0) {
            rewardText += `🎖️ BADGES EARNED:\n`;
            result.badges.forEach(badge => {
                rewardText += `  ${badge.icon} ${badge.name} - ${badge.description}\n`;
            });
        } else {
            rewardText += `No badges earned yet. Keep exploring!\n`;
        }

        alert(rewardText);
        return result;
    } catch (error) {
        console.error('Rewards error:', error);
        alert(`Failed to get rewards: ${error.message}`);
    }
}

// Get leaderboard
async function showLeaderboard() {
    try {
        const result = await apiCall('/leaderboard');
        console.log('🏅 Leaderboard:', result);

        let leaderboardText = `🏅 TOP EXPLORERS LEADERBOARD\n\n`;
        leaderboardText += `Total Users: ${result.totalUsers}\n\n`;

        result.leaderboard.slice(0, 20).forEach(entry => {
            leaderboardText += `${entry.rank}. ${entry.name} - ${entry.points} points\n`;
            leaderboardText += `   Badges: ${entry.badges} | Referrals: ${entry.referrals} | Groups: ${entry.groupsCreated}\n`;
        });

        alert(leaderboardText);
        return result;
    } catch (error) {
        console.error('Leaderboard error:', error);
        alert(`Failed to get leaderboard: ${error.message}`);
    }
}

// ============ PAYMENT → TICKET → QR CODE FLOW ============

// Generate ticket after payment
async function generateTicket(tripId, paymentId, amount) {
    try {
        const result = await apiCall('/tickets/generate', 'POST', {
            tripId,
            paymentId,
            amount
        });

        console.log('🎫 Ticket Generated:', result);
        showTicketAndQRCode(result.ticket);
        return result;
    } catch (error) {
        console.error('Ticket generation error:', error);
        alert(`Failed to generate ticket: ${error.message}`);
    }
}

// Show ticket and QR code
function showTicketAndQRCode(ticket) {
    let ticketText = `
🎫 YOUR TRIP TICKET

Ticket ID: ${ticket.ticketId}
Trip: ${ticket.tripName}
Date: ${ticket.tripDate}
Passenger: ${ticket.buyerName}
Status: ${ticket.status}

⚠️ Keep this ticket safe. You'll need it at the trip start point.
    `;

    console.log(ticketText);
    alert(ticketText);

    // Store in localStorage for later access
    const tickets = JSON.parse(localStorage.getItem('myTickets') || '[]');
    tickets.push({
        ticketId: ticket.ticketId,
        tripName: ticket.tripName,
        tripDate: ticket.tripDate,
        buyerName: ticket.buyerName,
        generatedAt: new Date()
    });
    localStorage.setItem('myTickets', JSON.stringify(tickets));
}

// Get ticket details
async function getTicketDetails(ticketId) {
    try {
        const result = await apiCall(`/tickets/${ticketId}`);
        console.log('🎫 Ticket Details:', result);

        let ticketText = `
🎫 TICKET DETAILS

Ticket ID: ${result.ticket.ticketId}
Trip: ${result.ticket.trip.name}
Date: ${result.ticket.trip.date}
Location: ${result.ticket.trip.location}
Cost: KES ${result.ticket.trip.cost.toLocaleString()}
Passenger: ${result.ticket.buyerName}
Status: ${result.ticket.status}
Valid Until: ${new Date(result.ticket.validUntil).toLocaleDateString()}
        `;

        alert(ticketText);
        return result;
    } catch (error) {
        console.error('Ticket error:', error);
        alert(`Failed to get ticket: ${error.message}`);
    }
}

// Show all user tickets
function showMyTickets() {
    const tickets = JSON.parse(localStorage.getItem('myTickets') || '[]');

    if (tickets.length === 0) {
        alert('You have no tickets yet. Complete a payment to get a ticket!');
        return;
    }

    let ticketsText = `🎫 MY TICKETS (${tickets.length})\n\n`;
    tickets.forEach((ticket, idx) => {
        ticketsText += `${idx + 1}. ${ticket.tripName}\n`;
        ticketsText += `   Date: ${ticket.tripDate}\n`;
        ticketsText += `   Passenger: ${ticket.buyerName}\n`;
        ticketsText += `   Ticket ID: ${ticket.ticketId}\n\n`;
    });

    alert(ticketsText);
    console.log('My Tickets:', tickets);
}

// Verify ticket (for scanning)
async function verifyTicket(ticketId) {
    try {
        const result = await apiCall('/tickets/verify', 'POST', { ticketId });
        console.log('✓ Ticket verified:', result);
        alert(`✓ Ticket verified!\nPassenger: ${result.ticket.buyerName}\nTrip: ${result.ticket.tripName}`);
    } catch (error) {
        console.error('Verify error:', error);
        alert(`Verification failed: ${error.message}`);
    }
}

// ============ UTILITY FUNCTIONS ============

// Copy to clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('✓ Copied to clipboard:', text);
        alert('✓ Copied to clipboard!');
    }).catch(err => {
        console.error('Copy error:', err);
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('✓ Copied to clipboard!');
    });
}

// Share on social media (placeholder)
function shareOnSocial(url) {
    const message = encodeURIComponent(`Join Field Trip Club Kenya! ${url}`);
    const platforms = {
        'whatsapp': `https://wa.me/?text=${message}`,
        'twitter': `https://twitter.com/intent/tweet?text=${message}`,
        'facebook': `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    };

    console.log('📤 Share options:', platforms);
    alert('Share links available in console. Choose WhatsApp, Twitter, or Facebook!');
}

// ============ INITIALIZATION ============

document.addEventListener('DOMContentLoaded', updateNavigation);

