require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// In-memory storage for demo (replace with Firebase/MongoDB in production)
const users = new Map();
const trips = new Map();
const otpStorage = new Map(); // email -> { otp, expiresAt }
const tripsDb = [
    {
        id: 1,
        name: "Maasai Mara Safari",
        date: "2026-04-15",
        location: "Maasai Mara National Reserve",
        description: "Experience the incredible wildlife of Maasai Mara with expert guides. Witness the big five in their natural habitat.",
        cost: 8500,
        icon: "🦁",
        capacity: 20,
        registered: 14,
        createdBy: null
    },
    {
        id: 2,
        name: "Mount Kenya Trek",
        date: "2026-05-01",
        location: "Mount Kenya, Nyeri County",
        description: "Challenge yourself with a guided trek up Mount Kenya. Suitable for all fitness levels with proper preparation.",
        cost: 12000,
        icon: "🏔️",
        capacity: 15,
        registered: 8,
        createdBy: null
    },
    {
        id: 3,
        name: "Mombasa Beach Escape",
        date: "2026-05-20",
        location: "Mombasa Beach",
        description: "Relax on pristine beaches, enjoy water sports, and experience the coastal culture of Kenya.",
        cost: 6000,
        icon: "🏖️",
        capacity: 30,
        registered: 22,
        createdBy: null
    },
    {
        id: 4,
        name: "Hell's Gate National Park",
        date: "2026-04-08",
        location: "Hell's Gate, Nairobi",
        description: "Hike through dramatic gorges and enjoy geothermal hot springs in this unique national park.",
        cost: 5000,
        icon: "🌋",
        capacity: 25,
        registered: 18,
        createdBy: null
    }
];

// Email configuration
const emailConfig = {
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'test@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'test_password'
    }
};

const transporter = nodemailer.createTransport(emailConfig);

// Utility functions
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOTPEmail = async (email, otp) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Field Trip Club - Your OTP',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2ecc71;">🌍 Field Trip Club Kenya</h2>
                    <h3>Email Verification Required</h3>
                    <p>Your One-Time Password (OTP) is:</p>
                    <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; text-align: center;">
                        <h1 style="color: #2ecc71; letter-spacing: 5px; margin: 0;">${otp}</h1>
                    </div>
                    <p style="margin-top: 20px;">
                        <strong>⏱️ This OTP will expire in 10 minutes.</strong>
                    </p>
                    <p style="color: #e74c3c;">
                        🔒 Do not share this code with anyone. Field Trip Club staff will never ask for your OTP.
                    </p>
                    <hr style="margin-top: 30px; border: none; border-top: 1px solid #ddd;">
                    <p style="font-size: 12px; color: #999;">
                        If you did not request this OTP, please ignore this email.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✓ OTP email sent to ${email}`);
        return true;
    } catch (error) {
        console.error('Email send error:', error);
        // Fallback: Email service issue
        console.log(`⚠️ Email service unavailable for ${email}. Using demo mode.`);
        return false;
    }
};

const generateJWT = (userId, email) => {
    return jwt.sign(
        { userId, email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

const verifyJWT = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null;
    }
};

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const decoded = verifyJWT(token);
    if (!decoded) return res.status(401).json({ error: 'Invalid token' });

    req.user = decoded;
    next();
};

// ============ AUTHENTICATION ROUTES ============

// Sign Up
app.post('/api/auth/signup', async (req, res) => {
    try {
        const { email, password, name, phone, userType } = req.body;

        if (!email || !password || !name || !userType) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (users.has(email)) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user object
        const userId = Date.now().toString();
        const newUser = {
            userId,
            email,
            password: hashedPassword,
            name,
            phone: phone || '',
            userType, // 'excursor' or 'event_holder'
            verified: false,
            kycStatus: userType === 'event_holder' ? 'pending' : 'not_required',
            paymentStatus: userType === 'event_holder' ? 'pending' : 'completed',
            tripsJoined: [],
            createdAt: new Date()
        };

        users.set(email, newUser);

        // Send OTP
        const otp = generateOTP();
        otpStorage.set(email, {
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
        });

        await sendOTPEmail(email, otp);

        res.json({
            message: 'User registered. OTP sent to email.',
            userType,
            email,
            requiresKYC: userType === 'event_holder'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Signup failed' });
    }
});

// Verify OTP
app.post('/api/auth/verify-otp', (req, res) => {
    try {
        const { email, otp } = req.body;

        const storedOtp = otpStorage.get(email);
        if (!storedOtp) {
            return res.status(400).json({ error: 'OTP not found. Please request a new OTP.' });
        }

        if (storedOtp.expiresAt < Date.now()) {
            otpStorage.delete(email);
            return res.status(400).json({ error: 'OTP has expired. Please request a new one.' });
        }

        if (storedOtp.otp !== otp) {
            return res.status(400).json({ error: 'Invalid OTP. Please try again.' });
        }

        // Mark user as verified
        const user = users.get(email);
        user.verified = true;
        otpStorage.delete(email);

        // Generate JWT
        const token = generateJWT(user.userId, email);

        res.json({
            message: 'OTP verified',
            token,
            user: {
                email: user.email,
                name: user.name,
                userType: user.userType,
                kycStatus: user.kycStatus,
                paymentStatus: user.paymentStatus
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'OTP verification failed' });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = users.get(email);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Send OTP
        const otp = generateOTP();
        otpStorage.set(email, {
            otp,
            expiresAt: Date.now() + 10 * 60 * 1000
        });

        await sendOTPEmail(email, otp);

        res.json({ message: 'OTP sent to email', email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Forgot Password
app.post('/api/auth/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        const user = users.get(email);
        if (!user) {
            // Don't reveal if email exists (security best practice)
            return res.json({ 
                message: 'If an account with this email exists, a password reset link has been sent.',
                email
            });
        }

        // Generate password reset token
        const resetToken = generateOTP(); // Using OTP as token
        const resetData = {
            email,
            token: resetToken,
            expiresAt: Date.now() + 30 * 60 * 1000, // 30 minutes
            createdAt: new Date()
        };

        // Store reset token (in production, use database)
        if (!otpStorage.has(email + '_reset')) {
            otpStorage.set(email + '_reset', resetData);
        }

        const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password.html?token=${resetToken}&email=${email}`;

        // Send password reset email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Field Trip Club - Password Reset Request',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2ecc71;">🌍 Field Trip Club Kenya</h2>
                    <h3>Password Reset Request</h3>
                    <p>Hello ${user.name},</p>
                    <p>You requested to reset your password. Click the button below to set a new password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetLink}" style="background: #2ecc71; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p style="margin-top: 20px;">Or use this code: <strong>${resetToken}</strong></p>
                    <p style="color: #e74c3c;">
                        ⏱️ This link will expire in 30 minutes.
                    </p>
                    <p style="color: #999; font-size: 12px; margin-top: 30px;">
                        If you did not request this password reset, please ignore this email. Your password will remain unchanged.
                    </p>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`✓ Password reset email sent to ${email}`);
        } catch (err) {
            console.error('Password reset email error:', err);
            // Continue anyway - in demo mode
        }

        res.json({ 
            message: 'Password reset link sent to your email',
            email
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Forgot password failed' });
    }
});

