# 📚 Complete API Reference - Field Trip Club Kenya

## Base URL
```
http://localhost:5000
```

## Authentication
All endpoints (except public ones) require:
```
Authorization: Bearer {token}
Content-Type: application/json
```

---

## 🏘️ GROUP BOOKING ENDPOINTS

### 1. Create Group Trip
Create a new group for an existing trip.

**Endpoint:**
```
POST /api/groups/create
```

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Request Body:**
```json
{
    "tripId": 1,
    "groupName": "Adventure Seekers",
    "maxMembers": 10
}
```

**Success Response (200):**
```json
{
    "message": "Group created successfully",
    "group": {
        "groupId": "grp_1710427800000_a1b2c3d4",
        "groupName": "Adventure Seekers",
        "shareCode": "MARA01",
        "shareLink": "http://localhost:3000/join-group?code=MARA01",
        "memberCount": 1,
        "maxMembers": 10
    }
}
```

**Error Responses:**
```json
// 400 - Missing fields
{
    "error": "Missing required fields"
}

// 403 - Not an excursor
{
    "error": "Only excursors can create groups"
}
```

**Frontend Usage:**
```javascript
const result = await apiCall('/groups/create', 'POST', {
    tripId: 1,
    groupName: 'My Group',
    maxMembers: 10
});
console.log(result.group.shareCode); // Share this code
```

---

### 2. Join Group Trip
Join an existing group using a share code.

**Endpoint:**
```
POST /api/groups/join
```

**Request Body:**
```json
{
    "shareCode": "MARA01"
}
```

**Success Response (200):**
```json
{
    "message": "Successfully joined group",
    "group": {
        "groupId": "grp_1710427800000_a1b2c3d4",
        "groupName": "Adventure Seekers",
        "memberCount": 2,
        "maxMembers": 10,
        "members": [
            {
                "userId": "user1",
                "name": "John",
                "email": "john@example.com",
                "status": "joined",
                "joinedAt": "2026-03-15T10:30:00Z"
            },
            {
                "userId": "user2",
                "name": "Jane",
                "email": "jane@example.com",
                "status": "joined",
                "joinedAt": "2026-03-15T11:00:00Z"
            }
        ]
    }
}
```

**Error Responses:**
```json
// 400 - Invalid code
{
    "error": "Share code required"
}

// 404 - Code not found
{
    "error": "Group not found"
}

// 400 - Already a member
{
    "error": "Already a member of this group"
}

// 400 - Group full
{
    "error": "Group is full"
}
```

**Frontend Usage:**
```javascript
const result = await apiCall('/groups/join', 'POST', {
    shareCode: 'MARA01'
});
displayGroupMembers(result.group);
```

---

### 3. Get Group Details
Retrieve detailed information about a group.

**Endpoint:**
```
GET /api/groups/{groupId}
```

**Success Response (200):**
```json
{
    "groupId": "grp_1710427800000_a1b2c3d4",
    "groupName": "Adventure Seekers",
    "creatorName": "John",
    "memberCount": 2,
    "maxMembers": 10,
    "members": [
        {
            "userId": "user1",
            "name": "John",
            "email": "john@example.com",
            "status": "joined",
            "joinedAt": "2026-03-15T10:30:00Z"
        }
    ],
    "shareCode": "MARA01",
    "shareLink": "http://localhost:3000/join-group?code=MARA01",
    "createdAt": "2026-03-15T10:30:00Z"
}
```

**Error Responses:**
```json
// 404 - Group not found
{
    "error": "Group not found"
}
```

**Frontend Usage:**
```javascript
const group = await apiCall('/groups/grp_1234567890_abc123');
console.log(`${group.memberCount}/${group.maxMembers} members`);
```

---

### 4. Update Member Availability
Update your availability status in a group.

**Endpoint:**
```
POST /api/groups/{groupId}/update-availability
```

**Request Body:**
```json
{
    "status": "confirmed",
    "notes": "Really excited about this trip!"
}
```

**Status Options:**
- `joined` - Initially joined
- `confirmed` - Will definitely attend
- `maybe` - Might attend
- `declined` - Cannot attend

**Success Response (200):**
```json
{
    "message": "Availability updated",
    "member": {
        "userId": "user1",
        "status": "confirmed",
        "notes": "Really excited about this trip!",
        "updatedAt": "2026-03-15T11:00:00Z"
    }
}
```

