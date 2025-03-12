const User = require('../model/patient');
// const SystemSettings = require('../model/SystemSettings');
const SystemLogs = require('../model/accessLog');
const bcrypt = require('bcrypt');

// Create a new user account (Admin creates Doctors, Patients, or Admins)
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword, role });

        await user.save();
        res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Manage system settings (Only one settings document should exist)
const updateSystemSettings = async (req, res) => {
    try {
        const settings = await SystemSettings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.status(200).json({ message: "System settings updated", settings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// View system logs
const viewSystemLogs = async (req, res) => {
    try {
        const logs = await SystemLogs.find().sort({ createdAt: -1 }).limit(100); // Limit logs for performance
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Reset user password
const resetUserPassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get number of users
const getNumberOfUsers = async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        res.status(200).json({ userCount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createUser,
    updateSystemSettings,
    viewSystemLogs,
    resetUserPassword,
    getNumberOfUsers
};
