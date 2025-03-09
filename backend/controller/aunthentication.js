const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const { sendNotification } = require('../services/emailService');

const router = express.Router();
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign({ id: user._id, role: user.role }, secretKey, { expiresIn: '1h' });
};

// Sign Up (User Registration)
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ username, email, password: hashedPassword, role, verified: false });

        // Generate Email Verification Token
        const verificationToken = crypto.randomBytes(20).toString('hex');
        user.verificationToken = verificationToken;

        await user.save();

        // Send Email Verification
        const verificationUrl = `${req.protocol}://${req.get('host')}/api/auth/verify-email/${verificationToken}`;
        await sendNotification(email, 'Verify Your Account', `Click here to verify: ${verificationUrl}`);

        res.status(201).json({ message: 'User created. Please verify your email.', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Verify Email
router.get('/verify-email/:token', async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.verified = true;
        user.verificationToken = undefined;
        await user.save();

        res.json({ message: 'Email verified successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.verified) {
            return res.status(403).json({ message: 'Please verify your email first' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);

        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        await user.save();

        const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
        await sendNotification(user.email, 'Password Reset', `Click here to reset: ${resetUrl}`);

        res.json({ message: 'Password reset link sent to email' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        user.password = await bcrypt.hash(req.body.password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();

        res.json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