**Frontend Usage:**
```javascript
await apiCall(`/groups/grp_123/update-availability`, 'POST', {
    status: 'confirmed',
    notes: 'Can\'t wait!'
});
```

---

## 🎯 REFERRAL ENDPOINTS

### 1. Generate Referral Link
Create a unique referral link for your account.

**Endpoint:**
```
POST /api/referral/generate-link
```

**Request Body:**
```json
{}
```

**Success Response (200):**
```json
{
    "message": "Referral link generated",
    "referralCode": "ref_user123_abc12345xyz",
    "referralLink": "http://localhost:3000?ref=ref_user123_abc12345xyz"
}
```

**Frontend Usage:**
```javascript
const result = await apiCall('/referral/generate-link', 'POST', {});
copyToClipboard(result.referralLink);
```

---

### 2. Track Referral Completion
Record that you signed up using a referral code.

**Endpoint:**
```
POST /api/referral/track
```

**Request Body:**
```json
{
    "referralCode": "ref_user123_abc12345xyz"
}
```

**Success Response (200):**
```json
{
    "message": "Referral tracked successfully",
    "referrerReward": 100,
    "yourBonus": 50
}
```

**Points Awarded:**
- **Referrer:** 100 points
- **Referred User:** 50 bonus points

**Error Responses:**
```json
// 400 - Code required
{
    "error": "Referral code required"
}

// 404 - Invalid code
{
    "error": "Invalid referral code"
}

// 400 - Already tracked
{
    "error": "Already counted as referral"
}
```

**Frontend Usage:**
```javascript
const result = await apiCall('/referral/track', 'POST', {
    referralCode: 'ref_user123_abc12345xyz'
});
alert(`You earned ${result.yourBonus} bonus points!`);
```

---

## 🏆 REWARDS & GAMIFICATION ENDPOINTS

### 1. Award Points
Award points to a user for an action (usually called internally).

**Endpoint:**
```
POST /api/rewards/award-points
```

**Request Body:**
```json
{
    "userId": "user123",
    "points": 50,
    "action": "joined_group"
}
```

**Success Response (200):**
```json
{
    "message": "Points awarded",
    "newPoints": 250,
    "newBadges": [
        {
            "id": "explorer_10",
            "name": "Explorer",
            "icon": "🗺️",
            "description": "Joined 10 trips",
            "awardedAt": "2026-03-15T11:00:00Z"
        }
    ]
}
```

**Points by Action:**
| Action | Points |
|--------|--------|
| Create Group | 50 |
| Join Group | 20 |
| Join Trip | 10 |
| Referral Success | 100 |
| Being Referred | 50 |
| Complete Trip | 100 |
| Buy Ticket | 25 |

---

### 2. Get User Rewards
Get all rewards and achievements for current user.

**Endpoint:**
```
GET /api/rewards/user-rewards
```

**Success Response (200):**
```json
{
    "points": 350,
    "badges": [
        {
            "id": "explorer_10",
            "name": "Explorer",
            "icon": "🗺️",
            "description": "Joined 10 trips",
            "awardedAt": "2026-03-15T10:30:00Z"
        },
        {
            "id": "referral_master",
            "name": "Referral Master",
            "icon": "🎯",
            "description": "Referred 5 friends",
            "awardedAt": "2026-03-15T11:00:00Z"
        }
    ],
    "referralCount": 5,
    "groupsCreated": 2,
    "groupsJoined": 7,
    "tripsCompleted": 12
}
```

**Frontend Usage:**
```javascript
const rewards = await apiCall('/rewards/user-rewards');
console.log(`Points: ${rewards.points}`);
console.log(`Badges: ${rewards.badges.length}`);
```

---

### 3. Get Leaderboard
Get top explorers ranked by points.

**Endpoint:**
```
GET /api/leaderboard
```

**Success Response (200):**
```json
{
    "leaderboard": [
        {
            "rank": 1,
            "userId": "user1",
            "name": "Adventure Master",
            "email": "master@example.com",
            "points": 5000,
            "badges": 8,
            "referrals": 10,
            "groupsCreated": 5
        },
        {
            "rank": 2,
            "userId": "user2",
            "name": "Explorer Pro",
            "email": "pro@example.com",
            "points": 4500,
            "badges": 7,
            "referrals": 8,
            "groupsCreated": 3
        }
    ],
    "totalUsers": 42
}
```

**Notes:**
- Returns top 100 users
- Ranked by points (highest first)
- Updated in real-time

