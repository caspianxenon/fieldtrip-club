# 📱 MPesa Phone Number Input - Testing Guide

## 🎯 What's New

The **"Pay Now" button** now prompts Excursors to enter their **MPesa phone number** before processing the payment simulation.

---

## 📋 Feature Details

### Payment Flow

```
User clicks "Pay Now"
        ↓
Prompted: "Enter your MPesa phone number (254xxxxxxxxx)"
        ↓
User enters valid phone (254xxxxxxxxx format)
        ↓
Confirmation popup shows with phone number
        ↓
User clicks OK → Payment Confirmed + Ticket Generated
User clicks Cancel → Payment Cancelled (no ticket)
```

### Phone Number Validation

✅ **Valid Format**: `254xxxxxxxxx`
- Must start with `254` (Kenya country code)
- Followed by exactly 9 digits
- Total: 12 characters

❌ **Invalid Formats**:
- `0712345678` (missing country code)
- `+254712345678` (plus sign not allowed)
- `254712345` (only 8 digits)
- `254712345678a` (contains letters)

### Error Handling

| Scenario | User Action | Result |
|----------|------------|--------|
| **No phone stored** | Click "Pay Now" | Prompted to enter phone |
| **Invalid format** | Enter `0712345678` | Error: "Invalid phone format" |
| **Blank input** | Press Cancel in prompt | Payment aborted |
| **Valid phone** | Enter `254712345678` | Shows confirmation dialog |
| **Confirm payment** | Click OK | Payment confirmed + ticket |
| **Cancel payment** | Click Cancel | Payment cancelled |

---

## 🚀 How to Test

### Test 1: Valid Phone Entry
1. Login as Excursor (test@example.com / Test123!)
2. Go to Trips page
3. Click "💳 Pay Now" button on any trip
4. **Enter**: `254712345678`
5. **Expected**: Confirmation popup with your phone number
6. Click **OK**
7. **Expected**: 
   - "✓ Payment Successful!" alert
   - Ticket number appears on card
   - "Payment Confirmed" button shown
   - Console shows payment details

### Test 2: Invalid Phone Format
1. Click "💳 Pay Now" button
2. **Enter**: `0712345678` (no country code)
3. **Expected**: Error alert "Invalid phone format. Use 254xxxxxxxxx format."
4. Click OK
5. Payment NOT processed
6. "Pay Now" button still visible

### Test 3: Phone Already Stored
1. Login as user with phone stored
2. Click "💳 Pay Now" button
3. **Expected**: NO prompt for phone (skips to confirmation)
4. Confirmation shows stored phone number
5. Click OK to complete payment

### Test 4: Cancel Payment
1. Click "💳 Pay Now" button
2. Enter valid phone: `254712345678`
3. Click **Cancel** in confirmation dialog
4. **Expected**: Alert "Payment cancelled by user."
5. "Pay Now" button still visible
6. No ticket generated

### Test 5: Different Phones Per Trip
1. Pay for Trip 1 with phone `254711111111`
2. Try to pay for Trip 2
3. When prompted, enter different phone `254722222222`
4. **Expected**: Each trip shows in console with different phone numbers
5. Both generate unique tickets

---

## 📊 Phone Format Examples

### ✅ Valid Phone Numbers
```
254712345678
254701234567
254798765432
254735000000
254799999999
```

### ❌ Invalid Phone Numbers
```
0712345678       ← Missing country code
+254712345678    ← Plus sign not allowed
254-712-345-678  ← Hyphens not allowed
712345678        ← No country code
254712345        ← Only 8 digits
254712345678a    ← Contains letter
```

---

## 🔍 Browser Console Verification

After successful payment, check console logs:

```javascript
✓ Payment Confirmed for Trip 1
Trip: Mount Kenya Expedition
Amount: KES 8500
Phone: 254712345678
Ticket Number: A3K9Z
```

**Console Commands**:
```javascript
// Check payment status
console.log(tripPaymentStatus);
// Output: {1: 'confirmed', 3: 'confirmed'}

// Check generated tickets
console.log(tripTickets);
// Output: {1: 'A3K9Z', 3: 'X7M2L'}

// Check current image index
console.log(currentImageIndex);
// Output: {1: 2, 3: 0}
```

---

## 🎬 Complete Test Scenario

### Scenario: Excursor Books Multiple Trips

