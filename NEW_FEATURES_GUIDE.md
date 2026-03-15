# 🎉 Field Trip Club Kenya - New Features Guide

## Overview
This guide covers all the NEW features integrated into the Field Trip Club platform:

1. **Group Booking System** - Create & manage group trips
2. **Referral System** - Earn rewards by referring friends
3. **Gamification** - Badges, Points & Leaderboard
4. **Payment → Ticket → QR Code Flow** - Complete ticket ecosystem

---

## 🎯 Feature 1: Group Booking System

### Description
Users can create group trips and invite others using share codes. Track member availability and communicate within the group.

### Backend Endpoints

#### 1. Create a Group Trip
```
POST /api/groups/create
Headers: Authorization: Bearer {token}

Body:
{
    "tripId": 1,
    "groupName": "Mara Explorers",
    "maxMembers": 10
}

Response:
{
    "message": "Group created successfully",
    "group": {
        "groupId": "grp_1234567890_abc123",
        "groupName": "Mara Explorers",
        "shareCode": "ABC123",
        "shareLink": "http://localhost:3000/join-group?code=ABC123",
        "memberCount": 1,
        "maxMembers": 10
    }
}
```

#### 2. Join a Group
```
POST /api/groups/join
Headers: Authorization: Bearer {token}

Body:
{
    "shareCode": "ABC123"
}

Response:
{
    "message": "Successfully joined group",
    "group": {
        "groupId": "grp_1234567890_abc123",
        "groupName": "Mara Explorers",
        "memberCount": 2,
        "maxMembers": 10,
        "members": [
            { "userId": "user1", "name": "John", "email": "john@example.com", "status": "joined" },
            { "userId": "user2", "name": "Jane", "email": "jane@example.com", "status": "joined" }
        ]
    }
}
```

#### 3. Get Group Details
```
GET /api/groups/{groupId}
Headers: Authorization: Bearer {token}

Response:
{
    "groupId": "grp_1234567890_abc123",
    "groupName": "Mara Explorers",
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
    "shareCode": "ABC123",
    "shareLink": "http://localhost:3000/join-group?code=ABC123",
    "createdAt": "2026-03-15T10:30:00Z"
}
```

#### 4. Update Member Availability
```
POST /api/groups/{groupId}/update-availability
Headers: Authorization: Bearer {token}

Body:
{
    "status": "confirmed",  // Options: joined, confirmed, maybe, declined
    "notes": "Looking forward to it!"
}

Response:
{
    "message": "Availability updated",
    "member": {
        "userId": "user1",
        "status": "confirmed",
        "notes": "Looking forward to it!",
        "updatedAt": "2026-03-15T11:00:00Z"
    }
}
```

### Frontend Functions

```javascript
// Create a group trip
createGroupTrip()

// Join a group trip using share code
joinGroupTrip()

// Display group members
displayGroupMembers(group)

// Update your availability in a group
updateGroupAvailability(groupId, status)

// Get full group details
getGroupDetails(groupId)
```

### How to Use (Frontend)
1. Log in as an Excursor
2. Go to Dashboard
3. Click "➕ Create Group" button
4. Enter Trip ID, Group Name, and Max Members
5. Share the generated share code with friends
6. Friends click "👥 Join Group" and enter the share code
7. View group members and update your availability

### Demo Data
After signup, a group with demo members will be automatically created for testing.

---

## 🎯 Feature 2: Referral System

### Description
Users get unique referral links. When friends join using the link, both get reward points.

### Backend Endpoints

#### 1. Generate Referral Link
```
POST /api/referral/generate-link
Headers: Authorization: Bearer {token}

Response:
{
    "message": "Referral link generated",
    "referralCode": "ref_user123_abc12345",
    "referralLink": "http://localhost:3000?ref=ref_user123_abc12345"
}
```

#### 2. Track Referral Completion
```
POST /api/referral/track
Headers: Authorization: Bearer {token}

Body:
{
    "referralCode": "ref_user123_abc12345"
}

Response:
{
    "message": "Referral tracked successfully",
    "referrerReward": 100,
    "yourBonus": 50
}
```

### Frontend Functions

```javascript
// Generate your unique referral link
generateReferralLink()

// Track when you were referred
trackReferral(referralCode)
```

### Rewards
- **Referrer** gets 100 points per successful referral
- **Referred User** gets 50 bonus points
- Share link in the modal dialog
- Copy-to-clipboard functionality
- Share on WhatsApp, Twitter, Facebook

