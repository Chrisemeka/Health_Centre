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
} = require('../controllers/patientController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/patients/profile:
 *   get:
 *     summary: Get patient profile
 *     tags: [Patients]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Patient profile retrieved successfully
 */
router.get('/profile', authenticateUser, viewProfile);

/**
 * @swagger
 * /api/patients/profile:
 *   put:
 *     summary: Update patient profile
 *     tags: [Patients]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */
router.put('/profile', authenticateUser, updateProfile);

/**
 * @swagger
 * /api/patients/medical-records:
 *   get:
 *     summary: View medical records
 *     tags: [Patients]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of patient medical records
 */
router.get('/medical-records', authenticateUser, getMedicalRecords);

/**
 * @swagger
 * /api/patients/medical-records/upload:
 *   post:
 *     summary: Upload medical records
 *     tags: [Patients]
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
 * /api/patients/medical-records/recent:
 *   get:
 *     summary: Get recent medical records
 *     tags: [Patients]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of recent medical records
 */
router.get('/medical-records/recent', authenticateUser, getRecentMedicalRecords);

/**
 * @swagger
 * /api/patients/appointments:
 *   post:
 *     summary: Request an appointment
 *     tags: [Patients]
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
 * /api/patients/appointments/upcoming:
 *   get:
 *     summary: Get upcoming appointments
 *     tags: [Patients]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of upcoming appointments
 */
router.get('/appointments/upcoming', authenticateUser, getUpcomingAppointments);

module.exports = router;