// Reset Password with token
app.post('/api/auth/reset-password', async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;

        if (!email || !token || !newPassword) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const resetData = otpStorage.get(email + '_reset');
        if (!resetData) {
            return res.status(400).json({ error: 'No password reset request found' });
        }

        if (resetData.token !== token) {
            return res.status(400).json({ error: 'Invalid reset token' });
        }

        if (resetData.expiresAt < Date.now()) {
            otpStorage.delete(email + '_reset');
            return res.status(400).json({ error: 'Reset token has expired' });
        }

        const user = users.get(email);
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Update password
        user.password = await bcrypt.hash(newPassword, 10);
        otpStorage.delete(email + '_reset');

        console.log(`✓ Password reset for ${email}`);

        res.json({
            message: 'Password has been reset successfully',
            email
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Password reset failed' });
    }
});

// ============ KYC ROUTES ============

// KYC storage
const kycStorage = new Map(); // userId -> kycData

// Start KYC Verification
app.post('/api/kyc/start', authMiddleware, async (req, res) => {
    try {
        const { nationalId, firstName, lastName, dateOfBirth, idType } = req.body;
        const user = users.get(req.user.email);

        if (user.userType !== 'event_holder') {
            return res.status(403).json({ error: 'Only Event Holders can undergo KYC' });
        }

        // Validate input
        if (!nationalId || !firstName || !lastName || !dateOfBirth || !idType) {
            return res.status(400).json({ error: 'Missing required KYC fields' });
        }

        // Check if already verified
        if (user.kycStatus === 'verified') {
            return res.status(400).json({ error: 'KYC already verified' });
        }

        // Store KYC submission
        const kycData = {
            userId: user.userId,
            email: user.email,
            nationalId,
            firstName,
            lastName,
            dateOfBirth,
            idType, // 'national_id', 'passport', 'driving_license'
            submittedAt: new Date(),
            status: 'pending'
        };

        // Perform mock KYC verification
        const kycResult = await performMockKYCVerification(kycData);

        if (kycResult.success) {
            user.kycStatus = 'verified';
            user.paymentStatus = 'pending'; // Now they can proceed to payment
            kycData.status = 'verified';
            kycData.verifiedAt = new Date();
            kycStorage.set(user.userId, kycData);

            console.log(`✓ KYC verified for ${user.name} (${user.email})`);

            res.json({
                message: 'KYC verification successful',
                status: 'verified',
                nextStep: 'Complete payment to start creating trips'
            });
        } else {
            user.kycStatus = 'failed';
            kycData.status = 'failed';
            kycData.failureReason = kycResult.reason;
            kycStorage.set(user.userId, kycData);

            console.log(`✗ KYC failed for ${user.name}: ${kycResult.reason}`);

            res.status(400).json({
                error: 'KYC verification failed',
                reason: kycResult.reason,
                message: 'Please ensure all information is correct and try again'
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'KYC verification error' });
    }
});

// Get KYC status
app.get('/api/kyc/status', authMiddleware, (req, res) => {
    try {
        const user = users.get(req.user.email);

        if (user.userType !== 'event_holder') {
            return res.status(403).json({ error: 'Only Event Holders have KYC' });
        }

        const kycData = kycStorage.get(user.userId);

        res.json({
            kycStatus: user.kycStatus,
            kycData: kycData || null
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get KYC status' });
    }
});

// Retry KYC (after failure)
app.post('/api/kyc/retry', authMiddleware, (req, res) => {
    try {
        const user = users.get(req.user.email);

        if (user.userType !== 'event_holder') {
            return res.status(403).json({ error: 'Only Event Holders can retry KYC' });
        }

        if (user.kycStatus !== 'failed') {
            return res.status(400).json({ error: 'Can only retry failed KYC' });
        }

        // Reset KYC status for retry
        user.kycStatus = 'pending';

        res.json({
            message: 'KYC status reset. Please submit again.',
            kycStatus: 'pending'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to reset KYC' });
    }
});

// Mock KYC verification function
async function performMockKYCVerification(kycData) {
    // In demo/sandbox mode, implement realistic verification logic
    // This simulates a real KYC provider like Smile ID, AuthentiAfrica, etc.
    
    const validationRules = [
        {
            check: () => kycData.firstName.length > 2 && kycData.firstName.length < 50,
            reason: 'First name must be between 3 and 50 characters'
        },
        {
            check: () => kycData.lastName.length > 2 && kycData.lastName.length < 50,
            reason: 'Last name must be between 3 and 50 characters'
        },
        {
            check: () => /^[0-9]{6,15}$/.test(kycData.nationalId),
            reason: 'National ID must be between 6 and 15 digits'
        },
        {
            check: () => {
                const dob = new Date(kycData.dateOfBirth);
                const age = new Date().getFullYear() - dob.getFullYear();
                return age >= 18 && age <= 120;
            },
            reason: 'You must be at least 18 years old'
        },
        {
            check: () => ['national_id', 'passport', 'driving_license'].includes(kycData.idType),
            reason: 'Invalid ID type'
        }
    ];

    // Check all validation rules
    for (let rule of validationRules) {
        if (!rule.check()) {
            return {
                success: false,
                reason: rule.reason
            };
        }
    }

    // In demo mode, 95% success rate for valid data
    const demoSuccessRate = 0.95;
    const isSuccessful = Math.random() < demoSuccessRate;

    if (!isSuccessful) {
        return {
            success: false,
            reason: 'Document verification failed. Please try again or contact support.'
        };
    }

    return {
        success: true
    };
}

// MPesa Payment Initiation Function
async function initiateMPesaPayment(paymentData) {
    // This function uses MPesa credentials from environment variables
    // MPESA_CONSUMER_KEY and MPESA_CONSUMER_SECRET from .env
    const {
        phone,
        amount,
        description
    } = paymentData;

    // Validate environment variables are set
    if (!process.env.MPESA_CONSUMER_KEY || !process.env.MPESA_CONSUMER_SECRET) {
        console.error('MPesa credentials not configured in .env');
        throw new Error('MPesa credentials not configured');
    }

    // Demo mode: Return mock transaction
    // In production, integrate with Safaricom Daraja API
    const transactionId = 'TXN' + Date.now();
    console.log(`MPesa Payment Initiated (Demo Mode)`);
    console.log(`  Transaction ID: ${transactionId}`);
    console.log(`  Phone: ${phone}`);
    console.log(`  Amount: KES ${amount}`);
    console.log(`  Description: ${description}`);
    console.log(`  Shortcode: ${process.env.MPESA_SHORTCODE}`);

    return {
        transactionId,
        phone,
        amount,
        description,
        status: 'pending',
        timestamp: new Date().toISOString()
    };
}

// ============ PAYMENT ROUTES ============

// Initiate MPesa Payment
app.post('/api/payment/mpesa', authMiddleware, async (req, res) => {
    try {
        const user = users.get(req.user.email);

        if (user.userType !== 'event_holder') {
            return res.status(403).json({ error: 'Only Event Holders pay registration fee' });
        }

        if (user.kycStatus !== 'verified') {
            return res.status(400).json({ error: 'Complete KYC verification first' });
        }

        const amount = 999; // KES 999
        const phone = user.phone;

        // Integrate MPesa Till API using credentials from .env
        // Uses MPESA_CONSUMER_KEY, MPESA_CONSUMER_SECRET, MPESA_SHORTCODE, MPESA_CALLBACK_URL
        // https://developer.safaricom.co.ke/

        const paymentResult = await initiateMPesaPayment({
            phone,
            amount,
            description: 'Field Trip Club Event Holder Registration'
        });

        res.json({
            message: 'Payment initiated',
            paymentDetails: {
                amount,
                phone,
                shortcode: process.env.MPESA_SHORTCODE,
                status: 'pending'
            },
            transactionId: paymentResult.transactionId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Payment initiation failed' });
    }
});

// Verify Payment
app.post('/api/payment/verify', authMiddleware, async (req, res) => {
    try {
        const { transactionId, tripId, amount } = req.body;
        const user = users.get(req.user.email);

        if (!transactionId || !tripId) {
            return res.status(400).json({ error: 'Missing transaction or trip ID' });
        }

        const trip = tripsDb.find(t => t.id === parseInt(tripId));
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        // In production, verify payment with MPesa provider
        // For demo mode, assume successful payment
        const paymentSuccess = true;

        if (paymentSuccess) {
            // Generate ticket ONLY after successful payment
            const ticketId = `tkt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            
            const ticketData = {
                ticketId,
                tripId: trip.id,
                trip: {
                    id: trip.id,
                    name: trip.name,
                    date: trip.date,
                    location: trip.location,
                    cost: trip.cost
                },
                buyerEmail: user.email,
                buyerName: user.name,
                transactionId,
                amount: amount || trip.cost,
                status: 'active',
                generatedAt: new Date(),
                validUntil: new Date(new Date().setDate(new Date().getDate() + 30)) // Valid for 30 days
            };

            tickets.set(ticketId, ticketData);

            // Generate QR code (Base64 encoded)
            const qrCodeData = generateQRCodeData(ticketId, trip.name, user.name);
            qrCodes.set(ticketId, qrCodeData);

            // Add trip to user's joined trips if not already there
            if (!user.tripsJoined) user.tripsJoined = [];
            if (!user.tripsJoined.includes(parseInt(tripId))) {
                user.tripsJoined.push(parseInt(tripId));
                trip.registered++;
            }

            // Award points for booking trip
            const reward = userRewards.get(user.userId) || { 
                points: 0, 
                badges: [], 
                referralCount: 0, 
                groupsCreated: 0, 
                groupsJoined: 0, 
                tripsCompleted: 0 
            };
            reward.points = (reward.points || 0) + 10; // 10 points for booking
            reward.tripsCompleted = (reward.tripsCompleted || 0) + 1;
            userRewards.set(user.userId, reward);

            console.log(`✓ Payment verified for ticket ${ticketId}`);
            console.log(`✓ Ticket generated after successful payment`);

            res.json({
                message: 'Payment verified and ticket generated',
                status: 'completed',
                ticket: {
                    ticketId,
                    tripName: trip.name,
                    tripDate: trip.date,
                    buyerName: user.name,
                    amount: amount || trip.cost,
                    status: 'active',
                    validUntil: ticketData.validUntil,
                    qrCode: qrCodeData.data
                }
            });
        } else {
            res.status(400).json({ error: 'Payment verification failed' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Payment verification failed' });
    }
});

// ============ TRIPS ROUTES ============

// Get all trips
app.get('/api/trips', (req, res) => {
    res.json(tripsDb);
});

// Create new trip (Event Holder only)
app.post('/api/trips', authMiddleware, (req, res) => {
    try {
        const { name, date, location, description, cost, capacity } = req.body;
        const user = users.get(req.user.email);

        if (user.userType !== 'event_holder') {
            return res.status(403).json({ error: 'Only Event Holders can create trips' });
        }

        if (user.paymentStatus !== 'completed') {
            return res.status(403).json({ error: 'Complete payment first' });
        }

        const newTrip = {
            id: Math.max(...tripsDb.map(t => t.id), 0) + 1,
            name,
            date,
            location,
            description,
            cost: parseFloat(cost),
            capacity: parseInt(capacity),
            icon: '🎯',
            registered: 0,
            createdBy: user.userId,
            createdAt: new Date()
        };

        tripsDb.push(newTrip);
        res.status(201).json(newTrip);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create trip' });
    }
});

// Update trip cost (Event Holder only)
app.put('/api/trips/:id', authMiddleware, (req, res) => {
    try {
        const { id } = req.params;
        const { cost } = req.body;
        const user = users.get(req.user.email);

        if (user.userType !== 'event_holder') {
            return res.status(403).json({ error: 'Only Event Holders can edit trips' });
        }

        const trip = tripsDb.find(t => t.id === parseInt(id));
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        if (trip.createdBy !== user.userId) {
            return res.status(403).json({ error: 'Can only edit your own trips' });
        }

        trip.cost = parseFloat(cost);
        res.json(trip);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update trip' });
    }
});

// Join trip (Excursor only)
app.post('/api/trips/:id/join', authMiddleware, (req, res) => {
    try {
        const { id } = req.params;
        const user = users.get(req.user.email);

        if (user.userType !== 'excursor') {
            return res.status(403).json({ error: 'Only Excursors can join trips' });
        }

        const trip = tripsDb.find(t => t.id === parseInt(id));
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        if (trip.registered >= trip.capacity) {
            return res.status(400).json({ error: 'Trip is fully booked' });
        }

        if (!user.tripsJoined) user.tripsJoined = [];
        if (user.tripsJoined.includes(parseInt(id))) {
            return res.status(400).json({ error: 'Already joined this trip' });
        }

        trip.registered++;
        user.tripsJoined.push(parseInt(id));

        res.json({
            message: 'Successfully joined trip',
            trip,
            userTrips: user.tripsJoined
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to join trip' });
    }
});

// ============ USER ROUTES ============

// Get user profile
app.get('/api/user/profile', authMiddleware, (req, res) => {
    try {
        const user = users.get(req.user.email);
        res.json({
            userId: user.userId,
            email: user.email,
            name: user.name,
            phone: user.phone,
            userType: user.userType,
            verified: user.verified,
            kycStatus: user.kycStatus,
            paymentStatus: user.paymentStatus,
            tripsJoined: user.tripsJoined || []
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get profile' });
    }
});

// Get user dashboard
app.get('/api/user/dashboard', authMiddleware, (req, res) => {
    try {
        const user = users.get(req.user.email);
        let dashboardData = {
            userType: user.userType,
            name: user.name,
            email: user.email
        };

        if (user.userType === 'excursor') {
            const joinedTrips = tripsDb.filter(t => user.tripsJoined?.includes(t.id));
            dashboardData.trips = joinedTrips;
            dashboardData.totalTripsJoined = joinedTrips.length;
        } else if (user.userType === 'event_holder') {
            const createdTrips = tripsDb.filter(t => t.createdBy === user.userId);
            dashboardData.trips = createdTrips;
            dashboardData.totalTripsCreated = createdTrips.length;
            dashboardData.kycStatus = user.kycStatus;
            dashboardData.paymentStatus = user.paymentStatus;
        }

        res.json(dashboardData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get dashboard' });
    }
});

// ============ NEW FEATURES: GROUP BOOKING, REFERRALS, GAMIFICATION, PAYMENTS & TICKETS ============

// In-memory storage for new features
const groups = new Map(); // groupId -> groupData
const referrals = new Map(); // referralCode -> referralData
const userRewards = new Map(); // userId -> { points, badges, leaderboardRank }
const tickets = new Map(); // ticketId -> ticketData
const qrCodes = new Map(); // ticketId -> qrCodeData

// Initialize demo rewards for existing users
const initializeDemoRewards = () => {
    for (let [email, user] of users) {
        if (!userRewards.has(user.userId)) {
            userRewards.set(user.userId, {
                points: 0,
                badges: [],
                referralCount: 0,
                groupsCreated: 0,
                groupsJoined: 0,
                tripsCompleted: 0
            });
        }
    }
};

// ============ GROUP BOOKING ENDPOINTS ============

// Create a group trip
app.post('/api/groups/create', authMiddleware, (req, res) => {
    try {
        const { tripId, groupName, maxMembers } = req.body;
        const user = users.get(req.user.email);

        if (!tripId || !groupName || !maxMembers) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        if (user.userType !== 'excursor') {
            return res.status(403).json({ error: 'Only excursors can create groups' });
        }

        const groupId = `grp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const shareCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        
        const groupData = {
            groupId,
            tripId,
            groupName,
            createdBy: user.userId,
            creatorName: user.name,
            creatorEmail: user.email,
            maxMembers: parseInt(maxMembers),
            members: [{ userId: user.userId, name: user.name, email: user.email, status: 'joined', joinedAt: new Date() }],
            shareCode,
            shareLink: `${process.env.APP_URL || 'http://localhost:3000'}/join-group?code=${shareCode}`,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        groups.set(groupId, groupData);

        // Award points for group creation
        const reward = userRewards.get(user.userId) || { points: 0, badges: [], referralCount: 0, groupsCreated: 0, groupsJoined: 0, tripsCompleted: 0 };
        reward.groupsCreated = (reward.groupsCreated || 0) + 1;
        reward.points = (reward.points || 0) + 50;
        userRewards.set(user.userId, reward);

        console.log(`✓ Group created: ${groupId} (${groupName})`);

        res.json({
            message: 'Group created successfully',
            group: {
                groupId,
                groupName,
                shareCode,
                shareLink: groupData.shareLink,
                memberCount: groupData.members.length,
                maxMembers
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create group' });
    }
});

// Join a group trip using share code
app.post('/api/groups/join', authMiddleware, (req, res) => {
    try {
        const { shareCode } = req.body;
        const user = users.get(req.user.email);

        if (!shareCode) {
            return res.status(400).json({ error: 'Share code required' });
        }

        // Find group by share code
        let groupId = null;
        let groupData = null;

        for (let [gId, gData] of groups) {
            if (gData.shareCode === shareCode) {
                groupId = gId;
                groupData = gData;
                break;
            }
        }

        if (!groupData) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Check if already a member
        if (groupData.members.some(m => m.userId === user.userId)) {
            return res.status(400).json({ error: 'Already a member of this group' });
        }

        // Check capacity
        if (groupData.members.length >= groupData.maxMembers) {
            return res.status(400).json({ error: 'Group is full' });
        }

        // Add member
        groupData.members.push({
            userId: user.userId,
            name: user.name,
            email: user.email,
            status: 'joined',
            joinedAt: new Date()
        });
        groupData.updatedAt = new Date();

        // Award points for joining a group
        const reward = userRewards.get(user.userId) || { points: 0, badges: [], referralCount: 0, groupsCreated: 0, groupsJoined: 0, tripsCompleted: 0 };
        reward.groupsJoined = (reward.groupsJoined || 0) + 1;
        reward.points = (reward.points || 0) + 20;
        userRewards.set(user.userId, reward);

        console.log(`✓ User ${user.name} joined group: ${groupId}`);

        res.json({
            message: 'Successfully joined group',
            group: {
                groupId,
                groupName: groupData.groupName,
                memberCount: groupData.members.length,
                maxMembers: groupData.maxMembers,
                members: groupData.members
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to join group' });
    }
});

// Get group details
app.get('/api/groups/:groupId', authMiddleware, (req, res) => {
    try {
        const { groupId } = req.params;
        const groupData = groups.get(groupId);

        if (!groupData) {
            return res.status(404).json({ error: 'Group not found' });
        }

        res.json({
            groupId,
            groupName: groupData.groupName,
            creatorName: groupData.creatorName,
            memberCount: groupData.members.length,
            maxMembers: groupData.maxMembers,
            members: groupData.members,
            shareCode: groupData.shareCode,
            shareLink: groupData.shareLink,
            createdAt: groupData.createdAt
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get group details' });
    }
});

// Update group member availability
app.post('/api/groups/:groupId/update-availability', authMiddleware, (req, res) => {
    try {
        const { groupId } = req.params;
        const { status, notes } = req.body;
        const user = users.get(req.user.email);
        const groupData = groups.get(groupId);

        if (!groupData) {
            return res.status(404).json({ error: 'Group not found' });
        }

        const member = groupData.members.find(m => m.userId === user.userId);
        if (!member) {
            return res.status(403).json({ error: 'Not a member of this group' });
        }

        // Update status: 'joined', 'confirmed', 'maybe', 'declined'
        member.status = status;
        member.notes = notes || '';
        member.updatedAt = new Date();
        groupData.updatedAt = new Date();

        console.log(`✓ Updated ${user.name} availability in group ${groupId}: ${status}`);

        res.json({
            message: 'Availability updated',
            member
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update availability' });
    }
});

// ============ REFERRAL SYSTEM ENDPOINTS ============

// Generate referral link
app.post('/api/referral/generate-link', authMiddleware, (req, res) => {
    try {
        const user = users.get(req.user.email);
        const referralCode = `ref_${user.userId}_${Math.random().toString(36).substring(2, 10)}`;
        
        const referralData = {
            referralCode,
            referrerId: user.userId,
            referrerName: user.name,
            referrerEmail: user.email,
            referralLink: `${process.env.APP_URL || 'http://localhost:3000'}?ref=${referralCode}`,
            completions: [],
            totalEarnings: 0,
            createdAt: new Date()
        };

        referrals.set(referralCode, referralData);

        // Initialize referral count for this user if not exists
        const reward = userRewards.get(user.userId) || { points: 0, badges: [], referralCount: 0, groupsCreated: 0, groupsJoined: 0, tripsCompleted: 0 };
        if (!reward.referralCodes) reward.referralCodes = [];
        reward.referralCodes.push(referralCode);
        userRewards.set(user.userId, reward);

        console.log(`✓ Referral link generated: ${referralCode}`);

        res.json({
            message: 'Referral link generated',
            referralCode,
            referralLink: referralData.referralLink
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate referral link' });
    }
});

// Track referral completion
app.post('/api/referral/track', authMiddleware, (req, res) => {
    try {
        const { referralCode } = req.body;
        const user = users.get(req.user.email);

        if (!referralCode) {
            return res.status(400).json({ error: 'Referral code required' });
        }

        const referralData = referrals.get(referralCode);
        if (!referralData) {
            return res.status(404).json({ error: 'Invalid referral code' });
        }

        // Check if already tracked
        if (referralData.completions.some(c => c.referredUserId === user.userId)) {
            return res.status(400).json({ error: 'Already counted as referral' });
        }

        // Record completion
        referralData.completions.push({
            referredUserId: user.userId,
            referredEmail: user.email,
            referredName: user.name,
            completedAt: new Date(),
            reward: 100 // Points earned by referrer
        });

        referralData.totalEarnings += 100;

        // Award points to referrer
        const referrerReward = userRewards.get(referralData.referrerId) || { points: 0, badges: [], referralCount: 0, groupsCreated: 0, groupsJoined: 0, tripsCompleted: 0 };
        referrerReward.referralCount = (referrerReward.referralCount || 0) + 1;
        referrerReward.points = (referrerReward.points || 0) + 100;
        userRewards.set(referralData.referrerId, referrerReward);

        // Award points to referred user
        const referredReward = userRewards.get(user.userId) || { points: 0, badges: [], referralCount: 0, groupsCreated: 0, groupsJoined: 0, tripsCompleted: 0 };
        referredReward.points = (referredReward.points || 0) + 50; // Bonus for being referred
        userRewards.set(user.userId, referredReward);

        console.log(`✓ Referral tracked: ${referralCode} -> ${user.email}`);

        res.json({
            message: 'Referral tracked successfully',
            referrerReward: 100,
            yourBonus: 50
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to track referral' });
    }
});

// ============ REWARDS & GAMIFICATION ENDPOINTS ============

// Award points and check for badges
app.post('/api/rewards/award-points', authMiddleware, (req, res) => {
    try {
        const { userId, points, action } = req.body;
        const user = users.get(req.user.email);

        if (!userId || !points) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const reward = userRewards.get(userId) || { points: 0, badges: [], referralCount: 0, groupsCreated: 0, groupsJoined: 0, tripsCompleted: 0 };
        reward.points = (reward.points || 0) + points;

        // Check for badges
        const badges = checkAndAwardBadges(reward);

        userRewards.set(userId, reward);

        console.log(`✓ Awarded ${points} points to ${userId} for ${action}`);

        res.json({
            message: 'Points awarded',
            newPoints: reward.points,
            newBadges: badges
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to award points' });
    }
});

// Check and award badges based on achievements
function checkAndAwardBadges(reward) {
    const newBadges = [];
    const allBadges = [
        { id: 'explorer_10', name: 'Explorer', description: 'Joined 10 trips', icon: '🗺️', condition: () => reward.tripsCompleted >= 10 },
        { id: 'explorer_25', name: 'Master Explorer', description: 'Joined 25 trips', icon: '🧭', condition: () => reward.tripsCompleted >= 25 },
        { id: 'trip_champion', name: 'Trip Champion', description: 'Created 5 trips', icon: '🏆', condition: () => reward.groupsCreated >= 5 },
        { id: 'group_leader', name: 'Group Leader', description: 'Led 3 groups', icon: '👥', condition: () => reward.groupsCreated >= 3 },
        { id: 'referral_master', name: 'Referral Master', description: 'Referred 5 friends', icon: '🎯', condition: () => reward.referralCount >= 5 },
        { id: 'points_guru', name: 'Points Guru', description: 'Earned 1000 points', icon: '⭐', condition: () => reward.points >= 1000 },
        { id: 'early_adopter', name: 'Early Adopter', description: 'First to use new features', icon: '🚀', condition: () => reward.points >= 100 }
    ];

    for (let badge of allBadges) {
        if (badge.condition() && !reward.badges.some(b => b.id === badge.id)) {
            reward.badges.push({ ...badge, awardedAt: new Date() });
            newBadges.push(badge);
        }
    }

    return newBadges;
}

// Get user rewards and leaderboard position
app.get('/api/rewards/user-rewards', authMiddleware, (req, res) => {
    try {
        const user = users.get(req.user.email);
        const reward = userRewards.get(user.userId);

        if (!reward) {
            return res.json({
                points: 0,
                badges: [],
                referralCount: 0,
                groupsCreated: 0,
                groupsJoined: 0,
                tripsCompleted: 0
            });
        }

        res.json(reward);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get rewards' });
    }
});

// Get leaderboard (top referrers)
app.get('/api/leaderboard', (req, res) => {
    try {
        const leaderboard = [];

        for (let [userId, reward] of userRewards) {
            const user = Array.from(users.values()).find(u => u.userId === userId);
            if (user) {
                leaderboard.push({
                    rank: 0,
                    userId,
                    name: user.name,
                    email: user.email,
                    points: reward.points || 0,
                    badges: (reward.badges || []).length,
                    referrals: reward.referralCount || 0,
                    groupsCreated: reward.groupsCreated || 0
                });
            }
        }

        // Sort by points (top referrers first)
        leaderboard.sort((a, b) => b.points - a.points);
        
        // Assign ranks
        leaderboard.forEach((entry, index) => {
            entry.rank = index + 1;
        });

        res.json({
            leaderboard: leaderboard.slice(0, 100), // Top 100
            totalUsers: leaderboard.length
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get leaderboard' });
    }
});

// ============ PAYMENT → TICKET → QR CODE FLOW ENDPOINTS ============

// Generate ticket after payment
app.post('/api/tickets/generate', authMiddleware, (req, res) => {
    try {
        const { tripId, paymentId, amount } = req.body;
        const user = users.get(req.user.email);

        if (!tripId || !paymentId || !amount) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const trip = tripsDb.find(t => t.id === parseInt(tripId));
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        const ticketId = `tkt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const ticketData = {
            ticketId,
            tripId,
            trip: {
                id: trip.id,
                name: trip.name,
                date: trip.date,
                location: trip.location,
                cost: trip.cost
            },
            buyerEmail: user.email,
            buyerName: user.name,
            paymentId,
            amount,
            status: 'active',
            generatedAt: new Date(),
            validUntil: new Date(new Date().setDate(new Date().getDate() + 30)) // Valid for 30 days
        };

        tickets.set(ticketId, ticketData);

        // Generate QR code (simulated)
        const qrCode = generateQRCodeData(ticketId, trip.name, user.name);
        qrCodes.set(ticketId, qrCode);

        console.log(`✓ Ticket generated: ${ticketId}`);

        res.json({
            message: 'Ticket generated successfully',
            ticket: {
                ticketId,
                tripName: trip.name,
                tripDate: trip.date,
                buyerName: user.name,
                status: 'active',
                qrCode: qrCode.data // Base64 encoded QR code
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate ticket' });
    }
});

// Generate QR Code
app.post('/api/qrcode/generate', authMiddleware, (req, res) => {
    try {
        const { ticketId } = req.body;

        if (!ticketId) {
            return res.status(400).json({ error: 'Ticket ID required' });
        }

        const ticket = tickets.get(ticketId);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        const qrCode = generateQRCodeData(ticketId, ticket.trip.name, ticket.buyerName);
        qrCodes.set(ticketId, qrCode);

        console.log(`✓ QR Code generated for ticket: ${ticketId}`);

        res.json({
            message: 'QR Code generated',
            ticketId,
            qrCode: qrCode.data,
            tripName: ticket.trip.name,
            validity: ticket.validUntil
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

// Get ticket details
app.get('/api/tickets/:ticketId', authMiddleware, (req, res) => {
    try {
        const { ticketId } = req.params;
        const ticket = tickets.get(ticketId);

        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        const qrCode = qrCodes.get(ticketId);

        res.json({
            ticket,
            qrCode: qrCode?.data
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get ticket' });
    }
});

// Verify ticket (for scanning at event)
app.post('/api/tickets/verify', (req, res) => {
    try {
        const { ticketId } = req.body;

        if (!ticketId) {
            return res.status(400).json({ error: 'Ticket ID required' });
        }

        const ticket = tickets.get(ticketId);
        if (!ticket) {
            return res.status(404).json({ error: 'Ticket not found' });
        }

        if (ticket.status === 'scanned') {
            return res.status(400).json({ error: 'Ticket already scanned' });
        }

        if (ticket.validUntil < new Date()) {
            return res.status(400).json({ error: 'Ticket expired' });
        }

        // Mark as scanned
        ticket.status = 'scanned';
        ticket.scannedAt = new Date();

        console.log(`✓ Ticket verified and scanned: ${ticketId}`);

        res.json({
            message: 'Ticket verified',
            ticket: {
                ticketId,
                buyerName: ticket.buyerName,
                tripName: ticket.trip.name,
                tripDate: ticket.trip.date,
                status: 'scanned'
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to verify ticket' });
    }
});

// Simulate QR code generation (in production, use a QR library like 'qrcode' npm package)
function generateQRCodeData(ticketId, tripName, buyerName) {
    const qrText = `TICKET:${ticketId}|TRIP:${tripName}|BUYER:${buyerName}|TIME:${Date.now()}`;
    
    // Simple base64 encoding of QR data (in production, use actual QR library)
    const base64QR = Buffer.from(qrText).toString('base64');
    
    return {
        ticketId,
        data: `data:image/svg+xml;base64,${base64QR}`,
        text: qrText,
        generatedAt: new Date()
    };
}

// ============ START SERVER ============

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✓ Field Trip Club Backend running on http://localhost:${PORT}`);
    console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✓ Email service: ${process.env.EMAIL_SERVICE || 'gmail'}`);
    
    // Initialize demo data
    initializeDemoRewards();
    console.log(`✓ Rewards system initialized with ${userRewards.size} users`);
    console.log(`\n🎉 NEW FEATURES AVAILABLE:`);
    console.log(`   ✓ Group Booking System`);
    console.log(`   ✓ Referral System`);
    console.log(`   ✓ Gamification (Badges & Points)`);
    console.log(`   ✓ Payment → Ticket → QR Code Flow`);
});
