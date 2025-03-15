const jwt = require("jsonwebtoken");
const User = require("../model/user");
require("dotenv").config();

/**
 * @desc Middleware to protect routes by requiring authentication
 */
exports.protect = async (req, res, next) => {
  try {
    // Extract token from headers
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized, no token provided" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user in the database
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next(); // Continue to the requested route
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized, invalid token" });
  }
};
