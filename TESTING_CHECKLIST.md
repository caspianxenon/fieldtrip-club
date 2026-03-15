# Field Trip Club - Complete Testing Checklist

## Prerequisites Checklist
- [ ] Node.js installed and working (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] All files downloaded to project folder
- [ ] .env file created with Gmail credentials
- [ ] Dependencies installed (`npm install` completed)

---

## Backend Startup Test

### Start Backend Server
```bash
npm start
```

Expected output:
```
✓ Field Trip Club Backend running on http://localhost:5000
✓ Environment: development
✓ Email service: gmail
```

- [ ] Backend starts without errors
- [ ] Console shows all 3 ✓ messages
- [ ] Server running on http://localhost:5000

### Test Backend Health Check
Open in browser: `http://localhost:5000/api/trips`

Expected: See JSON array of 4 trips
- [ ] JSON loads without errors
- [ ] Contains trip data (Maasai Mara, Mount Kenya, etc.)

---

## Frontend Startup Test

### Start Frontend Server
```bash
python -m http.server 3000
```

Expected output:
```
Serving HTTP on 0.0.0.0 port 3000 (http://0.0.0.0:3000/) ...
```

- [ ] Frontend server starts
- [ ] No errors in console
- [ ] Server running on http://localhost:3000

### Open Website
Go to: `http://localhost:3000`

- [ ] Homepage loads
- [ ] Navigation bar visible
- [ ] Featured trips display
- [ ] No CSS styling errors
- [ ] Responsive on mobile (F12 → toggle device toolbar)

---

## Navigation Test

- [ ] Home link works
- [ ] Trips link works
- [ ] Register link works
- [ ] Contact link works
- [ ] Active page highlighted in navbar

---

## Registration Flow - Excursor

### Go to Register Page
- [ ] Click "Register" in navbar
- [ ] User type selection page appears

### Select Excursor Type
- [ ] Click "Choose Excursor" button
- [ ] Excursor form appears

### Fill Registration Form
```
Name: Test Excursor User
Email: excursor@example.com
Phone: +254712345678
Password: TestPass123!
Confirm Password: TestPass123!
```

- [ ] All fields are visible
- [ ] Can type in all fields
- [ ] Form validates (no special chars in password if required)

### Submit Form
- [ ] Click "Sign Up as Excursor"
- [ ] OTP page appears
- [ ] Shows correct email: excursor@example.com

### Verify OTP
- [ ] Check backend terminal for OTP (format: 6 digits)
- [ ] Copy OTP
- [ ] Enter in OTP input field
- [ ] Click "Verify Email"

Expected: Success message
- [ ] "Registration Complete!" appears
- [ ] Shows Excursor account created message
- [ ] Button to login appears

---

## Registration Flow - Event Holder (Full Flow)

### Go to Register Page
- [ ] Click "Register" in navbar

### Select Event Holder Type
- [ ] Click "Become Event Holder" button
- [ ] Event Holder form appears
- [ ] "What Happens Next" info box shows 4 steps

### Fill Registration Form
```
Name: Test Event Holder
Email: organizer@example.com
Phone: +254712345678
Password: OrgPass123!
Confirm Password: OrgPass123!
```

- [ ] All fields visible
- [ ] Phone field pre-filled correctly

### Submit Event Holder Form
- [ ] Click "Continue to Registration"
- [ ] OTP page appears

### Verify OTP for Event Holder
- [ ] Get OTP from backend terminal
- [ ] Enter OTP
- [ ] Click "Verify Email"
- [ ] Redirects to KYC page

Expected: KYC form appears
- [ ] Shows "KYC Verification (Required for Event Holders)"
- [ ] Has 4 input fields:
  - [ ] National ID Number
  - [ ] First Name
  - [ ] Last Name
  - [ ] Date of Birth

### Fill KYC Form
```
National ID: 12345678
First Name: John
Last Name: Doe
Date of Birth: 1990-01-15
```

- [ ] All fields accept input
- [ ] Date picker works

### Submit KYC
- [ ] Click "Start KYC Verification"
- [ ] Redirects to Payment page

