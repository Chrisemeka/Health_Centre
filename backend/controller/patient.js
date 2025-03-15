const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const {sendEmail} = require("../services/emailService");
const Appointment = require("../model/appointment");
const Hospital = require("../model/hospital");

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.userType }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Patient Registration
exports.registerPatient = async (req, res) => {
  console.log(req.body)
  try {
    const userExists = await User.findOne({ email: req.body.email });
    console.log(req.body.email)
    console.log(userExists)
    if (userExists) return res.status(400).json({ message: "User already exists" });
    const verificationToken = crypto.randomBytes(20).toString("hex");

    const newUser = new User({ ...req.body, verificationToken, verified: false });
    await newUser.save();

    const verificationUrl = `${req.protocol}://${req.get("host")}/api/patient/verify-email/${verificationToken}`;
    await sendEmail(newUser.email, "Verify Your Email", `Click to verify: ${verificationUrl}`);

    res.status(201).json({ message: "Patient registered successfully. Please verify your email." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    console.log(error)
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
    res.status(500).json({ message: "Server error", error });
  }
};

// Patient Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.userType !== "patient") return res.status(400).json({ message: "Invalid credentials" });

    if (!user.verified) return res.status(403).json({ message: "Please verify your email first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    await sendEmail(user.email, "Login Notification", "You have logged into your account.");

    res.status(200).json({ token: generateToken(user), user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Book Appointment
exports.bookAppointment = async (req, res) => {
  try {
    const appointment = new Appointment({ patientId: req.user.id, ...req.body });
    await appointment.save();
    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// View Appointments
exports.viewAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id });
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get List of Active Hospitals
exports.getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({ status: "Active" });
    res.status(200).json(hospitals);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
