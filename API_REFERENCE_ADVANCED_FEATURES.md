# 📡 ADVANCED FEATURES API REFERENCE

## Complete API Documentation for All New Endpoints

---

## 🎯 GROUP BOOKING API

### 1. Create Group Trip
**Endpoint:** `POST /api/groups/create`  
**Auth Required:** Yes  
**User Type:** Excursor only

**Request Body:**
```json
{
  "tripId": 1,
  "groupName": "Safari Adventure Squad",
  "maxMembers": 10
}
```

**Response (Success 200):**
```json
{
  "message": "Group created successfully",
  "group": {
    "groupId": "grp_1710516000000_abc123xyz",
    "groupName": "Safari Adventure Squad",
    "shareCode": "ABC123",
    "shareLink": "http://localhost:3000/join-group?code=ABC123",
    "memberCount": 1,
    "maxMembers": 10
  }
}
```

**Response (Error):**
```json
{
  "error": "Only excursors can create groups"
}
```

---

### 2. Join Group Trip
**Endpoint:** `POST /api/groups/join`  
**Auth Required:** Yes  
**User Type:** Excursor only

**Request Body:**
```json
{
  "shareCode": "ABC123"
}
```

**Response (Success 200):**
```json
{
  "message": "Successfully joined group",
  "group": {
    "groupId": "grp_1710516000000_abc123xyz",
    "groupName": "Safari Adventure Squad",
    "memberCount": 2,
    "maxMembers": 10,
    "members": [
      {
        "userId": "user_123",
        "name": "John Doe",
        "email": "john@example.com",
        "status": "joined",
        "joinedAt": "2026-03-15T10:30:00Z"
      },
      {
        "userId": "user_456",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "status": "joined",
        "joinedAt": "2026-03-15T10:35:00Z"
      }
    ]
  }
}
```

**Error Responses:**
```json
// Group full
{ "error": "Group is full" }

// Invalid code
{ "error": "Group not found" }

// Already member
{ "error": "Already a member of this group" }
```

---

### 3. Get Group Details
**Endpoint:** `GET /api/groups/:groupId`  
**Auth Required:** Yes

**Response (Success 200):**
```json
{
  "groupId": "grp_1710516000000_abc123xyz",
  "groupName": "Safari Adventure Squad",
  "creatorName": "John Doe",
  "memberCount": 3,
  "maxMembers": 10,
  "members": [
    {
      "userId": "user_123",
      "name": "John Doe",
      "email": "john@example.com",
      "status": "confirmed",
      "joinedAt": "2026-03-15T10:30:00Z"
    },
    {
      "userId": "user_456",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "status": "maybe",
      "joinedAt": "2026-03-15T10:35:00Z"
    },
    {
      "userId": "user_789",
      "name": "Bob Wilson",
      "email": "bob@example.com",
      "status": "declined",
      "joinedAt": "2026-03-15T10:40:00Z"
    }
  ],
  "shareCode": "ABC123",
  "shareLink": "http://localhost:3000/join-group?code=ABC123",
  "createdAt": "2026-03-15T10:30:00Z"
}
```

---

### 4. Update Group Availability
**Endpoint:** `POST /api/groups/:groupId/update-availability`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "status": "confirmed",
  "notes": "I can make it!"
}
```

**Status Options:** `"joined"`, `"confirmed"`, `"maybe"`, `"declined"`

**Response (Success 200):**
```json
{
  "message": "Availability updated",
  "member": {
    "userId": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "status": "confirmed",
    "notes": "I can make it!",
    "updatedAt": "2026-03-15T10:45:00Z"
  }
}
```

---

## 🎯 REFERRAL SYSTEM API

### 1. Generate Referral Link
**Endpoint:** `POST /api/referral/generate-link`  
**Auth Required:** Yes  
**User Type:** Any

**Request Body:**
```json
{}
```

**Response (Success 200):**
```json
{
  "message": "Referral link generated",
  "referralCode": "ref_user_123_abc12345",
  "referralLink": "http://localhost:3000?ref=ref_user_123_abc12345"
}
```

**How to Share:**
- WhatsApp: `https://wa.me/?text=Join%20Field%20Trip%20Club%20Kenya!%20http://localhost:3000?ref=ref_user_123_abc12345`
- Twitter: `https://twitter.com/intent/tweet?text=Join%20Field%20Trip%20Club%20Kenya!%20http://localhost:3000?ref=ref_user_123_abc12345`
- Copy & Paste: Just copy the `referralLink` and share anywhere

---

### 2. Track Referral Completion
**Endpoint:** `POST /api/referral/track`  
**Auth Required:** Yes  
**Triggered When:** New user signs up with ref parameter in URL