```
Step 1: Login
├─ Email: test@example.com
├─ Password: Test123!
├─ OTP: 000000
└─ ✓ Logged in as Excursor

Step 2: Browse Trips
├─ Click "Trips" in menu
└─ See 4 trip cards with carousels

Step 3: First Trip Payment (Mount Kenya)
├─ Browse images with ❮ ❯ buttons
├─ Click "💳 Pay Now"
├─ Prompted: "Enter phone"
├─ Enter: 254712345678
├─ Confirm: Shows phone in dialog
├─ Click OK
├─ Result: ✓ Ticket: A3K9Z
└─ Button changes to "Payment Confirmed"

Step 4: Second Trip Payment (Beach Paradise)
├─ Scroll to another trip
├─ Click "💳 Pay Now"
├─ Enter: 254711111111 (different phone)
├─ Confirm payment
├─ Result: ✓ Ticket: X7M2L (different ticket)
└─ Each trip tracks independently

Step 5: Refresh Page
├─ Press F5
├─ All payment statuses RESET (demo mode)
├─ All "Payment Confirmed" buttons return to "Pay Now"
├─ All tickets disappear
└─ Ready to test payment flow again
```

---

## ⚙️ Code Implementation

### Phone Validation Regex
```javascript
if (!phone.match(/^254\d{9}$/)) {
    // Invalid format
}
```

### Payment Confirmation Flow
```javascript
// 1. Get or prompt for phone
let phone = user.phone;
if (!phone) {
    phone = prompt('Enter your MPesa phone number (254xxxxxxxxx):');
}

// 2. Validate format
if (!phone.match(/^254\d{9}$/)) {
    alert('Invalid phone format. Use 254xxxxxxxxx format.');
    return;
}

// 3. Show confirmation
const confirmed = confirm(`...Phone: ${phone}...`);

// 4. Process if confirmed
if (confirmed) {
    const ticketNumber = generateTicketNumber();
    tripPaymentStatus[tripId] = 'confirmed';
    tripTickets[tripId] = ticketNumber;
    displayTrips(); // Refresh UI
}
```

---

## 🐛 Troubleshooting

### Issue: Phone Prompt Not Showing
- **Check**: Is user logged in? (Required)
- **Fix**: Login with test@example.com / Test123!

### Issue: "Invalid phone format" Error
- **Check**: Did you include country code `254`?
- **Check**: Did you enter exactly 9 digits after `254`?
- **Fix**: Use format like `254712345678`

### Issue: Ticket Doesn't Appear
- **Check**: Did you click OK in confirmation dialog?
- **Check**: Are you viewing as Excursor (not Event Holder)?
- **Fix**: Refresh page and try again

### Issue: Same Ticket Generated Twice
- **Check**: This shouldn't happen (uses random generation)
- **Debug**: Check console: `console.log(tripTickets)`
- **Fix**: Refresh and try again

### Issue: Phone Resets After Refresh
- **Expected**: In demo mode, all data resets on page refresh
- **Production**: Would store in backend database
- **For Now**: This is normal behavior

---

## 📱 Mobile Testing

### Desktop (1920x1080)
- ✅ Phone prompt appears centered
- ✅ Confirmation dialog readable
- ✅ "Pay Now" button at full width

### Tablet (768x1024)
- ✅ Phone input prompt responsive
- ✅ Carousel full width
- ✅ Button stacked properly

### Mobile (375x667)
- ✅ Phone prompt readable
- ✅ Carousel touch-friendly navigation
- ✅ Button tappable

---

## ✅ Acceptance Criteria

All of these must be true:

- [x] Phone prompt appears on "Pay Now" click
- [x] Phone format validated (254xxxxxxxxx)
- [x] Confirmation shows entered phone number
- [x] Payment creates unique ticket on OK
- [x] Payment cancelled shows error on Cancel
- [x] Invalid phone rejected with error message
- [x] Console logs payment details
- [x] UI updates with ticket immediately
- [x] Each trip tracks independently
- [x] Works on desktop, tablet, mobile

---

## 🎯 Key Points

✨ **Demo Mode**: All payments are simulated (no real charges)
✨ **Phone Format**: Must be `254xxxxxxxxx` (Kenya format)
✨ **Tickets**: Generated only after payment confirmation
✨ **Validation**: Real-time format checking
✨ **Session**: Data resets on page refresh
✨ **Console**: All payments logged for debugging

---

## 📞 Support

For issues or questions:
1. Check console logs (F12 → Console tab)
2. Verify phone format (254xxxxxxxxx)
3. Try different phone number
4. Refresh and try again
5. Clear browser cache

---

**Version**: 1.0.0 | **Date**: March 15, 2026 | **Status**: Ready ✅
