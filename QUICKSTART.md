## 🚀 QUICK START GUIDE

Get the Field Trip Club website running in 5 minutes!

### Prerequisites
- Node.js installed (https://nodejs.org/)
- A Gmail account (for OTP emails)

---

## STEP-BY-STEP

### 1️⃣ Install Dependencies (2 minutes)

Open PowerShell/Terminal in the project folder and run:

```bash
npm install
```

Wait for all packages to install.

---

### 2️⃣ Create .env File (1 minute)

Create a new file called `.env` in the project root with:

```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

JWT_SECRET=mysecretkey123456789012345678901234567890
```

**For EMAIL_PASSWORD**:
1. Go to https://myaccount.google.com/apppasswords
2. Generate app password for Mail/Windows
3. Copy the 16-character password to EMAIL_PASSWORD

---

### 3️⃣ Start Backend (1 minute)

In PowerShell, run:

```bash
npm start
```

You should see:
```
✓ Field Trip Club Backend running on http://localhost:5000
```

**Keep this terminal open!**

---

### 4️⃣ Start Frontend (1 minute)

Open a NEW PowerShell window in the project folder:

```bash
python -m http.server 3000
```

Or use VS Code Live Server:
1. Install "Live Server" extension
2. Right-click index.html → Open with Live Server

---

### 5️⃣ Test the Website

Open your browser and go to:

**http://localhost:3000**

---

## 🧪 TEST THESE FLOWS

### Test 1: Register as Excursor
1. Click "Register"
2. Choose "Excursor"
3. Fill form and submit
4. Check terminal/console for OTP (format: 6 digits)
5. Enter OTP → Account created!
6. Go to Trips → Click "Join Trip"

### Test 2: Register as Event Holder
1. Click "Register"
2. Choose "Event Holder"
3. Fill form with phone +254712345678
4. Submit → OTP page
5. Enter OTP from console
6. KYC page → Fill with any ID data
7. Payment page → Click "Initiate MPesa"
8. Browser asks "Simulate payment?" → Click OK
9. Dashboard appears → Create a trip!

### Test 3: Edit Trip Cost
1. As Event Holder on Dashboard
2. Find "My Trips" section
3. Click "Edit Cost" on a trip
4. Change cost → Click Save
5. Cost updates immediately!

---

## ⚠️ COMMON ISSUES & FIXES

### "OTP not appearing"
```
Check the backend terminal (where you ran npm start)
Look for: "Demo Mode - OTP for user@email.com: 123456"
```

### "API not connecting"
```
1. Backend running? (npm start in first terminal)
2. Frontend running? (http.server or Live Server)
3. Backend on port 5000, Frontend on port 3000
```

### "Email not sending"
```
1. Is it Gmail? Check EMAIL_USER and EMAIL_PASSWORD in .env
2. Use app password, not regular password
3. Check spam folder
```

### "Port already in use"
```
Windows: netstat -ano | findstr :5000
Kill the process: taskkill /PID <number> /F
Or change PORT in .env to 5001
```

---

## 📁 FILE STRUCTURE

```
Frontend (HTML/CSS/JS - Open in browser):
  index.html          Homepage
  register.html       Sign up (choose type)
  login.html          Sign in with OTP
  trips.html          Browse trips
  dashboard.html      User dashboard
  contact.html        Contact form
  style.css           All styling
  script.js           All JavaScript logic

Backend (Node.js - Runs in terminal):
  server.js           API server (Port 5000)
  package.json        Dependencies
  .env                Configuration (create yourself)
```

---

## 🔐 DEFAULT DEMO DATA

Some demo trips are pre-loaded:
- Maasai Mara Safari - KES 8,500
- Mount Kenya Trek - KES 12,000
- Mombasa Beach - KES 6,000
- Hell's Gate Park - KES 5,000

---

## 📝 NEXT STEPS

After testing locally:

1. **Add Real KYC API** (See README.md)
2. **Add Real MPesa API** (See README.md)
3. **Deploy to Server** (Heroku, Vercel, etc.)
4. **Use Real Database** (Firebase, MongoDB, etc.)

---

## 🎯 WHAT TO TRY

1. ✅ Register as both user types
2. ✅ Verify OTP from console
3. ✅ Complete KYC flow
4. ✅ Simulate MPesa payment
5. ✅ Join trips as Excursor
6. ✅ Create trip as Event Holder
7. ✅ Edit trip cost dynamically
8. ✅ Login with OTP
9. ✅ View dashboard stats

---

## 📞 NEED HELP?

1. Check **README.md** for full documentation
2. Check **BACKEND_SETUP.md** for server details
3. Check browser **Console** (F12) for errors
4. Check backend **Terminal** for server errors

---

**You're all set! Enjoy building! 🎉**

Questions? Check the main README.md file for complete documentation.
