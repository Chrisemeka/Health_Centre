const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendEmail } = require("../services/emailService");
const Appointment = require("../model/appointment");
const Hospital = require("../model/hospital");
const Doctor = require("../model/doctor"); 
const MedicalRecord = require("../model/medicalRecords");

// Generate JWT Token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.userType }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Patient Registration
exports.registerPatient = async (req, res) => {
  try {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const verificationToken = crypto.randomBytes(20).toString("hex");

    const newUser = new User({ ...req.body, verificationToken, verified: false });
    await newUser.save();

    const verificationUrl = `${req.protocol}://${req.get("host")}/api/patient/verify-email/${verificationToken}`;
    await sendEmail(newUser.email, "Verify Your Email", `Click to verify: ${verificationUrl}`);

    res
      .status(201)
      .json({ message: "Patient registered successfully. Please verify your email." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
    console.log(error);
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
    if (!user || user.userType !== "patient")
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.verified)
      return res.status(403).json({ message: "Please verify your email first" });

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
    // >>> ADDED FIELDS doctorName, hospitalName <<<
    let { doctorId, hospitalId, doctorName, hospitalName, date, time, purpose, notes } = req.body;

    // If doctorId is not provided, try retrieving by doctorName
    if (!doctorId && doctorName) {
      const foundDoctor = await Doctor.findOne({ firstName: doctorName });
      if (foundDoctor) {
        doctorId = foundDoctor._id;
      }
    }

    // If hospitalId is not provided, try retrieving by hospitalName
    if (!hospitalId && hospitalName) {
      const foundHospital = await Hospital.findOne({ hospitalName: hospitalName });
      if (foundHospital) {
        hospitalId = foundHospital._id;
      }
    }

    const appointment = new Appointment({
      patientId: req.user.id,
      doctorId,
      hospitalId,
      date,
      time,
      purpose,
      notes,
    });

    await appointment.save();
    res
      .status(201)
      .json({ message: "Appointment booked successfully", appointment });
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

// Get List of Active Doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: "Active" });
    res.status(200).json(doctors);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/* --------------------------------------------------------------------------
   NEW METHODS TO FULFILL THE REQUIREMENTS
   1) Access medical records
   2) Get number of confirmed appointments
   3) Update patient info
   -------------------------------------------------------------------------- */

// 1) Get Medical Records
exports.getMedicalRecords = async (req, res) => {
  try {
    // Example using a hypothetical MedicalRecord model with references:
    // If your structure differs, adjust accordingly
    // .populate("hospitalId", "hospitalName")
    // .populate("doctorId", "firstName lastName")
    // ...
    // For now, let's assume you have a MedicalRecord model:

    // const records = await MedicalRecord.find({ patientId: req.user.id })
    //   .populate("hospitalId", "hospitalName")
    //   .populate("doctorId", "firstName lastName");

    // If you don’t have a separate model, you could fetch from some other source.

    // Mock/placeholder data if needed:
    const records = []; // Replace with real DB query

    // Return only the requested fields: record_type, hospital name, date, time, doctor name, summary
    // If your schema has them as recordType, hospitalId, date, time, doctorId, summary, etc., map them:
    const formatted = records.map((rec) => ({
      record_type: rec.recordType,
      hospitalName: rec.hospitalId?.hospitalName,
      date: rec.date,
      time: rec.time,
      doctorName: rec.doctorId
        ? `${rec.doctorId.firstName} ${rec.doctorId.lastName}`
        : undefined,
      summary: rec.summary,
    }));

    return res.status(200).json(formatted);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// 2) Get Number of Confirmed Appointments
exports.getConfirmedAppointmentsCount = async (req, res) => {
  try {
    // Assuming "status" field on Appointment can be "confirmed"
    const count = await Appointment.countDocuments({
      patientId: req.user.id,
      status: "confirmed",
    });

    return res.status(200).json({ confirmedAppointments: count });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// 3) Update Patient Info
exports.updatePatientProfile = async (req, res) => {
  try {
    // Merge only the fields you allow the patient to update
    const updates = { ...req.body };
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });

    if (!user) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};
