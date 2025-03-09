const express = require('express');
const Patient = require('../models/patient');
const Appointment = require('../models/appointment');
const MedicalRecord = require('../models/medicalRecord');

const router = express.Router();

// Search for medical records
router.get('/medical-records', async (req, res) => {
    try {
        const records = await MedicalRecord.find({ patientId: req.user.id });
        res.json(records);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Search for appointments
router.get('/appointments', async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user.id });
        res.json(appointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Request an appointment
router.post('/appointments', async (req, res) => {
    const { doctorName, hospitalName, date, time, purpose, additionalNotes } = req.body;
    const appointment = new Appointment({
        patientId: req.user.id,
        doctorName,
        hospitalName,
        date,
        time,
        purpose,
        additionalNotes
    });

    try {
        const newAppointment = await appointment.save();
        res.status(201).json(newAppointment);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// View profile
router.get('/profile', async (req, res) => {
    try {
        const patient = await Patient.findById(req.user.id);
        res.json(patient);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Edit profile
router.put('/profile', async (req, res) => {
    const { firstName, lastName, email, phoneNumber, dateOfBirth, bloodGroup, address, allergies, nextOfKin, notifications } = req.body;
    try {
        const patient = await Patient.findById(req.user.id);
        if (firstName) patient.firstName = firstName;
        if (lastName) patient.lastName = lastName;
        if (email) patient.email = email;
        if (phoneNumber) patient.phoneNumber = phoneNumber;
        if (dateOfBirth) patient.dateOfBirth = dateOfBirth;
        if (bloodGroup) patient.bloodGroup = bloodGroup;
        if (address) patient.address = address;
        if (allergies) patient.allergies = allergies;
        if (nextOfKin) patient.nextOfKin = nextOfKin;
        if (notifications) patient.notifications = notifications;

        const updatedPatient = await patient.save();
        res.json(updatedPatient);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Show upcoming appointments
router.get('/appointments/upcoming', async (req, res) => {
    try {
        const upcomingAppointments = await Appointment.find({ patientId: req.user.id, date: { $gte: new Date() } });
        res.json(upcomingAppointments);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Show recent medical records
router.get('/medical-records/recent', async (req, res) => {
    try {
        const recentRecords = await MedicalRecord.find({ patientId: req.user.id }).sort({ date: -1 }).limit(5);
        res.json(recentRecords);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;