**Request Body:**
```json
{
  "referralCode": "ref_user_123_abc12345"
}
```

**Response (Success 200):**
```json
{
  "message": "Referral tracked successfully",
  "referrerReward": 100,
  "yourBonus": 50
}
```

**What Happens Automatically:**
- Referrer gets: 100 points
- Referred user gets: 50 bonus points
- Referral added to leaderboard
- Both users see updated points in dashboard

---

### 3. Get Leaderboard
**Endpoint:** `GET /api/leaderboard`  
**Auth Required:** No

**Response (Success 200):**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "userId": "user_123",
      "name": "Jane Smith",
      "email": "jane@example.com",
      "points": 1500,
      "badges": 5,
      "referrals": 8,
      "groupsCreated": 3
    },
    {
      "rank": 2,
      "userId": "user_456",
      "name": "John Doe",
      "email": "john@example.com",
      "points": 1200,
      "badges": 4,
      "referrals": 6,
      "groupsCreated": 2
    },
    {
      "rank": 3,
      "userId": "user_789",
      "name": "Bob Wilson",
      "email": "bob@example.com",
      "points": 950,
      "badges": 3,
      "referrals": 5,
      "groupsCreated": 1
    }
  ],
  "totalUsers": 15
}
```

---

## 🏆 REWARDS & GAMIFICATION API

### 1. Award Points
**Endpoint:** `POST /api/rewards/award-points`  
**Auth Required:** Yes (admin/system)

**Request Body:**
```json
{
  "userId": "user_123",
  "points": 100,
  "action": "completed_trip"
}
```

**Response (Success 200):**
```json
{
  "message": "Points awarded",
  "newPoints": 1050,
  "newBadges": [
    {
      "id": "referral_master",
      "name": "Referral Master",
      "description": "Referred 5 friends",
      "icon": "🎯",
      "awardedAt": "2026-03-15T10:50:00Z"
    }
  ]
}
```

---

### 2. Get User Rewards
**Endpoint:** `GET /api/rewards/user-rewards`  
**Auth Required:** Yes

**Response (Success 200):**
```json
{
  "points": 1050,
  "badges": [
    {
      "id": "explorer",
      "name": "Explorer",
      "description": "Joined 10 trips",
      "icon": "🗺️",
      "awardedAt": "2026-02-20T08:15:00Z"
    },
    {
      "id": "referral_master",
      "name": "Referral Master",
      "description": "Referred 5 friends",
      "icon": "🎯",
      "awardedAt": "2026-03-10T14:30:00Z"
    },
    {
      "id": "group_leader",
      "name": "Group Leader",
      "description": "Led 3 groups",
      "icon": "👥",
      "awardedAt": "2026-03-15T10:50:00Z"
    }
  ],
  "referralCount": 5,
  "groupsCreated": 3,
  "groupsJoined": 8,
  "tripsCompleted": 12
}
```

---

## 🎫 PAYMENT → TICKET → QR CODE API

### 1. Generate Ticket
**Endpoint:** `POST /api/tickets/generate`  
**Auth Required:** Yes  
**Called After:** MPesa payment confirmed

**Request Body:**
```json
{
  "tripId": 1,
  "paymentId": "mpesa_pay_123456789",
  "amount": 8500
}
```

**Response (Success 200):**
```json
{
  "message": "Ticket generated successfully",
  "ticket": {
    "ticketId": "tkt_1710516000000_abc123xyz",
    "tripName": "Maasai Mara Safari",
    "tripDate": "2026-04-15",
    "buyerName": "John Doe",
    "status": "active",
    "qrCode": "data:image/svg+xml;base64,VElDS0VUOnRra18xNzEwNTE2MDAwMDAwX2FiYzEyM3h5enomdXAm..."
  }
}
```

---

### 2. Generate QR Code
**Endpoint:** `POST /api/qrcode/generate`  
**Auth Required:** Yes

**Request Body:**
```json
{
  "ticketId": "tkt_1710516000000_abc123xyz"
}
```

**Response (Success 200):**
```json
{
  "message": "QR Code generated",
  "ticketId": "tkt_1710516000000_abc123xyz",
  "qrCode": "data:image/svg+xml;base64,VElDS0VUOnRra18xNzEwNTE2MDAwMDAwX2FiYzEyM3h5enomdUp...",
  "tripName": "Maasai Mara Safari",
  "validity": "2026-04-14T10:30:00Z"
}
```

---

### 3. Get Ticket Details
**Endpoint:** `GET /api/tickets/:ticketId`  
**Auth Required:** Yes

**Example URL:** `GET /api/tickets/tkt_1710516000000_abc123xyz`

**Response (Success 200):**
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
    "buyerEmail": "john@example.com",
    "buyerName": "John Doe",
    "paymentId": "mpesa_pay_123456789",
    "amount": 8500,
    "status": "active",
    "generatedAt": "2026-03-15T10:30:00Z",
    "validUntil": "2026-04-14T10:30:00Z"
  },
  "qrCode": "data:image/svg+xml;base64,VElDS0VUOnRra18xNzEwNTE2MDAwMDAwX2FiYzEyM3h5enomdUp..."
}
```

