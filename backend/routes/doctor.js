const express = require('express');
const {
    viewPatientRecords,
    updatePatientRecord,
    getPendingAppointments,
    getAllAppointments,
    manageAppointment,
    getTotalPatients,
    getRecentPatientRecords
} = require('../controller/doctor');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/doctors/{doctorId}/patients/{patientId}/records:
 *   get:
 *     summary: View patient records (OTP Protected)
 *     tags: [Doctors]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *       - in: path
 *         name: patientId
 *         required: true
 *     responses:
 *       200:
 *         description: Patient records retrieved successfully
 */
router.get('/:doctorId/patients/:patientId/records', authenticateUser, viewPatientRecords);

/**
 * @swagger
 * /api/doctors/records/{recordId}:
 *   put:
 *     summary: Update patient records (Note required)
 *     tags: [Doctors]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *               updates:
 *                 type: object
 *     responses:
 *       200:
 *         description: Record updated successfully
 */
router.put('/records/:recordId', authenticateUser, updatePatientRecord);

/**
 * @swagger
 * /api/doctors/{doctorId}/appointments/pending:
 *   get:
 *     summary: Get pending appointment requests
 *     tags: [Doctors]
 *     security:
 *       - BearerAuth: []
 */
router.get('/:doctorId/appointments/pending', authenticateUser, getPendingAppointments);

/**
 * @swagger
 * /api/doctors/{doctorId}/appointments:
 *   get:
 *     summary: Get all appointments
 *     tags: [Doctors]
 *     security:
 *       - BearerAuth: []
 */
router.get('/:doctorId/appointments', authenticateUser, getAllAppointments);

/**
 * @swagger
 * /api/doctors/appointments/{appointmentId}:
 *   put:
 *     summary: Approve or cancel an appointment
 *     tags: [Doctors]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Approved, Cancelled]
 *     responses:
 *       200:
 *         description: Appointment updated successfully
 */
router.put('/appointments/:appointmentId', authenticateUser, manageAppointment);

/**
 * @swagger
 * /api/doctors/{doctorId}/patients/count:
 *   get:
 *     summary: Get total number of patients assigned to a doctor
 *     tags: [Doctors]
 *     security:
 *       - BearerAuth: []
 */
router.get('/:doctorId/patients/count', authenticateUser, getTotalPatients);

/**
 * @swagger
 * /api/doctors/{doctorId}/records/recent:
 *   get:
 *     summary: Get recent patient records
 *     tags: [Doctors]
 *     security:
 *       - BearerAuth: []
 */
router.get('/:doctorId/records/recent', authenticateUser, getRecentPatientRecords);

module.exports = router;
