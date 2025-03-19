// controllers/superAdminController.js
const bcrypt = require('bcrypt');
const user = require('../model/user');
const { sendEmail } = require('../services/emailService');
const crypto = require("crypto");

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

    
        const verificationToken = crypto.randomBytes(20).toString("hex");
    
        const newUser = new user({ ...req.body,  userType: "admin", verificationToken, verified: false });
        await newUser.save();
    const verificationUrl = `${req.protocol}://${req.get("host")}/api/patient/verify-email/${verificationToken}`;
    await sendEmail(newUser.email, "Verify Your Email", `Click to verify: ${verificationUrl}`);

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