---

### 4. Verify Ticket (Scan)
**Endpoint:** `POST /api/tickets/verify`  
**Auth Required:** No (for event staff)

**Request Body:**
```json
{
  "ticketId": "tkt_1710516000000_abc123xyz"
}
```

**Response (Success 200):**
```json
{
  "message": "Ticket verified",
  "ticket": {
    "ticketId": "tkt_1710516000000_abc123xyz",
    "buyerName": "John Doe",
    "tripName": "Maasai Mara Safari",
    "tripDate": "2026-04-15",
    "status": "scanned"
  }
}
```

**Error Responses:**
```json
// Already scanned
{ "error": "Ticket already scanned" }

// Expired
{ "error": "Ticket expired" }

// Not found
{ "error": "Ticket not found" }
```

---

## 📊 DATA STRUCTURE REFERENCE

### Group Data
```javascript
{
  groupId: "grp_1710516000000_abc123xyz",
  tripId: 1,
  groupName: "Safari Adventure Squad",
  createdBy: "user_123",
  creatorName: "John Doe",
  creatorEmail: "john@example.com",
  maxMembers: 10,
  members: [
    {
      userId: "user_123",
      name: "John Doe",
      email: "john@example.com",
      status: "joined", // or "confirmed", "maybe", "declined"
      joinedAt: Date
    }
  ],
  shareCode: "ABC123",
  shareLink: "http://localhost:3000/join-group?code=ABC123",
  createdAt: Date,
  updatedAt: Date
}
```

### Referral Data
```javascript
{
  referralCode: "ref_user_123_abc12345",
  referrerId: "user_123",
  referrerName: "John Doe",
  referrerEmail: "john@example.com",
  referralLink: "http://localhost:3000?ref=ref_user_123_abc12345",
  completions: [
    {
      referredUserId: "user_456",
      referredEmail: "jane@example.com",
      referredName: "Jane Smith",
      completedAt: Date,
      reward: 100
    }
  ],
  totalEarnings: 100,
  createdAt: Date
}
```

### Reward Data
```javascript
{
  points: 1050,
  badges: [
    {
      id: "explorer",
      name: "Explorer",
      description: "Joined 10 trips",
      icon: "🗺️",
      awardedAt: Date
    }
  ],
  referralCount: 5,
  groupsCreated: 3,
  groupsJoined: 8,
  tripsCompleted: 12,
  referralCodes: ["ref_user_123_abc12345"]
}
```

### Ticket Data
```javascript
{
  ticketId: "tkt_1710516000000_abc123xyz",
  tripId: 1,
  trip: {
    id: 1,
    name: "Maasai Mara Safari",
    date: "2026-04-15",
    location: "Maasai Mara National Reserve",
    cost: 8500
  },
  buyerEmail: "john@example.com",
  buyerName: "John Doe",
  paymentId: "mpesa_pay_123456789",
  amount: 8500,
  status: "active", // or "scanned"
  generatedAt: Date,
  validUntil: Date,
  scannedAt: Date // optional, set when verified
}
```

### QR Code Data
```javascript
{
  ticketId: "tkt_1710516000000_abc123xyz",
  data: "data:image/svg+xml;base64,VElDS0VUOnRra18...",
  text: "TICKET:tkt_1710516000000_abc123xyz|TRIP:Maasai Mara Safari|BUYER:John Doe|TIME:1710516000000",
  generatedAt: Date
}
```

---

## 🧪 TESTING WITH CURL

### Create Group
```bash
curl -X POST http://localhost:5000/api/groups/create \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "tripId": 1,
    "groupName": "Safari Squad",
    "maxMembers": 10
  }'
```

### Join Group
```bash
curl -X POST http://localhost:5000/api/groups/join \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "shareCode": "ABC123"
  }'
```

### Generate Referral Link
```bash
curl -X POST http://localhost:5000/api/referral/generate-link \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
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
    "paymentId": "mpesa_pay_123456789",
    "amount": 8500
  }'
```

---

## ✅ RESPONSE CODES

```
200 - Success
400 - Bad Request (missing fields, validation error)
403 - Forbidden (unauthorized action)
404 - Not Found (group, ticket, etc.)
500 - Server Error
```

---

**API Version:** 2.0.0  
**Last Updated:** March 15, 2026  
**All Endpoints:** Fully Functional
