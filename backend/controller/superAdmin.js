// controllers/superAdminController.js
const bcrypt = require('bcrypt');
const user = require('../model/user');

// Creates a new admin user (must be superadmin to do this)
exports.createAdmin = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Basic validations
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        error: 'firstName, lastName, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use' });
    }

    // Since the User model has a "pre('save')" hook that hashes the password,
    // you can simply assign it here. No need to re-hash manually (unless you prefer).
    const newUser = new user({
      firstName,
      lastName,
      email,
      password,
      userType: 'admin'  // Mark this user as admin
    });

    await newUser.save();

    return res.status(201).json({
      message: 'New admin created successfully',
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        userType: newUser.userType
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};