**Frontend Usage:**
```javascript
const leaderboard = await apiCall('/leaderboard');
leaderboard.leaderboard.forEach(user => {
    console.log(`${user.rank}. ${user.name} - ${user.points} pts`);
});
```

---

## 🎫 TICKET & QR CODE ENDPOINTS

### 1. Generate Ticket
Generate a ticket after successful payment.

**Endpoint:**
```
POST /api/tickets/generate
```

**Request Body:**
```json
{
    "tripId": 1,
    "paymentId": "mpesa_123456789",
    "amount": 8500
}
```

**Success Response (200):**
```json
{
    "message": "Ticket generated successfully",
    "ticket": {
        "ticketId": "tkt_1710427800000_x1y2z3",
        "tripName": "Maasai Mara Safari",
        "tripDate": "2026-04-15",
        "buyerName": "John Doe",
        "status": "active",
        "qrCode": "data:image/svg+xml;base64,PHN2ZyB4bWxucz..."
    }
}
```

**Ticket Statuses:**
- `active` - Valid and not yet used
- `scanned` - Verified at event entrance
- `expired` - No longer valid

**Frontend Usage:**
```javascript
const result = await apiCall('/tickets/generate', 'POST', {
    tripId: 1,
    paymentId: 'mpesa_123456',
    amount: 8500
});
showTicketAndQRCode(result.ticket);
```

---

### 2. Generate QR Code
Generate or retrieve QR code for a ticket.

**Endpoint:**
```
POST /api/qrcode/generate
```

**Request Body:**
```json
{
    "ticketId": "tkt_1710427800000_x1y2z3"
}
```

**Success Response (200):**
```json
{
    "message": "QR Code generated",
    "ticketId": "tkt_1710427800000_x1y2z3",
    "qrCode": "data:image/svg+xml;base64,PHN2ZyB4bWxu...",
    "tripName": "Maasai Mara Safari",
    "validity": "2026-04-15T23:59:59Z"
}
```

**QR Code Data Includes:**
- Ticket ID
- Trip name
- Passenger name
- Timestamp
- All encoded in base64 SVG

**Frontend Usage:**
```javascript
const qr = await apiCall('/qrcode/generate', 'POST', {
    ticketId: 'tkt_1710427800000_x1y2z3'
});
displayQRCode(qr.qrCode);
```

---

### 3. Get Ticket Details
Retrieve full details of a specific ticket.

**Endpoint:**
```
GET /api/tickets/{ticketId}
```

**Success Response (200):**
```json
{
    "ticket": {
        "ticketId": "tkt_1710427800000_x1y2z3",
        "tripId": 1,
        "trip": {
            "id": 1,
            "name": "Maasai Mara Safari",
            "date": "2026-04-15",
            "location": "Maasai Mara National Reserve",
            "cost": 8500
        },
        "buyerEmail": "john@example.com",
        "buyerName": "John Doe",
        "paymentId": "mpesa_123456789",
        "amount": 8500,
        "status": "active",
        "generatedAt": "2026-03-15T10:30:00Z",
        "validUntil": "2026-04-15T23:59:59Z",
        "scannedAt": null
    },
    "qrCode": "data:image/svg+xml;base64,PHN2ZyB4bWxu..."
}
```

**Error Responses:**
```json
// 404 - Ticket not found
{
    "error": "Ticket not found"
}
```

**Frontend Usage:**
```javascript
const ticket = await apiCall('/tickets/tkt_1234567890_abc');
console.log(`Trip: ${ticket.ticket.trip.name}`);
console.log(`Passenger: ${ticket.ticket.buyerName}`);
```

---

### 4. Verify Ticket
Verify and scan a ticket at event entrance.

**Endpoint:**
```
POST /api/tickets/verify
```

**Note:** This endpoint does NOT require authentication (for public use at events).

**Request Body:**
```json
{
    "ticketId": "tkt_1710427800000_x1y2z3"
}
```

**Success Response (200):**
```json
{
    "message": "Ticket verified",
    "ticket": {
        "ticketId": "tkt_1710427800000_x1y2z3",
        "buyerName": "John Doe",
        "tripName": "Maasai Mara Safari",
        "tripDate": "2026-04-15",
        "status": "scanned"
    }
}
```

