// scripts/createSuperAdmin.js
require('dotenv').config(); // If you use .env to load MONGO_URI, etc.
const mongoose = require('mongoose');
const User = require('../model/user'); // Adjust path to your User model
const bcrypt = require('bcryptjs'); // or 'bcrypt', matching your project

(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const existingSuperAdmin = await User.findOne({ userType: 'superAdmin' });
    if (existingSuperAdmin) {
      console.log('A super admin already exists:', existingSuperAdmin.email);
      return process.exit(0);
    }

    const superAdmin = new User({
      firstName: 'Super',
      lastName: 'Admin',
      email: 'superadmin@example.com',
      password: 1234567890,
      userType: 'superAdmin',
      verified: true // If you want the super admin automatically verified
    });

    await superAdmin.save();
    console.log('Super admin created successfully.');
  } catch (error) {
    console.error('Error creating super admin:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
})();
