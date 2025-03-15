const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../model/user");
const {sendEmail} = require("../services/emailService");
const generateToken  = require("../utility/generateToken");



// Sign Up (User Registration)
exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ firstName, lastName, email, password: hashedPassword, role, verified: false });

    // Generate Email Verification Token
    const verificationToken = crypto.randomBytes(20).toString("hex");
    user.verificationToken = verificationToken;
    console.log(verificationToken)
    await user.save();

    // Send Verification Email
    const verificationUrl = `${req.protocol}://${req.get("host")}/api/auth/verify-email/${verificationToken}`;
    await sendEmail(email, "Verify Your Account", `Click here to verify: ${verificationUrl}`);

    res.status(201).json({ message: "User created. Please verify your email.", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.verified) return res.status(403).json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user);

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetUrl = `${req.protocol}://${req.get("host")}/api/auth/reset-password/${resetToken}`;
    // await sendNotification(user.email, "Password Reset", `Click here to reset: ${resetUrl}`);
    console.log(resetUrl)
    res.json({ message: "Password reset link sent to email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) return res.status(400).json({ message: "Invalid or expired token" });

    user.password = await bcrypt.hash(req.body.password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
