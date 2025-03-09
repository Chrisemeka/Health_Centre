const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const Appointment = require('../models/appointment');
const MedicalRecord = require('../models/medicalRecord');
const AccessLog = require('../models/accessLog');
const { sendOTP } = require('../services/otpService');
const { sendNotification } = require('../services/emailService');

// View Patient Records with OTP Protection
const viewPatientRecords = async (req, res) => {
    try {
        const { doctorId, patientId } = req.params;
        const doctor = await Doctor.findById(doctorId);
        const patient = await Patient.findById(patientId).populate('medicalRecords');

        if (!doctor || !patient) {
            return res.status(404).json({ message: 'Doctor or Patient not found' });
        }

        if (!doctor.hasAccessToPatient(patientId)) {
            await sendOTP(patient.email);
            return res.status(403).json({ message: 'Access denied. OTP sent to patient email.' });
        }

        // Log doctor access
        await AccessLog.create({ doctorId, patientId, action: 'Viewed Patient Record' });

        res.json(patient.medicalRecords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update Patient Records (Doctors must enter a note)
const updatePatientRecord = async (req, res) => {
    try {
        const { recordId } = req.params;
        const { notes, updates } = req.body;

        if (!notes) {
            return res.status(400).json({ message: 'A modification note is required.' });
        }

        const record = await MedicalRecord.findById(recordId);
        if (!record) return res.status(404).json({ message: "Record not found" });

        // Preserve old versions before modifying
        record.previousVersions.push({ ...record.toObject(), modifiedAt: new Date() });
        Object.assign(record, updates);
        record.notes = notes;

        await record.save();
        sendNotification(record.patientId.email, "Medical Record Updated", "Your medical record has been updated.");

        res.json(record);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Pending Appointment Requests
const getPendingAppointments = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const pendingAppointments = await Appointment.find({ doctorId, status: 'Pending' });
        res.json(pendingAppointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get All Appointments
const getAllAppointments = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const appointments = await Appointment.find({ doctorId });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Approve or Cancel an Appointment
const manageAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.params;
        const { status } = req.body;

        if (!['Approved', 'Cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status update.' });
        }

        const appointment = await Appointment.findByIdAndUpdate(appointmentId, { status }, { new: true });

        res.json({ message: `Appointment ${status.toLowerCase()} successfully`, appointment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Total Patients Count for Doctor
const getTotalPatients = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const totalPatients = await Patient.countDocuments({ doctorId });
        res.json({ totalPatients });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get Recent Patient Records
const getRecentPatientRecords = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const recentRecords = await MedicalRecord.find({ doctorId }).sort({ createdAt: -1 }).limit(5);
        res.json(recentRecords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    viewPatientRecords,
    updatePatientRecord,
    getPendingAppointments,
    getAllAppointments,
    manageAppointment,
    getTotalPatients,
    getRecentPatientRecords
};
