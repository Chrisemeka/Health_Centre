const Appointment = require("../model/appointment");
const Patient = require("../model/user"); // Patients are stored in the User model
const MedicalRecord = require("../model/medicalRecords");
const {sendEmail} = require("../services/emailService");
const OTPService = require("../services/otpServices");
const doctor = require("../model/doctor");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find hospital by email
    const doc = await doctor.findOne({ email });
    if (!doc) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, doc.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: doc._id, role: "doctor" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful", token, doc });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Internal server error", details: error.message });
  }
};
// Get Doctor Profile
exports.getDoctorProfile = async (req, res) => {
  try {
    const doc = await doctor.findById(req.user.id);
    if (!doc) return res.status(404).json({ message: "Doctor not found" });

    res.status(200).json(doc);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get All Appointments for a Doctor
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { date, status } = req.query;
    const query = { doctorId: req.user.id };

    if (date) query.date = date;
    if (status) query.status = status;

    const appointments = await Appointment.find(query);
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Specific Appointment Details
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Appointment Status
exports.updateAppointmentStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    appointment.status = status;
    if (notes) appointment.notes = notes;
    await appointment.save();

    res
      .status(200)
      .json({ message: "Appointment updated successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Add Medical Notes to Appointment
exports.addMedicalNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    appointment.medicalNotes = notes;
    await appointment.save();

    res.status(200).json({ message: "Medical notes added", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Search for Patients
exports.searchPatients = async (req, res) => {
  try {
    const { query } = req.query;
    const patients = await Patient.find({
      userType: "patient",
      $or: [
        { firstName: { $regex: query, $options: "i" } },
        { lastName: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ],
    });

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Request OTP to Access Patient Records
exports.requestPatientOTP = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const otp = OTPService.generateOTP();
    await OTPService.storeOTP(patient.email, otp);
    await sendEmail(patient.email, "OTP for Record Access", `Your OTP: ${otp}`);

    res.status(200).json({ message: "OTP sent to patient email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Patient Medical Records (With OTP Authentication)
exports.getPatientRecords = async (req, res) => {
  try {
    const { otp } = req.body;
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Verify OTP
    const isOTPValid = await OTPService.verifyOTP(patient.email, otp);
    if (!isOTPValid) return res.status(401).json({ message: "Invalid OTP" });

    const records = await MedicalRecord.find({
      patientId: req.params.patientId,
    });
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Add Medical Record (With OTP Authentication)
exports.addMedicalRecord = async (req, res) => {
  try {
    const { otp, type, summary, details } = req.body;
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Verify OTP
    const isOTPValid = await OTPService.verifyOTP(patient.email, otp);
    if (!isOTPValid) return res.status(401).json({ message: "Invalid OTP" });

    const newRecord = new MedicalRecord({
      patientId: req.params.patientId,
      type,
      summary,
      details,
    });
    await newRecord.save();

    res
      .status(201)
      .json({ message: "Medical record added", record: newRecord });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Specific Medical Record (With OTP Authentication)
exports.getMedicalRecordById = async (req, res) => {
  try {
    const { otp } = req.body;
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Verify OTP
    const isOTPValid = await OTPService.verifyOTP(patient.email, otp);
    if (!isOTPValid) return res.status(401).json({ message: "Invalid OTP" });

    const record = await MedicalRecord.findById(req.params.recordId);
    if (!record)
      return res.status(404).json({ message: "Medical record not found" });

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