**Error Responses:**
```json
// 400 - Ticket ID required
{
    "error": "Ticket ID required"
}

// 404 - Invalid ticket
{
    "error": "Ticket not found"
}

// 400 - Already scanned
{
    "error": "Ticket already scanned"
}

// 400 - Expired
{
    "error": "Ticket expired"
}
```

**Frontend Usage:**
```javascript
// At event entrance:
const result = await apiCall('/tickets/verify', 'POST', {
    ticketId: scannedTicketId
});
if (result.ticket.status === 'scanned') {
    alert(`✓ Welcome ${result.ticket.buyerName}!`);
}
```

---

## 🔄 Workflow Sequences

### Complete Group Trip Workflow
```
1. User creates group
   POST /api/groups/create
   → Get groupId and shareCode

2. Friends join group
   POST /api/groups/join
   → Add themselves to members

3. Creator tracks who's confirmed
   GET /api/groups/{groupId}
   → See member statuses

4. Members update availability
   POST /api/groups/{groupId}/update-availability
   → Update confirmed/maybe/declined
```

### Complete Referral Workflow
```
1. User generates referral link
   POST /api/referral/generate-link
   → Get referralCode and referralLink

2. Share link with friends
   (Copy & paste, WhatsApp, etc.)

3. Friend joins using link
   → Includes referralCode in URL

4. Friend tracks referral
   POST /api/referral/track
   → Both get points

5. Check leaderboard
   GET /api/leaderboard
   → See ranking
```

### Complete Ticket Workflow
```
1. User selects trip and goes to payment
   → Shows payment form

2. User completes payment
   → Payment confirmed

3. System generates ticket
   POST /api/tickets/generate
   → Get ticketId

4. System generates QR code
   POST /api/qrcode/generate
   → Get QR code image

5. User views ticket with QR
   GET /api/tickets/{ticketId}
   → Show ticket details + QR

6. User arrives at event
   → Show QR code to scanner

7. Event staff verifies
   POST /api/tickets/verify
   → Ticket marked as scanned
```

---

## 📊 Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (no token/invalid token) |
| 403 | Forbidden (not allowed) |
| 404 | Not Found |
| 500 | Server Error |

---

## 🔐 Authentication

All endpoints (except `/api/leaderboard` and `/api/tickets/verify`) require:

**Header:**
```
Authorization: Bearer {jwt_token}
```

**Getting Token:**
1. Call `/api/auth/signup` or `/api/auth/login`
2. Verify OTP
3. Receive JWT token
4. Use in all subsequent requests

**Token Format:**
```
{
    "userId": "user123",
    "email": "user@example.com",
    "iat": 1234567890,
    "exp": 1234571490
}
```

---

## 📝 Error Handling

### Client-Side Example
```javascript
try {
    const result = await apiCall('/groups/create', 'POST', data);
    console.log('Success:', result);
} catch (error) {
    console.error('Error:', error.message);
    alert(`Failed: ${error.message}`);
}
```

### Common Errors

**"No token provided"**
- User not logged in
- Token expired
- Token not in Authorization header

**"Group not found"**
- Wrong groupId
- Group was deleted
- Check console logs

**"Ticket already scanned"**
- Ticket was already used
- Generate new ticket if needed

---

## 🧪 Testing with Curl

### Create Group
```bash
curl -X POST http://localhost:5000/api/groups/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tripId": 1,
    "groupName": "Test Group",
    "maxMembers": 5
  }'
```

### Get Leaderboard
```bash
curl -X GET http://localhost:5000/api/leaderboard \
  -H "Content-Type: application/json"
```

### Generate Ticket
```bash
curl -X POST http://localhost:5000/api/tickets/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tripId": 1,
    "paymentId": "payment_123",
    "amount": 8500
  }'
```

---

## 📱 Frontend Integration Examples

### In Dashboard
```html
<!-- Show rewards -->
<button onclick="getUserRewards()">View Rewards</button>

<!-- Create group -->
<button onclick="createGroupTrip()">Create Group</button>

<!-- View leaderboard -->
<button onclick="showLeaderboard()">Leaderboard</button>
```

### In JavaScript
```javascript
// Check if user can create groups
if (getCurrentUser().userType === 'excursor') {
    createGroupTrip();
}

// Share referral
const ref = await apiCall('/referral/generate-link', 'POST', {});
copyToClipboard(ref.referralLink);

// Generate ticket
await generateTicket(tripId, paymentId, amount);
```

---

**API Version:** 1.0.0
**Last Updated:** March 15, 2026
**Status:** Production Ready
