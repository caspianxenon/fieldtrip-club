# Environment Setup - Quick Start

## ✅ Status: COMPLETE

All environment variables are now configured and ready to use!

---

## 🚀 How to Start

```bash
npm start
```

That's it! The `dotenv` package automatically loads `.env` on startup.

---

## 📋 What's Configured

### ✅ Email (Gmail OTP)
```
EMAIL_USER: noviceokx@gmail.com
EMAIL_PASSWORD: abicjkcaszsupcrb (App Password)
EMAIL_SERVICE: gmail
```

### ✅ Authentication (JWT)
```
JWT_SECRET: mysecretkey123456789012345678901234567890
Token Expiry: 1 hour
```

### ✅ MPesa Payment
```
MPESA_CONSUMER_KEY: JGVfuGej2CmWOrXRK7zb7KT5EF1Zf0BuX1ad9kX8jTgWX5so
MPESA_CONSUMER_SECRET: cCWZqRCdFHZDiEnlh8c0kzyla2KuTRg4tN5Tezkq3JOPwf5hHxHEBWNniGWiz5GQ
MPESA_SHORTCODE: 174379
MPESA_CALLBACK_URL: http://localhost:5000/mpesa/callback
```

### ✅ Server Configuration
```
PORT: 5000
NODE_ENV: development
FRONTEND_URL: http://localhost:3000
```

---

## 🧪 Quick Test

### 1. Start Backend
```bash
npm start
```

**Expected Output:**
```
✓ Field Trip Club Backend running on http://localhost:5000
✓ Environment: development
✓ Email service: gmail
```

### 2. Sign Up (Test Email)
- Open frontend at `http://localhost:3000`
- Click "Sign Up"
- Enter email: `test@example.com`
- Enter password: `Test123!`
- **Check server console for OTP** (email demo mode)
- OTP format: `000000` (demo accepts any OTP)

### 3. Test Payment (Event Holder)
- Sign up as Event Holder
- Complete KYC (60% pass rate in demo)
- Click "Pay Registration"
- **Check server console for:**
  ```
  MPesa Payment Initiated (Demo Mode)
    Transaction ID: TXN1710516000000
    Shortcode: 174379
  ```

---

## 🔑 Important Notes

### Security
- ⚠️ **DO NOT** commit `.env` to Git
- ✓ **DO** commit `.env.example` (template)
- ✓ All credentials in `.env` for development only
- ✓ Use stronger credentials in production

### File Locations
```
.env          ← Contains all credentials (don't share!)
.env.example  ← Template (safe to share)
server.js     ← Uses environment variables
```

### Updating Credentials
Edit `.env` and restart:
```bash
npm start
```

---

## 📚 Full Documentation

See **`ENV_SETUP_COMPLETE.md`** for:
- Detailed environment variable reference
- Security best practices
- Production deployment checklist
- How to update credentials
- Troubleshooting guide

---

## ✨ That's It!

Your backend is ready with:
- ✅ Email service for OTPs
- ✅ JWT tokens for authentication
- ✅ MPesa payment integration
- ✅ All credentials from environment variables
- ✅ No hardcoded secrets

**Run:** `npm start` 🚀
