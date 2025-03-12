const Patient = require("../model/patient");
const Appointment = require("../model/appointment");
const MedicalRecord = require("../model/medicalRecords");
const AccessLog = require("../model/accessLog");
const { sendNotification } = require("../utility/mailer");
const multer = require("multer");

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/medical-records/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// View Patient Profile
const viewProfile = async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id);
    res.json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Edit Patient Profile
const updateProfile = async (req, res) => {
  try {
    const updatedPatient = await Patient.findByIdAndUpdate(
      req.user.id,
      req.body,
      { new: true }
    );
    res.json(updatedPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View Medical Records
const getMedicalRecords = async (req, res) => {
  try {
    const records = await MedicalRecord.find({ patientId: req.user.id });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload Medical Records
const uploadMedicalRecord = async (req, res) => {
  try {
    const newRecord = new MedicalRecord({
      patientId: req.user.id,
      fileUrl: `/uploads/medical-records/${req.file.filename}`,
      category: req.body.category || "General",
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// View Recent Medical Records
const getRecentMedicalRecords = async (req, res) => {
  try {
    const recentRecords = await MedicalRecord.find({ patientId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(recentRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Request an Appointment
const requestAppointment = async (req, res) => {
  try {
    const { doctorName, hospitalName, date, time, purpose, additionalNotes } =
      req.body;
    const appointment = new Appointment({
      patientId: req.user.id,
      doctorName,
      hospitalName,
      date,
      time,
      purpose,
      additionalNotes,
    });

    await appointment.save();
    const patient = await Patient.findById(req.user.id);
    await sendNotification(
      patient.email,
      "Appointment Booked",
      `Your appointment with ${doctorName} at ${hospitalName} is scheduled for ${date} at ${time}.`
    );

    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// View Upcoming Appointments
const getUpcomingAppointments = async (req, res) => {
  try {
    const upcomingAppointments = await Appointment.find({
      patientId: req.user.id,
      date: { $gte: new Date() },
    });
    res.json(upcomingAppointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  viewProfile,
  updateProfile,
  getMedicalRecords,
  uploadMedicalRecord,
  getRecentMedicalRecords,
  requestAppointment,
  getUpcomingAppointments,
  upload,
};
