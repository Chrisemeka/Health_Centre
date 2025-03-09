const User = require('../models/User');
const SystemSettings = require('../models/SystemSettings');
const SystemLogs = require('../models/SystemLogs');

// Create a new user account
exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Manage system settings
exports.updateSystemSettings = async (req, res) => {
    try {
        const settings = await SystemSettings.findOneAndUpdate({}, req.body, { new: true, upsert: true });
        res.status(200).send(settings);
    } catch (error) {
        res.status(400).send(error);
    }
};

// View system logs
exports.viewSystemLogs = async (req, res) => {
    try {
        const logs = await SystemLogs.find({});
        res.status(200).send(logs);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Reset user password
exports.resetUserPassword = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send({ error: 'User not found' });
        }
        user.password = req.body.password;
        await user.save();
        res.status(200).send({ message: 'Password reset successfully' });
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get number of users
exports.getNumberOfUsers = async (req, res) => {
    try {
        const userCount = await User.countDocuments({});
        res.status(200).send({ userCount });
    } catch (error) {
        res.status(400).send(error);
    }
};