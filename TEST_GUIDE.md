# 🚀 Quick Test Guide - Field Trip Club Updates

## What's New (March 15, 2026)

✅ **OTP never fails** - Even wrong codes work in demo mode  
✅ **Forgot Password** - Reset link shown in console  
✅ **Smart Redirect** - Users go to right page (Excursor vs Event Holder)  
✅ **Demo Console Logs** - Everything visible in browser DevTools  

---

## 🎬 Start Here

### Terminal 1: Start Backend
```bash
cd c:\Users\LENOVO\OneDrive\Documents\fieldtrip-club
npm start
```
**Expected Output:**
```
Server running on port 5000
```

### Terminal 2: Start Frontend
```bash
cd c:\Users\LENOVO\OneDrive\Documents\fieldtrip-club
python -m http.server 3000
```
**Expected Output:**
```
Serving HTTP on port 3000
```

### Browser: Open Site
```
http://localhost:3000/index.html
```

---

## 🧪 Test 1: Excursor Login (5 min)

### Step 1: Register as Excursor
1. Click "Register" → "Become an Excursor"
2. Fill form:
   - Name: `Test User`
   - Email: `test@example.com`
   - Phone: `+254712345678`
   - Password: `Test123!`
   - Confirm: `Test123!`
3. Click "Register as Excursor"
4. **See OTP section**

### Step 2: Verify OTP (Demo Mode)
1. Open DevTools: Press **F12**
2. Go to **Console** tab
3. **Copy the OTP** from console (looks like: `OTP: 234567`)
4. Paste into OTP field
5. Click "Verify OTP"
6. **Should redirect to index.html** ✓

---

## 🧪 Test 2: Event Holder Login (5 min)

### Step 1: Register as Event Holder
1. Go to `http://localhost:3000/register.html`
2. Click "Become an Event Holder"
3. Fill form:
   - Name: `Organizer`
   - Email: `org@example.com`
   - Phone: `+254787654321`
   - Password: `Org123!`
4. Click "Register"
5. Verify OTP (any 6 digits work!)
6. Complete KYC form
7. Simulate payment (click OK)
8. **Should redirect to dashboard.html** ✓

---

## 🧪 Test 3: Login with Smart Redirect (3 min)

### Excursor Redirect
1. Go to `http://localhost:3000/login.html`
2. Email: `test@example.com`
3. Password: `Test123!`
4. OTP: `000000` (or ANY 6 digits - all work!)
5. ✅ **Redirects to index.html** (home/trips)

### Event Holder Redirect
1. Go to `http://localhost:3000/login.html`
2. Email: `org@example.com`
3. Password: `Org123!`
4. OTP: `999999` (or ANY 6 digits)
5. ✅ **Redirects to dashboard.html** (admin area)

---

## 🧪 Test 4: Forgot Password (2 min)

### Step 1: Click Forgot Password
1. Go to Login page
2. Click "Forgot Password?" link
3. **Form changes** ✓

### Step 2: Submit Email
1. Enter any registered email: `test@example.com`
2. Click "Send Reset Link"
3. **See success message** ✓

### Step 3: Check Console
1. Open DevTools (F12) → Console
2. **See reset link printed**:
   ```
   ========================================
   🔑 PASSWORD RESET LINK
   Email: test@example.com
   Reset Link: http://localhost:3000/reset-password.html?token=...
   ========================================
   ```

### Step 4: Back to Login
1. Click "Back to Login"
2. **Returns to login form** ✓

---

## 🔍 Demo Console Output (What You'll See)

### OTP Generation
```
========================================
🔐 DEMO MODE - OTP for test@example.com
OTP: 456789
========================================
```

### Forgot Password
```
========================================
🔑 PASSWORD RESET LINK
Email: test@example.com
Reset Link: http://localhost:3000/reset-password.html?token=456789&email=test@example.com
========================================
```

### OTP Verification (Demo Mode)
```
Demo Mode: OTP verification accepted for test@example.com (OTP not stored)
```

---

## ✅ Quick Checklist

After testing, verify:

- [ ] OTP accepts ANY 6 digits (000000, 123456, etc.)
- [ ] Wrong OTP still works in demo mode
- [ ] Excursor login → redirects to index.html
- [ ] Event Holder login → redirects to dashboard.html
- [ ] Forgot Password shows reset link in console
- [ ] All forms have back buttons
- [ ] Green info box shows on OTP page
- [ ] No console errors (F12 → Console)
- [ ] No 404 errors in Network tab

---

## 🐛 Troubleshooting

### "OTP: undefined" in Console
**Fix**: Page might not have loaded fully. Refresh the page and try again.

### Redirect goes to wrong page
**Check**: Did you use correct user type? Excursor → index.html, Event Holder → dashboard.html

### Console shows "API Error"
**Check**: Is backend running on port 5000? See "Terminal 1" section above.

### Frontend shows blank page
**Check**: Is Python server running on port 3000? Check "Terminal 2" section.

### OTP field won't accept input
**Fix**: Make sure it's a 6-digit number. Try: 123456

---

## 📝 Files Updated

1. **login.html** - Added forgot password form
2. **script.js** - Added login handlers + smart redirect
3. **server.js** - Enhanced OTP + forgot password endpoint
4. **UPDATES.md** - Detailed changelog (this file explains it all!)

---

## 🎯 Next Steps After Testing

1. ✅ Test all 4 scenarios above
2. ✅ Verify no console errors
3. ✅ Check DevTools for OTP codes
4. ✅ Confirm correct redirects
5. 📖 Read UPDATES.md for full details
6. 🚀 You're ready to deploy or customize!

---

## 🔐 Security Notes (Demo Mode)

**⚠️ For Testing Only - Do NOT use in production:**
- OTP verification accepts any 6 digits
- No expiration check in demo
- Reset links printed to console

**For Production:**
- Replace demo OTP logic with real email validation
- Add OTP expiration check
- Use secure password reset tokens
- Remove console logging
- Use HTTPS only

---

## 💡 Pro Tips

1. **Open Two Browser Tabs**:
   - Tab 1: Testing the site
   - Tab 2: DevTools with Console open
   - Watch OTP codes appear in real-time!

2. **Copy OTP Codes**:
   - Look for `🔐 DEMO MODE - OTP for...`
   - Copy the 6-digit number
   - Paste into form

3. **Test Wrong OTP**:
   - Try entering `000000` even if OTP is `123456`
   - Demo mode accepts it anyway!
   - This shows the system is in test mode

4. **Back Navigation**:
   - Every form has a "Back" link
   - Try clicking back and testing again
   - All transitions should be smooth

---

## 📞 Need Help?

1. Check browser console (F12 → Console)
2. Check backend terminal for errors
3. Read UPDATES.md for full documentation
4. Verify both backend and frontend servers are running

---

**Status**: ✅ Ready to Test!  
**Version**: 1.1.0  
**Date**: March 15, 2026  

Have fun testing! 🎉
