const express = require("express");
const {
  getDoctorProfile,
  getDoctorAppointments,
  getAppointmentById,
  updateAppointmentStatus,
  addMedicalNotes,
  searchPatients,
  requestPatientOTP,
  getPatientRecords,
  addMedicalRecord,
  getMedicalRecordById,
} = require("../controller/doctor");

const { protect } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: API routes for doctor management
 */

/**
 * @swagger
 * /api/doctors/profile:
 *   get:
 *     summary: Get doctor profile
 *     tags: [Doctors]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Doctor profile retrieved successfully.
 */
router.get("/profile", protect, getDoctorProfile);

/**
 * @swagger
 * /api/doctors/appointments:
 *   get:
 *     summary: Get all appointments for a doctor
 *     tags: [Doctors]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter appointments by date.
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Pending, Confirmed, Completed, Cancelled]
 *         description: Filter appointments by status.
 *     responses:
 *       200:
 *         description: List of doctor appointments.
 */
router.get("/appointments", protect, getDoctorAppointments);

/**
 * @swagger
 * /api/doctors/appointments/{appointmentId}:
 *   get:
 *     summary: Get specific appointment details
 *     tags: [Doctors]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the appointment.
 *     responses:
 *       200:
 *         description: Appointment details retrieved successfully.
 */
router.get("/appointments/:appointmentId", protect, getAppointmentById);

/**
 * @swagger
 * /api/doctors/appointments/{appointmentId}/status:
 *   patch:
 *     summary: Update appointment status
 *     tags: [Doctors]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the appointment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Confirmed, Checked In, Completed, Cancelled]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Appointment updated successfully.
 */
router.patch("/appointments/:appointmentId/status", protect, updateAppointmentStatus);

/**
 * @swagger
 * /api/doctors/appointments/{appointmentId}/notes:
 *   post:
 *     summary: Add medical notes to an appointment
 *     tags: [Doctors]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: appointmentId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the appointment.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Medical notes added successfully.
 */
router.post("/appointments/:appointmentId/notes", protect, addMedicalNotes);

/**
 * @swagger
 * /api/doctors/patients/search:
 *   get:
 *     summary: Search for patients
 *     tags: [Doctors]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: Search term (name, email).
 *     responses:
 *       200:
 *         description: List of matching patients.
 */
router.get("/patients/search", protect, searchPatients);

/**
 * @swagger
 * /api/doctors/patients/{patientId}/request-otp:
 *   post:
 *     summary: Request OTP for accessing patient records
 *     tags: [Doctors]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the patient.
 *     responses:
 *       200:
 *         description: OTP sent to patient email.
 */
router.post("/patients/:patientId/request-otp", protect, requestPatientOTP);

/**
 * @swagger
 * /api/doctors/patients/{patientId}/records:
 *   post:
 *     summary: Get patient medical records (Requires OTP)
 *     tags: [Doctors]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the patient.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 description: OTP received by the patient.
 *     responses:
 *       200:
 *         description: List of patient medical records.
 */
router.post("/patients/:patientId/records", protect, getPatientRecords);

/**
 * @swagger
 * /api/doctors/patients/{patientId}/records/add:
 *   post:
 *     summary: Add a medical record for a patient (Requires OTP)
 *     tags: [Doctors]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the patient.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 description: OTP received by the patient.
 *               type:
 *                 type: string
 *                 enum: [Laboratory Results, Prescription, Diagnosis, Imaging, Vaccination, Surgery]
 *               summary:
 *                 type: string
 *               details:
 *                 type: string
 *     responses:
 *       201:
 *         description: Medical record added successfully.
 */
router.post("/patients/:patientId/records/add", protect, addMedicalRecord);

/**
 * @swagger
 * /api/doctors/patients/{patientId}/records/{recordId}:
 *   post:
 *     summary: Get specific medical record (Requires OTP)
 *     tags: [Doctors]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: patientId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the patient.
 *       - in: path
 *         name: recordId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the medical record.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: string
 *                 description: OTP received by the patient.
 *     responses:
 *       200:
 *         description: Medical record details retrieved.
 */
router.post("/patients/:patientId/records/:recordId", protect, getMedicalRecordById);

module.exports = router;