Expected: Payment page appears
- [ ] Shows "Complete Payment" heading
- [ ] Shows "KES 999" amount clearly
- [ ] Has payment instructions
- [ ] Phone field pre-filled with registered number

### Initiate MPesa Payment
- [ ] Click "Initiate MPesa Payment"
- [ ] Browser confirmation dialog appears: "Simulate successful payment?"

### Simulate Payment Success
- [ ] Click "OK" on confirmation
- [ ] Payment success message appears
- [ ] Shows "Your Event Holder account has been activated"
- [ ] "Go to Dashboard" button appears

---

## Login Flow with OTP

### Go to Login
- [ ] Click "Login" in navbar
- [ ] Login form appears with Email and Password fields

### Login as Excursor
```
Email: excursor@example.com
Password: TestPass123!
```

- [ ] Enter credentials
- [ ] Click "Sign In"
- [ ] Redirects to OTP verification page

### Verify OTP
- [ ] Get OTP from backend terminal
- [ ] Enter 6-digit OTP
- [ ] Click "Verify OTP"
- [ ] Redirects to Dashboard

Expected: Dashboard loads
- [ ] Shows user name and email
- [ ] Shows account type: Excursor
- [ ] Shows status: Verified

---

## Trips Page - Excursor View

### View Trips
- [ ] Go to Trips page
- [ ] All 4 demo trips display
- [ ] Each trip shows:
  - [ ] Trip name with emoji
  - [ ] Date
  - [ ] Location
  - [ ] Description
  - [ ] Current cost in KES
  - [ ] Registered count (e.g., "14/20")
  - [ ] "Join Trip" button

### Join Trip
- [ ] Click "Join Trip" on any trip
- [ ] Success message appears
- [ ] Shows trip details
- [ ] Click OK

Expected: Trip joined
- [ ] User added to trip roster
- [ ] Can re-join same trip or different ones

---

## Trips Page - Event Holder View

### Login as Event Holder
- [ ] Already logged in from registration
- [ ] Check Dashboard shows:
  - [ ] KYC Status: Verified
  - [ ] Payment Status: Completed
  - [ ] Trips Created: 0

### Create Trip
In "Create New Trip" form, fill:
```
Trip Name: Safari Adventure Test
Date: 2026-07-20
Location: Serengeti
Description: Amazing safari experience
Cost (KES): 7500
Capacity: 15
```

- [ ] All fields fill correctly
- [ ] Click "Create Trip"
- [ ] Success message appears

Expected: Trip created
- [ ] Appears in "My Trips" section
- [ ] Shows correct details
- [ ] Shows "0/15" participants

### Edit Trip Cost
- [ ] Find the trip you created
- [ ] Click "Edit Cost" button
- [ ] Input field appears
- [ ] Enter new cost: 7999
- [ ] Click "Save"

Expected: Cost updates immediately
- [ ] Display shows new cost: KES 7,999
- [ ] No page reload needed
- [ ] Success message confirms update

### Create Another Trip
- [ ] Create second trip to test multiple
- [ ] "Trips Created" count updates to 2

---

## Dashboard - Excursor

### Login as Excursor
- [ ] Navigate to Dashboard
- [ ] Shows profile section:
  - [ ] Name: Test Excursor User
  - [ ] Email: excursor@example.com
  - [ ] Account Type: Excursor
  - [ ] Status: Verified

### View Joined Trips
- [ ] "My Trips" section shows joined trips
- [ ] Each trip shows:
  - [ ] Trip name with emoji
  - [ ] Date
  - [ ] Location
  - [ ] Cost

Expected:
- [ ] If no trips joined: "You haven't joined any trips yet"
- [ ] If trips joined: Shows all joined trips

---

## Dashboard - Event Holder

### Verify Status Display
- [ ] KYC Status: Verified (green badge)
- [ ] Payment Status: Completed (green badge)
- [ ] Trips Created: Shows correct count

### View Created Trips
- [ ] "My Trips" section shows all created trips
- [ ] Each trip shows:
  - [ ] Trip name
  - [ ] Date
  - [ ] Location
  - [ ] Registered count (e.g., "0/15")
  - [ ] Current cost
  - [ ] "Edit Cost" button

---

## Responsive Design Test

