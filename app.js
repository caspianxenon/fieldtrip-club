// app.js - must be loaded after supabase.min.js
const supabaseUrl = "https://pfwswcbysfeprsbazjrn.supabase.co";
const supabaseKey = "sb_publishable_mI5DzSsjUZ1enmDjgPwuAA_YSS4GrwB";
const supabase = supabase.createClient(supabaseUrl, supabaseKey);;

// Register form
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else {
      alert("Registered! Check your email.");
      window.location.href = "login.html";
    }
  });
}

// Login form
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert(error.message);
    else window.location.href = "dashboard.html";
  });
}

// Check logged-in session for dashboard
if (window.location.pathname.includes("dashboard.html")) {
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (!session) window.location.href = "login.html";
  });
}