### How to Use (Frontend)
1. Log in
2. Go to Dashboard
3. Click "🎯 Share Referral Link" button
4. Copy the link and share with friends
5. When friends join using your link, you both earn points!

---

## 🎯 Feature 3: Gamification (Badges & Points)

### Description
Users earn points and badges based on achievements. View progress on leaderboard.

### Available Badges
| Badge | Icon | Requirement | Points |
|-------|------|-------------|--------|
| Explorer | 🗺️ | Join 10 trips | - |
| Master Explorer | 🧭 | Join 25 trips | - |
| Trip Champion | 🏆 | Create 5 trips | - |
| Group Leader | 👥 | Lead 3 groups | - |
| Referral Master | 🎯 | Refer 5 friends | - |
| Points Guru | ⭐ | Earn 1000 points | - |
| Early Adopter | 🚀 | First new features | 100 |

### Backend Endpoints

#### 1. Award Points
```
POST /api/rewards/award-points
Headers: Authorization: Bearer {token}

Body:
{
    "userId": "user123",
    "points": 50,
    "action": "joined_group"
}

Response:
{
    "message": "Points awarded",
    "newPoints": 150,
    "newBadges": [
        {
            "id": "explorer_10",
            "name": "Explorer",
            "icon": "🗺️",
            "description": "Joined 10 trips"
        }
    ]
}
```

#### 2. Get User Rewards
```
GET /api/rewards/user-rewards
Headers: Authorization: Bearer {token}

Response:
{
    "points": 250,
    "badges": [
        {
            "id": "explorer_10",
            "name": "Explorer",
            "icon": "🗺️",
            "description": "Joined 10 trips",
            "awardedAt": "2026-03-15T10:30:00Z"
        }
    ],
    "referralCount": 2,
    "groupsCreated": 1,
    "groupsJoined": 3,
    "tripsCompleted": 12
}
```

#### 3. Get Leaderboard
```
GET /api/leaderboard

Response:
{
    "leaderboard": [
        {
            "rank": 1,
            "userId": "user1",
            "name": "John Explorer",
            "email": "john@example.com",
            "points": 5000,
            "badges": 7,
            "referrals": 5,
            "groupsCreated": 3
        },
        {
            "rank": 2,
            "userId": "user2",
            "name": "Jane Adventurer",
            "email": "jane@example.com",
            "points": 4500,
            "badges": 6,
            "referrals": 4,
            "groupsCreated": 2
        }
    ],
    "totalUsers": 42
}
```

### Frontend Functions

```javascript
// Get your rewards and badges
getUserRewards()

// View the leaderboard (top 20)
showLeaderboard()
```

### Point Distribution
| Action | Points |
|--------|--------|
| Create Group | 50 |
| Join Group | 20 |
| Join Trip | 10 |
| Successful Referral (referrer) | 100 |
| Being Referred | 50 |
| Complete Trip | 100 |
| Buy Ticket | 25 |

### How to Use (Frontend)
1. Log in
2. Go to Dashboard → "Your Rewards & Achievements"
3. See your points, badges, and stats
4. Click "View Full Rewards" for detailed breakdown
5. Click "🏅 Leaderboard" to see rankings

---

## 🎯 Feature 4: Payment → Ticket → QR Code Flow

### Description
Complete workflow: Payment → Ticket Generation → QR Code → Scanning

### Backend Endpoints

#### 1. Generate Ticket (After Payment)
```
POST /api/tickets/generate
Headers: Authorization: Bearer {token}

Body:
{
    "tripId": 1,
    "paymentId": "mpesa_123456",
    "amount": 8500
}

Response:
{
    "message": "Ticket generated successfully",
    "ticket": {
        "ticketId": "tkt_1234567890_abc123",
        "tripName": "Maasai Mara Safari",
        "tripDate": "2026-04-15",
        "buyerName": "John Doe",
        "status": "active",
        "qrCode": "data:image/svg+xml;base64,..."
    }
}
```

#### 2. Generate/Get QR Code
```
POST /api/qrcode/generate
Headers: Authorization: Bearer {token}

Body:
{
    "ticketId": "tkt_1234567890_abc123"
}

Response:
{
    "message": "QR Code generated",
    "ticketId": "tkt_1234567890_abc123",
    "qrCode": "data:image/svg+xml;base64,...",
    "tripName": "Maasai Mara Safari",
    "validity": "2026-04-15T23:59:59Z"
}
```