### Mobile View (F12 → Toggle device toolbar)
Test on iPhone 12 (390x844):
- [ ] Navigation collapses properly
- [ ] Forms stack vertically
- [ ] Buttons are clickable (50px min)
- [ ] Text is readable (no overflow)
- [ ] Images scale properly

### Tablet View
Test on iPad (768x1024):
- [ ] Layout adjusts
- [ ] 2-column grids reduce to 1-2 columns
- [ ] Forms are easy to fill

### Desktop View
Test on 1920x1080:
- [ ] Full layout displays
- [ ] Multi-column grids work
- [ ] Spacing looks professional

---

## API Endpoint Tests

### Test Trips Endpoint
```
GET http://localhost:5000/api/trips
```
- [ ] Returns JSON array
- [ ] Contains 4 demo trips
- [ ] Each trip has: id, name, date, location, cost, capacity, registered

### Test Profile Endpoint (after login)
```
GET http://localhost:5000/api/user/profile
Authorization: Bearer {your_token}
```
- [ ] Returns user data
- [ ] Includes: email, name, userType, verified status

---

## Error Handling Test

### Invalid Email on Login
```
Email: nonexistent@example.com
Password: anything
```
- [ ] Shows error: "User not found"
- [ ] Doesn't crash
- [ ] Can retry

### Wrong OTP
- [ ] Enter wrong 6 digits
- [ ] Shows error: "Invalid OTP"
- [ ] Can try again

### Password Mismatch on Register
```
Password: TestPass123!
Confirm: DifferentPass!
```
- [ ] Shows error before submission
- [ ] Prevents form submission

### Expired OTP
- [ ] Wait 11 minutes after OTP sent
- [ ] Try to enter OTP
- [ ] Shows error: "OTP expired"

---

## Browser Developer Tools Test

### Open Console (F12)
- [ ] No JavaScript errors (red messages)
- [ ] No CORS errors
- [ ] No "Cannot GET /api" errors

### Network Tab (F12)
- [ ] All API calls show 200 status
- [ ] No failed requests
- [ ] Response times reasonable (<1s)

### Application Tab (F12)
Check localStorage:
- [ ] `token` exists after login
- [ ] `currentUser` exists after login
- [ ] Can see user data in currentUser

---

## Performance Test

### Page Load Times
- [ ] Homepage: < 2s
- [ ] Trips page: < 2s
- [ ] Dashboard: < 2s
- [ ] Register page: < 1s

### API Response Times
- [ ] GET /trips: < 500ms
- [ ] POST /auth/signup: < 1s
- [ ] POST /trips/:id/join: < 500ms

---

## Security Test

### Session Persistence
- [ ] Refresh page → Stay logged in
- [ ] Close tab → Can log back in
- [ ] Logout → Redirects to home
- [ ] Access /dashboard without login → Redirects to login

### Token Storage
- [ ] localStorage contains JWT
- [ ] Token sent in Authorization header
- [ ] Token expires after 1 hour (if implemented)

### Password Security
- [ ] Password hashed (never shown in localStorage)
- [ ] Can't access other user's dashboard
- [ ] Can't edit other user's trips

---

## Data Persistence Test

### Create Data
- [ ] Create trip as Event Holder
- [ ] Join trip as Excursor
- [ ] Refresh page
- [ ] Data still there

### Update Data
- [ ] Change trip cost
- [ ] Refresh page
- [ ] Cost update persists

---

## Contact Page Test

### Navigate to Contact
- [ ] Click Contact in navbar
- [ ] Contact form displays

### Fill Contact Form
```
Name: Test User
Email: test@example.com
Subject: Testing the form
Message: This is a test message
```

- [ ] All fields accept input

### Submit Form
- [ ] Click "Send Message"
- [ ] Success message appears
- [ ] Form disappears
- [ ] Shows confirmation

---

## Summary Results

Total tests: _____ / 150+

Passing: _____ (%)
Failing: _____ (%)

### Issues Found
```
1. 
2. 
3. 
```

### Notes
```

```

---

## Sign-Off

Date: ___________
Tester: ___________
Status: [ ] PASS [ ] FAIL

---

**All tests passed? Congratulations! 🎉 Your Field Trip Club website is ready to deploy!**
