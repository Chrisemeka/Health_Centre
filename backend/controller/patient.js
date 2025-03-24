const User = require("../model/user");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const { sendEmail } = require("../services/emailService");
const Appointment = require("../model/appointment");
const Hospital = require("../model/hospital");
const Doctor = require("../model/doctor"); 
const MedicalRecord = require("../model/medicalRecords");
const doctor = require("../model/doctor");
const hospital = require("../model/hospital");
const medicalRecords = require("../model/medicalRecords");

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
    const records = await medicalRecords.find({ patientId: req.user.id });
    
    // Format the records if needed
    const formatted = records.map(record => ({
      id: record._id,
      type: record.type || 'Unknown',
      hospital: record.hospital || '',
      doctor: record.doctor || '',
      date: record.date || new Date().toISOString(),
      summary: record.summary || '',
      details: record.details || '',
      documentUrl: record.documentUrl || null
    }));
    
    // Send a single response
    return res.status(200).json(formatted);
    
  } catch (error) {
    console.error('Error fetching medical records:', error);
    return res.status(500).json({ 
      message: "Failed to fetch medical records",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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

//Get Patient Profile

exports.getPatientProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "Patient not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.getAllHospitals = async (req, res) => {
  try {
    const hospitals = await hospital.find({});
    if (!hospitals || hospitals.length === 0) {
      return res.status(404).json({ message: "No hospitals found" });
    }
    return res.status(200).json(hospitals);
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id; // Get appointment ID from request parameters
    const appointment = await Appointment.findOneAndDelete({
      _id: appointmentId,
      patientId: req.user.id, // Ensure the appointment belongs to the patient
    });

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    return res.status(200).json({ message: "Appointment deleted successfully" });
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