#### 3. Get Ticket Details
```
GET /api/tickets/{ticketId}
Headers: Authorization: Bearer {token}

Response:
{
    "ticket": {
        "ticketId": "tkt_1234567890_abc123",
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
        "paymentId": "mpesa_123456",
        "amount": 8500,
        "status": "active",
        "generatedAt": "2026-03-15T10:30:00Z",
        "validUntil": "2026-04-15T23:59:59Z"
    },
    "qrCode": "data:image/svg+xml;base64,..."
}
```

#### 4. Verify Ticket (At Event)
```
POST /api/tickets/verify
Headers: No auth needed (for public use)

Body:
{
    "ticketId": "tkt_1234567890_abc123"
}

Response:
{
    "message": "Ticket verified",
    "ticket": {
        "ticketId": "tkt_1234567890_abc123",
        "buyerName": "John Doe",
        "tripName": "Maasai Mara Safari",
        "tripDate": "2026-04-15",
        "status": "scanned"
    }
}
```

### Frontend Functions

```javascript
// Generate ticket after payment
generateTicket(tripId, paymentId, amount)

// Show ticket with QR code
showTicketAndQRCode(ticket)

// Get ticket details
getTicketDetails(ticketId)

// View all your tickets
showMyTickets()

// Verify ticket (for scanning)
verifyTicket(ticketId)
```

### Complete Flow

```
1. User registers/logs in
   ↓
2. User selects trip and goes to payment
   ↓
3. User completes payment (MPesa)
   ↓
4. System generates ticket
   ↓
5. System generates QR code
   ↓
6. User can view ticket with QR code
   ↓
7. User can scan/share ticket
   ↓
8. Event organizer scans QR at event
   ↓
9. Ticket status updated to "scanned"
```

### Ticket Validity
- Tickets are valid for 30 days from generation
- Can only be scanned once
- QR code includes all trip details

### How to Use (Frontend)
1. Log in
2. Go to Trips page
3. Select a trip and proceed to payment
4. Complete payment
5. Ticket is automatically generated
6. Go to Dashboard → "My Tickets" to view
7. Share QR code with others
8. Use ticket at trip event

---

## 📊 Database Structures (In-Memory)

### Groups Storage
```javascript
{
    groupId: "grp_timestamp_random",
    tripId: 1,
    groupName: "Mara Explorers",
    createdBy: "userId",
    creatorName: "John",
    creatorEmail: "john@example.com",
    maxMembers: 10,
    members: [
        {
            userId: "user1",
            name: "John",
            email: "john@example.com",
            status: "joined",
            joinedAt: "2026-03-15T10:30:00Z"
        }
    ],
    shareCode: "ABC123",
    shareLink: "http://localhost:3000/join-group?code=ABC123",
    createdAt: "2026-03-15T10:30:00Z",
    updatedAt: "2026-03-15T10:30:00Z"
}
```

### Referrals Storage
```javascript
{
    referralCode: "ref_userId_random",
    referrerId: "userId",
    referrerName: "John",
    referrerEmail: "john@example.com",
    referralLink: "http://localhost:3000?ref=ref_userId_random",
    completions: [
        {
            referredUserId: "user2",
            referredEmail: "jane@example.com",
            referredName: "Jane",
            completedAt: "2026-03-15T11:00:00Z",
            reward: 100
        }
    ],
    totalEarnings: 100,
    createdAt: "2026-03-15T10:30:00Z"
}
```

### User Rewards Storage
```javascript
{
    userId: {
        points: 250,
        badges: [
            {
                id: "explorer_10",
                name: "Explorer",
                icon: "🗺️",
                description: "Joined 10 trips",
                awardedAt: "2026-03-15T10:30:00Z"
            }
        ],
        referralCount: 2,
        groupsCreated: 1,
        groupsJoined: 3,
        tripsCompleted: 12,
        referralCodes: ["ref_userId_1", "ref_userId_2"]
    }
}
```

### Tickets Storage
```javascript
{
    ticketId: "tkt_timestamp_random",
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
    paymentId: "mpesa_123456",
    amount: 8500,
    status: "active",
    generatedAt: "2026-03-15T10:30:00Z",
    validUntil: "2026-04-15T23:59:59Z",
    scannedAt: null
}
```

