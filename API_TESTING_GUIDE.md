# 🧪 API TESTING QUICK REFERENCE

## CURL Commands for Testing

### Test 1: Register Excursor
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@gmail.com",
    "phone": "0712345678",
    "password": "Test@12345",
    "userType": "excursor"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered. OTP sent to email.",
  "userType": "excursor",
  "email": "john@gmail.com",
  "requiresKYC": false
}
```

---

### Test 2: Register Event Holder
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Smith",
    "email": "jane@gmail.com",
    "phone": "+254712345678",
    "password": "Test@12345",
    "userType": "event_holder"
  }'
```

**Expected Response:**
```json
{
  "message": "User registered. OTP sent to email.",
  "userType": "event_holder",
  "email": "jane@gmail.com",
  "requiresKYC": true
}
```

---

### Test 3: Verify OTP
```bash
# Replace OTP_CODE with 6-digit code from email
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@gmail.com",
    "otp": "123456"
  }'
```

**Expected Response:**
```json
{
  "message": "OTP verified",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "email": "john@gmail.com",
    "name": "John Doe",
    "userType": "excursor",
    "kycStatus": "not_required",
    "paymentStatus": "completed"
  }
}
```

---

### Test 4: Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@gmail.com",
    "password": "Test@12345"
  }'
```

**Expected Response:**
```json
{
  "message": "OTP sent to email",
  "email": "john@gmail.com"
}
```

---

### Test 5: KYC Submission (VALID - Should Pass)
```bash
# Replace TOKEN with JWT from OTP verification
curl -X POST http://localhost:5000/api/kyc/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "nationalId": "123456",
    "firstName": "Jane",
    "lastName": "Smith",
    "dateOfBirth": "1990-05-15",
    "idType": "national_id"
  }'
```

**Expected Response (95% in demo):**
```json
{
  "message": "KYC verification successful",
  "status": "verified",
  "nextStep": "Complete payment to start creating trips"
}
```

---

### Test 6: KYC Submission (INVALID - Should Fail)
```bash
curl -X POST http://localhost:5000/api/kyc/start \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "nationalId": "12",
    "firstName": "J",
    "lastName": "S",
    "dateOfBirth": "2010-01-01",
    "idType": "passport"
  }'
```

**Expected Response:**
```json
{
  "error": "KYC verification failed",
  "reason": "ID must be between 6 and 15 digits",
  "message": "Please ensure all information is correct and try again"
}
```

---

### Test 7: Get KYC Status
```bash
curl -X GET http://localhost:5000/api/kyc/status \
  -H "Authorization: Bearer TOKEN"
```

**Expected Response:**
```json
{
  "kycStatus": "verified",
  "kycData": {
    "userId": "1710516000000",
    "email": "jane@gmail.com",
    "nationalId": "123456",
    "firstName": "Jane",
    "lastName": "Smith",
    "dateOfBirth": "1990-05-15",
    "idType": "national_id",
    "status": "verified",
    "verifiedAt": "2026-03-15T10:30:00.000Z"
  }
}
```

---

### Test 8: Initiate Payment
```bash
curl -X POST http://localhost:5000/api/payment/mpesa \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "phone": "+254712345678"
  }'
```

**Expected Response:**
```json
{
  "message": "Payment initiated",
  "paymentDetails": {
    "amount": 999,
    "phone": "+254712345678",
    "shortcode": "174379",
    "status": "pending"
  },
  "transactionId": "TXN1710516000000"
}
```

---

### Test 9: Verify Payment & Generate Ticket
```bash
curl -X POST http://localhost:5000/api/payment/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "transactionId": "TXN1710516000000",
    "tripId": 1,
    "amount": 999
  }'
```

**Expected Response:**
```json
{
  "message": "Payment verified and ticket generated",
  "status": "completed",
  "ticket": {
    "ticketId": "tkt_1710516000000_abc123xyz",
    "tripName": "Maasai Mara Safari",
    "tripDate": "2026-04-15",
    "buyerName": "Jane Smith",
    "amount": 999,
    "status": "active",
    "validUntil": "2026-04-14T10:30:00.000Z",
    "qrCode": "data:image/svg+xml;base64,VFJJUEtFVDp0a3RfMTcxMDUxNjAwMDAwMF9hYmMxMjN4eXp8VFJJUDpNYWFzYWkgTWFhciBTYWZhcml8QlVZRVI6SmFuZSBTbWl0aHxUSU1FOjE2MTAzNjAwMDA="
  }
}
```

---

### Test 10: Get Ticket Details
```bash
curl -X GET http://localhost:5000/api/tickets/tkt_1710516000000_abc123xyz \
  -H "Authorization: Bearer TOKEN"
