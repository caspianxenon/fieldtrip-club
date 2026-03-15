# Field Trip Club Kenya - Backend Setup Guide

## Prerequisites
- Node.js installed (v14+)
- npm or yarn
- MongoDB Atlas account (free tier) OR Firebase account
- SendGrid or Gmail account for email OTP
- MPesa Till Number (for testing)

## Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Create .env file in root directory**
```
# Server Config
PORT=5000
NODE_ENV=development

# Database (Choose one)
# Firebase
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FIREBASE_CLIENT_EMAIL=your_firebase_client_email

# OR MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fieldtrip

# Email OTP
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587

# JWT Secret
JWT_SECRET=your_secret_key_here_min_32_chars

# MPesa Configuration
MPESA_TILL_NUMBER=123456
MPESA_API_KEY=placeholder_key_get_from_provider
MPESA_SANDBOX_URL=https://sandbox.mpesa.co.ke/api

# KYC Configuration
KYC_API_KEY=placeholder_key_from_kyc_provider
KYC_API_URL=https://sandbox.api.example.com/kyc

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

3. **Set Up Database**

### Option A: Firebase (Recommended for beginners)
- Go to https://firebase.google.com/
- Create new project
- Enable Firestore Database
- Generate service account key
- Copy credentials to .env

### Option B: MongoDB
- Go to https://www.mongodb.com/cloud/atlas
- Create free cluster
- Get connection string
- Add to MONGODB_URI in .env

4. **Gmail App Password (for OTP emails)**
- Enable 2FA on Gmail account
- Go to https://myaccount.google.com/apppasswords
- Generate app password for Mail
- Use this in EMAIL_PASSWORD field

## Running the Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
npm start
```

Server will run on http://localhost:5000

## API Endpoints

### Authentication
- POST /api/auth/signup - Register new user
- POST /api/auth/login - Login user
- POST /api/auth/verify-otp - Verify OTP
- POST /api/auth/logout - Logout

### KYC & Payment
- POST /api/kyc/start - Initiate KYC verification
- POST /api/payment/mpesa - Initiate MPesa payment
- POST /api/payment/verify - Verify payment status

### Trips
- GET /api/trips - Get all trips
- POST /api/trips - Create new trip (Event Holder only)
- PUT /api/trips/:id - Update trip (Event Holder only)
- POST /api/trips/:id/join - Join a trip (Excursor only)

### User
- GET /api/user/profile - Get user profile
- PUT /api/user/profile - Update profile
- GET /api/user/dashboard - Get dashboard data

## Testing Flows

### 1. User Registration (Excursor)
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe",
    "userType": "excursor"
  }'
```

### 2. Event Holder Registration (with KYC + Payment)
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "organizer@example.com",
    "password": "SecurePass123!",
    "name": "Jane Organizer",
    "userType": "event_holder",
    "phone": "+254712345678"
  }'
```

### 3. Verify OTP
```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "otp": "123456"
  }'
```

### 4. Create Trip (Event Holder only)
```bash
curl -X POST http://localhost:5000/api/trips \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maasai Mara Safari",
    "date": "2026-04-15",
    "location": "Maasai Mara",
    "description": "Wildlife safari",
    "cost": 8500,
    "capacity": 20
  }'
```

## Replacing Placeholder APIs

### KYC Integration
1. Choose a KYC provider (e.g., SafetyRx, Smile ID, AuthentiAfrica)
2. Get API credentials from their sandbox environment
3. Replace `// TODO: Integrate KYC Provider` in server.js with actual API call
4. Update KYC_API_KEY in .env

### MPesa Till Payment
1. Contact Safaricom for Till number (test environment)
2. Use Daraja API from https://developer.safaricom.co.ke/
3. Replace `// TODO: Integrate MPesa API` with actual payment logic
4. Update MPESA_API_KEY and MPESA_TILL_NUMBER in .env

### OTP Email
Currently uses Gmail SMTP. To use SendGrid:
1. Get API key from https://sendgrid.com/
2. Replace Nodemailer config with SendGrid library
3. Update EMAIL_SERVICE in .env

## Troubleshooting

- **Connection refused**: Ensure backend server is running on port 5000
- **CORS errors**: Check FRONTEND_URL in .env
- **Email not sending**: Verify Gmail app password or SendGrid API key
- **Database connection failed**: Check connection string in .env
- **JWT errors**: Ensure JWT_SECRET is at least 32 characters

## Security Notes
- All passwords are hashed with bcryptjs
- JWTs expire after 1 hour
- OTPs expire after 10 minutes
- Never commit .env file to version control
- Use HTTPS in production