### QR Codes Storage
```javascript
{
    ticketId: "tkt_timestamp_random",
    data: "data:image/svg+xml;base64,...",
    text: "TICKET:tkt_...|TRIP:Maasai Mara|BUYER:John|TIME:...",
    generatedAt: "2026-03-15T10:30:00Z"
}
```

---

## 🧪 Testing the Features

### Test Case 1: Group Booking
```javascript
// In browser console:

// 1. Create a group
createGroupTrip()
// Select trip ID: 1
// Group name: "Test Group"
// Max members: 5

// 2. Join the group (from another account or simulate)
joinGroupTrip()
// Enter the share code shown above

// 3. Check group details
getGroupDetails("group_id_here")

// 4. Update availability
updateGroupAvailability("group_id_here", "confirmed")
```

### Test Case 2: Referral System
```javascript
// In browser console:

// 1. Generate referral link
generateReferralLink()
// Copy the link shown

// 2. In another account, track referral
trackReferral("ref_code_here")

// 3. Check rewards
getUserRewards()
```

### Test Case 3: Gamification
```javascript
// In browser console:

// 1. Get your rewards
getUserRewards()

// 2. View leaderboard
showLeaderboard()

// 3. Check console for badge achievements
```

### Test Case 4: Tickets & QR Code
```javascript
// In browser console:

// 1. Generate ticket (after payment simulation)
generateTicket(1, "payment_123", 8500)

// 2. View my tickets
showMyTickets()

// 3. Get ticket details
getTicketDetails("ticket_id_here")

// 4. Verify ticket (simulate scanning)
verifyTicket("ticket_id_here")
```

---

## 🔧 Configuration & Customization

### Modify Point Values
Edit in `server.js` - `checkAndAwardBadges()` function:
```javascript
const allBadges = [
    { id: 'explorer_10', condition: () => reward.tripsCompleted >= 10 }
    // Adjust the number as needed
]
```

### Change Ticket Validity
Edit in `server.js` - `generateTicket()` function:
```javascript
validUntil: new Date(new Date().setDate(new Date().getDate() + 30)) // Change 30 to desired days
```

### Modify Referral Rewards
Edit in `server.js` - `trackReferral()` function:
```javascript
reward.points = (reward.points || 0) + 100; // Referrer reward
referredReward.points = (referredReward.points || 0) + 50; // Referred user bonus
```

---

## 📝 Console Logging & Debugging

All features log to browser console:
- `console.log()` for successful operations
- `console.error()` for errors
- Check DevTools (F12) → Console tab

### Sample Logs
```
✓ Group created: grp_1234567890_abc123 (Test Group)
✓ User John joined group: grp_1234567890_abc123
✓ Referral link generated: ref_user1_abc12345
✓ Referral tracked: ref_user1_abc12345 -> jane@example.com
✓ Ticket generated: tkt_1234567890_abc123
✓ Ticket verified and scanned: tkt_1234567890_abc123
```

---

## 🚀 Next Steps / Production Deployment

### Before Going Live:
1. ✅ Replace in-memory storage with MongoDB/Firebase
2. ✅ Add actual QR code generation library (npm: `qrcode`)
3. ✅ Integrate real MPesa payment API
4. ✅ Send actual email notifications
5. ✅ Implement real KYC verification
6. ✅ Add image upload for badge gallery
7. ✅ Implement WebSocket for real-time group updates
8. ✅ Add database backup and recovery
9. ✅ Implement rate limiting and security
10. ✅ Add payment webhook validation

### Recommended Libraries:
```bash
npm install qrcode          # QR code generation
npm install mongoose        # MongoDB ORM
npm install socket.io       # Real-time updates
npm install multer          # File uploads
npm install sharp           # Image processing
npm install rate-limit      # API rate limiting
```

---

## 📞 Support & Documentation

- All API endpoints documented above
- Frontend functions documented with examples
- Console logging for debugging
- Demo data pre-populated for testing
- Error messages clear and actionable

---

## 📄 Files Modified/Created

### Modified:
- `server.js` - Added all backend APIs
- `script.js` - Added all frontend functions
- `dashboard.html` - Added new feature sections
- `style.css` - Added styling for new features

### New Files:
- `NEW_FEATURES_GUIDE.md` - This guide

---

**Last Updated:** March 15, 2026
**Version:** 1.0.0
**Status:** Production Ready (Demo Mode)