```

**Expected Response:**
```json
{
  "ticket": {
    "ticketId": "tkt_1710516000000_abc123xyz",
    "tripId": 1,
    "trip": {
      "id": 1,
      "name": "Maasai Mara Safari",
      "date": "2026-04-15",
      "location": "Maasai Mara National Reserve",
      "cost": 8500
    },
    "buyerEmail": "jane@gmail.com",
    "buyerName": "Jane Smith",
    "transactionId": "TXN1710516000000",
    "amount": 999,
    "status": "active",
    "generatedAt": "2026-03-15T10:30:00.000Z",
    "validUntil": "2026-04-14T10:30:00.000Z"
  },
  "qrCode": "data:image/svg+xml;base64,..."
}
```

---

### Test 11: Verify Ticket (Scan)
```bash
curl -X POST http://localhost:5000/api/tickets/verify \
  -H "Content-Type: application/json" \
  -d '{
    "ticketId": "tkt_1710516000000_abc123xyz"
  }'
```

**Expected Response:**
```json
{
  "message": "Ticket verified",
  "ticket": {
    "ticketId": "tkt_1710516000000_abc123xyz",
    "buyerName": "Jane Smith",
    "tripName": "Maasai Mara Safari",
    "tripDate": "2026-04-15",
    "status": "scanned"
  }
}
```

---

### Test 12: Get User Rewards
```bash
curl -X GET http://localhost:5000/api/rewards/user-rewards \
  -H "Authorization: Bearer TOKEN"
```

**Expected Response:**
```json
{
  "points": 110,
  "badges": [
    {
      "id": "early_adopter",
      "name": "Early Adopter",
      "description": "First to use new features",
      "icon": "🚀",
      "awardedAt": "2026-03-15T10:30:00.000Z"
    }
  ],
  "referralCount": 0,
  "groupsCreated": 0,
  "groupsJoined": 0,
  "tripsCompleted": 1
}
```

---

### Test 13: Get Leaderboard
```bash
curl -X GET http://localhost:5000/api/leaderboard
```

**Expected Response:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "1710516000001",
      "name": "Jane Smith",
      "email": "jane@gmail.com",
      "points": 110,
      "badges": 1,
      "referrals": 0,
      "groupsCreated": 0
    },
    {
      "rank": 2,
      "userId": "1710516000002",
      "name": "John Doe",
      "email": "john@gmail.com",
      "points": 10,
      "badges": 0,
      "referrals": 0,
      "groupsCreated": 0
    }
  ],
  "totalUsers": 2
}
```

---

### Test 14: Forgot Password
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@gmail.com"
  }'
```

**Expected Response:**
```json
{
  "message": "If an account with this email exists, a password reset link has been sent.",
  "email": "john@gmail.com"
}
```

---

### Test 15: Reset Password
```bash
# Get RESET_TOKEN from email
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@gmail.com",
    "token": "RESET_TOKEN",
    "newPassword": "NewPassword@123"
  }'
```

**Expected Response:**
```json
{
  "message": "Password has been reset successfully",
  "email": "john@gmail.com"
}
```

---

## Using Postman

1. Import this collection into Postman
2. Set `{{base_url}}` = `http://localhost:5000`
3. Set `{{token}}` = JWT from login response
4. Run requests in order
5. Use "Tests" tab to validate responses

---

## Common HTTP Status Codes

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | Login successful, ticket verified |
| 201 | Created | Trip created |
| 400 | Bad Request | Invalid OTP, KYC validation failed |
| 401 | Unauthorized | Missing or invalid token |
| 403 | Forbidden | Only Event Holders can create trips |
| 404 | Not Found | Ticket not found |
| 500 | Server Error | Database error, email service down |

---

## Response Format (All Endpoints)

### Success Response
```json
{
  "message": "Description of success",
  "data": { /* specific data */ }
}
```

### Error Response
```json
{
  "error": "Error message",
  "reason": "Detailed reason (if applicable)"
}
```

---

## Environment Variables for Testing

Create a `.env.test` file:
```env
PORT=5001
NODE_ENV=test
EMAIL_SERVICE=gmail
EMAIL_USER=test@gmail.com
EMAIL_PASSWORD=app_password_here
JWT_SECRET=test_secret
```

Then run:
```bash
NODE_ENV=test npm start
```

---

**Last Updated:** March 15, 2026  
**API Version:** 2.1.0
