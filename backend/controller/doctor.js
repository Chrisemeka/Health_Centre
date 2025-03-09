const Doctor = require('../models/doctor');
const Patient = require('../models/patient');
const Appointment = require('../models/appointment');
const OTPService = require('../services/otpService');

const viewPatientRecords = async (req, res) => {
    const { doctorId, patientId } = req.params;

    try {
        const doctor = await Doctor.findById(doctorId);
        const patient = await Patient.findById(patientId);

        if (!doctor || !patient) {
            return res.status(404).json({ message: 'Doctor or Patient not found' });
        }

        if (!doctor.hasAccessToPatient(patientId)) {
            await OTPService.sendOTP(patient.email);
            return res.status(403).json({ message: 'Access denied. OTP sent to patient email.' });
        }

        const records = await patient.getMedicalRecords();
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPendingRequests = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const doctor = await Doctor.findById(doctorId);
        const pendingRequests = await doctor.getPendingRequests();
        res.json(pendingRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getTotalPatients = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const doctor = await Doctor.findById(doctorId);
        const totalPatients = await doctor.getTotalPatients();
        res.json(totalPatients);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getRecentPatientRecords = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const doctor = await Doctor.findById(doctorId);
        const recentRecords = await doctor.getRecentPatientRecords();
        res.json(recentRecords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAllAppointments = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const doctor = await Doctor.findById(doctorId);
        const appointments = await doctor.getAllAppointments();
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPendingAppointments = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const doctor = await Doctor.findById(doctorId);
        const pendingAppointments = await doctor.getPendingAppointments();
        res.json(pendingAppointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPatientRecordsByIds = async (req, res) => {
    const { doctorId, patientIds } = req.body;

    try {
        const doctor = await Doctor.findById(doctorId);
        const records = await doctor.getPatientRecordsByIds(patientIds);
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    viewPatientRecords,
    getPendingRequests,
    getTotalPatients,
    getRecentPatientRecords,
    getAllAppointments,
    getPendingAppointments,
    getPatientRecordsByIds
};