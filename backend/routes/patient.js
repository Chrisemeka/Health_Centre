const express = require('express');
const {
    viewProfile,
    updateProfile,
    getMedicalRecords,
    uploadMedicalRecord,
    getRecentMedicalRecords,
    requestAppointment,
    getUpcomingAppointments,
    upload
} = require('../controller/patient');
const { authenticateUser } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/patient/profile:
 *   get:
 *     summary: Get patient profile
 *     tags: [patient]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Patient profile retrieved successfully
 */
router.get('/profile', authenticateUser, viewProfile);

/**
 * @swagger
 * /api/patient/profile:
 *   put:
 *     summary: Update patient profile
 *     tags: [patient]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               nextOfKin:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/profile', authenticateUser, updateProfile);

/**
 * @swagger
 * /api/patient/medical-records:
 *   get:
 *     summary: View medical records
 *     tags: [patient]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of patient medical records
 */
router.get('/medical-records', authenticateUser, getMedicalRecords);

/**
 * @swagger
 * /api/patient/medical-records/upload:
 *   post:
 *     summary: Upload medical records
 *     tags: [patient]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               medicalFile:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Medical record uploaded successfully
 */
router.post('/medical-records/upload', authenticateUser, upload.single('medicalFile'), uploadMedicalRecord);

/**
 * @swagger
 * /api/patient/medical-records/recent:
 *   get:
 *     summary: Get recent medical records
 *     tags: [patient]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of recent medical records
 */
router.get('/medical-records/recent', authenticateUser, getRecentMedicalRecords);

/**
 * @swagger
 * /api/patient/appointments:
 *   post:
 *     summary: Request an appointment
 *     tags: [patient]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorName:
 *                 type: string
 *               hospitalName:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               purpose:
 *                 type: string
 *               additionalNotes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment requested successfully
 */
router.post('/appointments', authenticateUser, requestAppointment);

/**
 * @swagger
 * /api/patient/appointments/upcoming:
 *   get:
 *     summary: Get upcoming appointments
 *     tags: [patient]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of upcoming appointments
 */
router.get('/appointments/upcoming', authenticateUser, getUpcomingAppointments);

module.exports = router;
