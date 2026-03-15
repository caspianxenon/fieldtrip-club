// ============================================
// FieldTrip Club - Supabase Authentication
// Load this AFTER supabase.min.js in HTML
// ============================================

const SUPABASE_URL = "https://pfwswcbysfeprsbazjrn.supabase.co";
const SUPABASE_KEY = "sb_publishable_mI5DzSsjUZ1enmDjgPwuAA_YSS4GrwB";

// Initialize Supabase client
// ⚠️ IMPORTANT: window.supabase is created by the CDN script
let supabase = null;

function initializeSupabase() {
  if (!window.supabase) {
    console.error('❌ Supabase library not loaded. Check CDN script.');
    return false;
  }

  try {
    supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    console.log('✅ Supabase initialized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to initialize Supabase:', error);
    return false;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeSupabase);
} else {
  // DOM already loaded
  setTimeout(initializeSupabase, 100);
}

// ============================================
// REGISTRATION HANDLER
// ============================================

function setupRegisterForm() {
  const form = document.getElementById('register-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!supabase) {
      alert('❌ Supabase not initialized. Please refresh page.');
      return;
    }

    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm-password').value;

    // Validation
    if (!email) {
      alert('❌ Please enter email');
      return;
    }

    if (password.length < 6) {
      alert('❌ Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      alert('❌ Passwords do not match');
      return;
    }

    // Show loading state
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Creating account...';

    try {
      console.log('📝 Attempting to register:', email);

      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password
      });

      if (error) {
        console.error('❌ Registration error:', error);
        alert('❌ Registration failed:\n' + error.message);
        return;
      }

      console.log('✅ Registration successful:', email);
      alert('✅ Registration successful! Check your email to confirm, then login.');

      // Clear form
      form.reset();

      // Redirect after 2 seconds
      setTimeout(() => {
        window.location.href = 'login.html';
      }, 2000);

    } catch (error) {
      console.error('❌ Unexpected error:', error);
      alert('❌ Error: ' + error.message);
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
}

// ============================================
// LOGIN HANDLER
// ============================================

function setupLoginForm() {
  const form = document.getElementById('login-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!supabase) {
      alert('❌ Supabase not initialized. Please refresh page.');
      return;
    }

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;

    // Validation
    if (!email || !password) {
      alert('❌ Please enter email and password');
      return;
    }

    // Show loading state
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Signing in...';

    try {
      console.log('🔑 Attempting to login:', email);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) {
        console.error('❌ Login error:', error);
        alert('❌ Login failed:\n' + error.message);
        return;
      }

      console.log('✅ Login successful:', email);
      alert('✅ Login successful! Redirecting to dashboard...');

      // Redirect to dashboard
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);

    } catch (error) {
      console.error('❌ Unexpected error:', error);
      alert('❌ Error: ' + error.message);
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });
}

// ============================================
// DASHBOARD PROTECTION
// ============================================

async function checkDashboardAuth() {
  if (!supabase) {
    console.warn('⚠️  Supabase not ready, retrying...');
    setTimeout(checkDashboardAuth, 500);
    return;
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      console.warn('⚠️  No session found, redirecting to login');
      alert('❌ You must login to access the dashboard');
      window.location.href = 'login.html';
      return;
    }

    console.log('✅ Dashboard access granted for:', session.user.email);

    // Show user info
    const userEmailElement = document.getElementById('user-email');
    if (userEmailElement) {
      userEmailElement.textContent = session.user.email;
    }

  } catch (error) {
    console.error('❌ Auth check error:', error);
    window.location.href = 'login.html';
  }
}

// ============================================
// LOGOUT HANDLER
// ============================================

async function handleLogout() {
  if (!supabase) {
    console.error('❌ Supabase not initialized');
    return;
  }

  try {
    console.log('🚪 Logging out...');
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error('❌ Logout error:', error);
      alert('❌ Logout failed: ' + error.message);
      return;
    }

    console.log('✅ Logout successful');
    alert('✅ Logged out successfully');
    window.location.href = 'index.html';

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    alert('❌ Error: ' + error.message);
  }
}

// ============================================
// INITIALIZE BASED ON PAGE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  console.log('📄 Page loaded:', window.location.pathname);

  // Setup forms based on current page
  if (document.body.classList.contains('register-page')) {
    setupRegisterForm();
  }

  if (document.body.classList.contains('login-page')) {
    setupLoginForm();
  }

  if (document.body.classList.contains('dashboard-page')) {
    checkDashboardAuth();
  }
});

console.log('✅ app.js loaded');
