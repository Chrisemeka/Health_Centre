const Appointment = require("../model/appointment");
const Patient = require("../model/user"); // Patients are stored in the User model
const MedicalRecord = require("../model/medicalRecords");
const { sendEmail } = require("../services/emailService");
const OTPService = require("../services/otpServices");
const Doctor = require("../model/doctor"); // Renamed from lowercase 'doctor' to uppercase if that is your convention
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Doctor Login
exports.doctorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const doc = await Doctor.findOne({ email });
    if (!doc) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, doc.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: doc._id, role: "doctor" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ message: "Login successful", token, doc });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
};

// Get Doctor Profile
exports.getDoctorProfile = async (req, res) => {
  try {
    const doc = await Doctor.findById(req.user.id);
    if (!doc) return res.status(404).json({ message: "Doctor not found" });
    res.status(200).json(doc);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/* 
  NEW REQUIREMENT #1:
  For doctor appointments return (time, date, patient name, patient id, purpose, status).
  We'll populate the patient data in getDoctorAppointments 
  and then transform the response.
*/
exports.getDoctorAppointments = async (req, res) => {
  try {
    const { date, status } = req.query;
    const query = { doctorId: req.user.id };

    if (date) query.date = date;
    if (status) query.status = status;

    // Populate the patient info you need (firstName, lastName, etc.)
    const appointments = await Appointment.find(query).populate(
      "patientId",
      "firstName lastName"
    );

    // Return the relevant fields
    const formatted = appointments.map((appt) => ({
      _id: appt._id,
      time: appt.time,
      date: appt.date,
      patientName: appt.patientId
        ? `${appt.patientId.firstName} ${appt.patientId.lastName}`
        : "Unknown",
      patientId: appt.patientId ? appt.patientId._id : null,
      purpose: appt.purpose,
      status: appt.status,
      notes: appt.notes,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Specific Appointment Details
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.appointmentId).populate(
      "patientId",
      "firstName lastName email" // or whichever fields you need
    );

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
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

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

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

// <<< ADDED >>>
// Allow doctor to reschedule an appointment (new date, time, note)
exports.rescheduleAppointment = async (req, res) => {
  try {
    const { date, time, note } = req.body;
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    // Make sure the appointment belongs to the logged-in doctor
    if (appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    appointment.date = date || appointment.date;
    appointment.time = time || appointment.time;
    if (note) appointment.notes = note;
    await appointment.save();

    res.status(200).json({ message: "Appointment rescheduled successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Add Medical Notes to Appointment
exports.addMedicalNotes = async (req, res) => {
  try {
    const { notes } = req.body;
    const appointment = await Appointment.findById(req.params.appointmentId);

    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

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

/*
  NEW REQUIREMENT #5:
  Add new record form with:
    - record type
    - summary
    - details
    - document (fileUrl)
    - images
  We can rename or add fields in our schema as needed.
*/
exports.addMedicalRecord = async (req, res) => {
  try {
    const { otp, recordType, summary, details, documentUrl, imageUrls } = req.body;
    const patient = await Patient.findById(req.params.patientId);
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    // Verify OTP
    const isOTPValid = await OTPService.verifyOTP(patient.email, otp);
    if (!isOTPValid) return res.status(401).json({ message: "Invalid OTP" });

    const newRecord = new MedicalRecord({
      patientId: req.params.patientId,
      doctorId: req.user.id || undefined,
      recordType,   // e.g. "Lab Result", "Prescription", etc.
      summary,      // short summary
      details,      // extended info
      documentUrl,  // e.g. link to PDF or doc
      imageUrls,    // array of image links
    });
    await newRecord.save();

    res.status(201).json({ message: "Medical record added", record: newRecord });
  } catch (error) {
    console.error("Error adding medical record:", error);
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
    if (!record) return res.status(404).json({ message: "Medical record not found" });

    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

/* 
  NEW REQUIREMENT #3:
  For medical records: get the particular patient profile that was filled 
  when they registered.
  "Allow doctor to get all existing records for patient" is already covered 
  by getPatientRecords (requires OTP).
  But if we just want the registration info (no OTP needed or up to you), 
  we can add a route and controller below.
*/

// <<< ADDED >>>
exports.getPatientFullProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.patientId);
    if (!patient || patient.userType !== "patient") {
      return res.status(404).json({ message: "Patient not found" });
    }
    // Return all data from registration or only certain fields
    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
