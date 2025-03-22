const bcrypt = require('bcrypt');
const user = require('../model/user');
const { sendEmail } = require('../services/emailService');
const crypto = require("crypto");

// If you have a logs model, import it
// const Logs = require('../model/logs'); // Placeholder

// Creates a new admin user (must be superadmin to do this)
exports.createAdmin = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      DOB,
      gender,
      address,
      password,
    } = req.body;

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

    const newUser = new user({
      firstName,
      lastName,
      email,
      phone,
      dateOfBirth: DOB,     // ensure this matches your schema field name
      gender,
      address,
      password,
      userType: "admin",
      verificationToken,
      verified: false
    });
    await newUser.save();

    // Send verification email (if you need the admin to verify)
    const verificationUrl = `${req.protocol}://${req.get("host")}/api/patient/verify-email/${verificationToken}`;
    await sendEmail(
      newUser.email,
      "Verify Your Email",
      `Click to verify: ${verificationUrl}`
    );

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

// <<< ADDED >>>
// GET total admins, total patients, total doctors, and logs
exports.getStats = async (req, res) => {
  try {
    const totalAdmins = await user.countDocuments({ userType: 'admin' });
    const totalPatients = await user.countDocuments({ userType: 'patient' });
    const totalDoctors = await user.countDocuments({ userType: 'doctor' });

    // If your logs are stored in a separate collection:
    // const allLogs = await Logs.find();
    // For now, let's just define an empty array or placeholder
    const allLogs = []; // or from your own logging system

    // Return the data
    return res.status(200).json({
      totalAdmins,
      totalPatients,
      totalDoctors,
      logs: allLogs
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error' });
  }
};
