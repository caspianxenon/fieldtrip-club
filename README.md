# Field Trip Club Kenya - Complete Setup Guide

A full-stack field trip booking platform with user authentication, KYC verification, MPesa payments, and event management.

## 📋 Table of Contents

1. [Features](#features)
2. [Project Structure](#project-structure)
3. [Prerequisites](#prerequisites)
4. [Installation](#installation)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [API Documentation](#api-documentation)
8. [Testing Flows](#testing-flows)
9. [Replacing Placeholders](#replacing-placeholders)
10. [Troubleshooting](#troubleshooting)

## ✨ Features

### User Types

**Excursor (Regular User)**
- Free registration
- Email verification via OTP
- Browse and join trips
- View trip details and costs

**Event Holder (Trip Organizer)**
- Complete KYC verification with government ID
- Pay KES 999 registration fee via MPesa
- Create and manage trips
- Edit trip costs dynamically
- View trip registrations and earnings

### Core Features

- 🔐 **Authentication**: Email/OTP-based login and registration
- ✅ **KYC Verification**: Free API integration for identity verification
- 💳 **MPesa Payment**: Till-based payment for Event Holders
- 🗺️ **Trip Management**: Create, edit, and manage field trips
- 👥 **User Dashboard**: Personalized dashboard for both user types
- 📱 **Responsive Design**: Mobile-friendly interface
- 🛡️ **Secure**: JWT tokens, password hashing, CORS protection

## 📁 Project Structure

```
fieldtrip-club/
├── Frontend Files
│   ├── index.html              # Homepage
│   ├── register.html           # Registration page (Excursor + Event Holder flows)
│   ├── login.html              # Login page
│   ├── trips.html              # Browse trips
│   ├── dashboard.html          # User dashboard
│   ├── contact.html            # Contact page
│   ├── style.css               # Styling for all pages
│   └── script.js               # Frontend logic & API calls
│
├── Backend Files
│   ├── server.js               # Express server & API routes
│   ├── package.json            # Node.js dependencies
│   ├── .env                    # Environment variables (create this)
│   ├── BACKEND_SETUP.md        # Backend setup instructions
│   └── README.md               # This file
│
└── Database (Choose one)
    ├── Firebase Firestore      # Recommended for beginners
    └── MongoDB Atlas           # Alternative option
```

## 📦 Prerequisites

### Required

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Comes with Node.js
- **Code Editor** - VS Code recommended

### For Full Functionality

- **Gmail Account** (for OTP emails) - [Gmail](https://mail.google.com/)
- **Firebase Account** or **MongoDB Atlas** (for database) - [Firebase](https://firebase.google.com/) / [MongoDB](https://www.mongodb.com/)
- **Phone Number** (for MPesa testing)
- **National ID** (for KYC testing)

## 🚀 Installation

### Step 1: Download/Clone the Project

If you haven't already, download all files into your project directory:
```bash
c:\Users\LENOVO\OneDrive\Documents\fieldtrip-club\
```

### Step 2: Install Node.js Dependencies

Open a terminal/PowerShell in the project directory and run:

```bash
npm install
```

This will install all required packages listed in `package.json`:
- express
- cors
- dotenv
- bcryptjs
- jsonwebtoken
- nodemailer
- firebase-admin

### Step 3: Create Environment File

Create a new file named `.env` in the root directory (same level as `server.js`):

```bash
# Using PowerShell in the project directory
New-Item -Path .env -ItemType File
```

Add the following content to `.env`:

```
# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Email Configuration (Gmail)
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# JWT Configuration
JWT_SECRET=your_secret_key_at_least_32_characters_long_please

# Database (Firebase OR MongoDB)
# Firebase Option (Recommended)
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

# OR MongoDB Option
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fieldtrip

# KYC Configuration (Placeholder - see Replacing Placeholders section)
KYC_API_KEY=placeholder_get_from_kyc_provider
KYC_API_URL=https://sandbox.api.example.com/kyc

# MPesa Configuration (Placeholder - see Replacing Placeholders section)
MPESA_TILL_NUMBER=123456
MPESA_API_KEY=placeholder_key_get_from_provider
MPESA_SANDBOX_URL=https://sandbox.mpesa.co.ke/api
```

## ⚙️ Configuration

### Gmail Setup for OTP Emails

1. **Enable 2-Step Verification**:
   - Go to https://myaccount.google.com/
   - Click "Security" in left menu
   - Enable "2-Step Verification"

2. **Generate App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Windows Computer"
   - Google will generate a 16-character password
   - Copy this to `EMAIL_PASSWORD` in `.env`

### Firebase Setup (Recommended)

1. **Create Firebase Project**:
   - Go to https://firebase.google.com/
   - Click "Go to console"
   - Create a new project

2. **Get Service Account Key**:
   - In Firebase Console, go to Project Settings
   - Go to "Service Accounts" tab
   - Click "Generate new private key"
   - Copy the JSON file contents

3. **Add to .env**:
   ```
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...your key...\n-----END PRIVATE KEY-----\n
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
   ```

### MongoDB Setup (Alternative)

1. **Create MongoDB Atlas Cluster**:
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up (free tier available)
   - Create a cluster
   - Create a database user

2. **Get Connection String**:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Add to `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fieldtrip
   ```

## ▶️ Running the Application

### Terminal 1: Start Backend Server

```bash
# Navigate to project directory
cd C:\Users\LENOVO\OneDrive\Documents\fieldtrip-club

# Start the server
npm start

# For development with hot reload
npm run dev
```

Expected output:
```
✓ Field Trip Club Backend running on http://localhost:5000
✓ Environment: development
✓ Email service: gmail
```

### Terminal 2: Open Frontend (No Build Step Needed)

Since this is vanilla HTML/CSS/JS, you can use Python's built-in server:

```bash
# In the same project directory
python -m http.server 3000
```

Or use VS Code's Live Server extension:
1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

**Frontend URL**: http://localhost:3000 or http://127.0.0.1:3000

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### 1. Sign Up
```http
POST /auth/signup

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phone": "+254712345678",
  "userType": "excursor"  // or "event_holder"
}

Response:
{
  "message": "User registered. OTP sent to email.",
  "userType": "excursor",
  "email": "john@example.com",
  "requiresKYC": false
}
```

#### 2. Verify OTP
```http
POST /auth/verify-otp

{
  "email": "john@example.com",
  "otp": "123456"
}

Response:
{
  "message": "OTP verified",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "email": "john@example.com",
    "name": "John Doe",
    "userType": "excursor",
    "kycStatus": "not_required",
    "paymentStatus": "completed"
  }
}
```

#### 3. Login
```http
POST /auth/login

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}

Response:
{
  "message": "OTP sent to email",
  "email": "john@example.com"
}
```

### KYC Endpoints (Event Holders Only)

#### Start KYC Verification
```http
POST /kyc/start
Authorization: Bearer {token}

{
  "nationalId": "12345678",
  "firstName": "Jane",
  "lastName": "Organizer",
  "dateOfBirth": "1990-05-15"
}

Response:
{
  "message": "KYC verification passed",
  "status": "verified"
}
```

### Payment Endpoints (Event Holders Only)

#### Initiate MPesa Payment
```http
POST /payment/mpesa
Authorization: Bearer {token}

Response:
{
  "message": "Payment initiated",
  "paymentDetails": {
    "amount": 999,
    "phone": "+254712345678",
    "tillNumber": "123456",
    "status": "pending"
  },
  "transactionId": "TXN123456"
}
```

#### Verify Payment
```http
POST /payment/verify
Authorization: Bearer {token}

{
  "transactionId": "TXN123456"
}

Response:
{
  "message": "Payment verified",
  "status": "completed"
}
```

### Trips Endpoints

#### Get All Trips
```http
GET /trips

Response:
[
  {
    "id": 1,
    "name": "Maasai Mara Safari",
    "date": "2026-04-15",
    "location": "Maasai Mara",
    "description": "Wildlife safari",
    "cost": 8500,
    "capacity": 20,
    "registered": 14,
    "createdBy": "user123"
  }
]
```

#### Create Trip (Event Holder Only)
```http
POST /trips
Authorization: Bearer {token}

{
  "name": "Nairobi City Tour",
  "date": "2026-06-01",
  "location": "Nairobi",
  "description": "Explore the capital city",
  "cost": 3000,
  "capacity": 25
}

Response:
{
  "id": 7,
  "name": "Nairobi City Tour",
  "cost": 3000,
  "registered": 0,
  ...
}
```

#### Update Trip Cost (Event Holder Only)
```http
PUT /trips/:id
Authorization: Bearer {token}

{
  "cost": 3500
}
```

#### Join Trip (Excursor Only)
```http
POST /trips/:id/join
Authorization: Bearer {token}

Response:
{
  "message": "Successfully joined trip",
  "trip": { ... },
  "userTrips": [1, 2, 5]
}
```

## 🧪 Testing Flows

### Test Flow 1: Excursor Registration & Trip Joining

1. **Open** http://localhost:3000/register.html
2. **Click** "Choose Excursor"
3. **Fill form**:
   - Name: Test User
   - Email: test@example.com
   - Phone: +254712345678
   - Password: TestPass123!
4. **Submit** → OTP sent to email
5. **Check email** or server console for OTP
6. **Enter OTP** → Account created
7. **Go to** Trips page
8. **Click** "Join Trip" on any trip
9. **See** confirmation that you joined

### Test Flow 2: Event Holder Registration, KYC & Payment

1. **Open** http://localhost:3000/register.html
2. **Click** "Become Event Holder"
3. **Fill form**:
   - Name: Organizer Test
   - Email: organizer@example.com
   - Phone: +254712345678
   - Password: OrgPass123!
4. **Submit** → OTP sent
5. **Enter OTP** from email/console
6. **KYC Form**:
   - National ID: 12345678
   - First Name: John
   - Last Name: Smith
   - DOB: 1990-01-15
7. **Submit** → Moves to payment
8. **MPesa Payment**:
   - Phone: +254712345678
   - Click "Initiate MPesa Payment"
   - **Simulation**: Browser asks "Simulate successful payment?"
   - **Click OK** for success
   - Payment status updates → Dashboard
9. **Dashboard**: Create a new trip

### Test Flow 3: Event Holder Editing Trip Cost

1. **After completing Event Holder setup**, go to Dashboard
2. **In "Create New Trip" section**:
   - Name: Test Safari
   - Date: 2026-07-15
   - Location: Amboseli
   - Description: Test trip
   - Cost: 5000
   - Capacity: 20
3. **Click** "Create Trip"
4. **In "My Trips" section**, find the trip
5. **Click** "Edit Cost"
6. **Enter new cost**: 5500
7. **Click Save** → Cost updates immediately

### Test Flow 4: Login with OTP

1. **Open** http://localhost:3000/login.html
2. **Enter email & password** from registration
3. **Click "Sign In"** → OTP sent
4. **Enter OTP** from email/console
5. **Redirected to Dashboard**

## 🔄 Replacing Placeholders

### 1. KYC API Integration

**Current State**: Mock function returns 90% success rate

**To Integrate Real KYC Provider**:

1. **Choose a provider**:
   - [Smile ID](https://docs.smileid.com/) - African focus
   - [AuthentiAfrica](https://authenticafrica.com/) - Kenya-based
   - [SafetyRx](https://safetyrx.com/) - USSD integration
   - [USSD Gateway](https://safaricom.co.ke/) - Via Safaricom

2. **Get API credentials** from sandbox environment

3. **Replace in `server.js`** (line ~180):

   Current:
   ```javascript
   async function performKYCVerification(data) {
       console.log('Performing KYC verification for:', data);
       const mockSuccess = Math.random() > 0.1;
       return { success: mockSuccess };
   }
   ```

   Replace with:
   ```javascript
   async function performKYCVerification(data) {
       const response = await fetch('YOUR_KYC_API_URL', {
           method: 'POST',
           headers: {
               'Authorization': `Bearer ${process.env.KYC_API_KEY}`,
               'Content-Type': 'application/json'
           },
           body: JSON.stringify(data)
       });
       
       const result = await response.json();
       return {
           success: result.isVerified,
           reason: result.failureReason || null
       };
   }
   ```

4. **Update .env**:
   ```
   KYC_API_KEY=your_actual_api_key
   KYC_API_URL=https://api.provider.com/kyc/verify
   ```

### 2. MPesa Till Payment Integration

**Current State**: Mock function simulates payment prompt

**To Integrate Real MPesa API** (Daraja):

1. **Register with Safaricom**:
   - Go to https://developer.safaricom.co.ke/
   - Create consumer key/secret
   - Get Till number for testing

2. **Replace in `server.js`** (line ~210):

   Current:
   ```javascript
   async function initiateMPesaPayment(data) {
       console.log('Initiating MPesa payment:', data);
       return { transactionId: 'TXN' + Date.now() };
   }
   ```

   Replace with:
   ```javascript
   async function initiateMPesaPayment(data) {
       // Get access token
       const auth = Buffer.from(
           `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
       ).toString('base64');

       const tokenRes = await fetch(
           'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
           { headers: { 'Authorization': `Basic ${auth}` } }
       );
       const tokenData = await tokenRes.json();

       // Initiate STK push
       const timestamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '');
       const password = Buffer.from(
           `${process.env.MPESA_TILL_NUMBER}${process.env.MPESA_PASSKEY}${timestamp}`
       ).toString('base64');

       const paymentRes = await fetch(
           `${process.env.MPESA_SANDBOX_URL}/stkpush/v1/processrequest`,
           {
               method: 'POST',
               headers: {
                   'Authorization': `Bearer ${tokenData.access_token}`,
                   'Content-Type': 'application/json'
               },
               body: JSON.stringify({
                   BusinessShortCode: process.env.MPESA_TILL_NUMBER,
                   Password: password,
                   Timestamp: timestamp,
                   TransactionType: 'CustomerPayBillOnline',
                   Amount: data.amount,
                   PartyA: data.phone,
                   PartyB: process.env.MPESA_TILL_NUMBER,
                   PhoneNumber: data.phone,
                   CallBackURL: `${process.env.FRONTEND_URL}/api/payment/callback`,
                   AccountReference: 'FTC',
                   TransactionDesc: data.description
               })
           }
       );

       const paymentData = await paymentRes.json();
       return { transactionId: paymentData.CheckoutRequestID };
   }
   ```

3. **Add to .env**:
   ```
   MPESA_TILL_NUMBER=your_till_number
   MPESA_CONSUMER_KEY=your_consumer_key
   MPESA_CONSUMER_SECRET=your_consumer_secret
   MPESA_PASSKEY=your_daraja_passkey
   MPESA_SANDBOX_URL=https://sandbox.safaricom.co.ke/api
   ```

### 3. Email Service (Optional: Switch from Gmail to SendGrid)

**Current**: Uses Gmail SMTP

**To use SendGrid**:

1. **Get API key from** https://sendgrid.com/

2. **Replace in `server.js`** (line ~40):

   ```javascript
   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);

   const sendOTPEmail = async (email, otp) => {
       await sgMail.send({
           to: email,
           from: 'noreply@fieldtripclub.ke',
           subject: 'Field Trip Club - Your OTP',
           html: `<h1>${otp}</h1>`
       });
   }
   ```

3. **Install SendGrid**:
   ```bash
   npm install @sendgrid/mail
   ```

## 🐛 Troubleshooting

### Backend Server Issues

**Problem**: "Port 5000 already in use"
```
Solution: Change PORT in .env or kill the process using port 5000
lsof -i :5000  (macOS/Linux)
netstat -ano | findstr :5000  (Windows)
taskkill /PID <PID> /F
```

**Problem**: "Cannot find module 'express'"
```
Solution: Install dependencies
npm install
```

**Problem**: "Email not sending"
```
Solutions:
1. Check EMAIL_USER and EMAIL_PASSWORD in .env
2. Verify Gmail app password (not regular password)
3. Check if "Less secure app access" is enabled
4. Check spam folder for OTP emails
```

**Problem**: "Firebase connection error"
```
Solution: Verify credentials in .env
- Copy entire private key with newlines
- Ensure PROJECT_ID and CLIENT_EMAIL match Firebase console
```

### Frontend Issues

**Problem**: "API_URL shows 'Cannot GET /api/...'"
```
Solution: Ensure backend server is running
npm start  (in backend terminal)
Check http://localhost:5000/api/trips returns data
```

**Problem**: "Stuck on OTP page"
```
Solution: Check browser console for errors
- Server must be running
- OTP might have expired (10 min timeout)
- Check email/console for actual OTP
```

**Problem**: "localStorage errors"
```
Solution: Clear browser cache and cookies
Ctrl+Shift+Delete and clear all data
Try in incognito/private window
```

### Database Issues

**Problem**: "Cannot connect to MongoDB"
```
Solution:
1. Check MONGODB_URI in .env has correct username/password
2. Whitelist your IP in MongoDB Atlas Network Access
3. Ensure cluster is running (not paused)
```

## 📞 Support

For issues:

1. Check the **Troubleshooting** section above
2. Check browser **Console** (F12) for JavaScript errors
3. Check **Terminal** for backend errors
4. Review API response in **Network tab** (F12)
5. Ensure all **dependencies are installed** (`npm install`)
6. Verify **.env file** has all required variables

## 📝 Notes

- All passwords are hashed with bcrypt
- JWTs expire after 1 hour
- OTPs expire after 10 minutes
- Never commit `.env` to version control
- For production, use HTTPS and proper database backups
- Test in incognito window for fresh localStorage state

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [Firebase Setup Guide](https://firebase.google.com/docs/database/setup)
- [MPesa Daraja API](https://developer.safaricom.co.ke/)
- [JWT Authentication](https://jwt.io/)
- [Nodemailer](https://nodemailer.com/)

---

**Version**: 1.0.0  
**Last Updated**: March 2026  
**Status**: Production Ready
