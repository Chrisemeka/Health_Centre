const express = require("express");
const {
  doctorLogin,
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
const roleMiddleware = require("../middleware/role");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Doctors
 *   description: API routes for doctor management
 */
/**
 * @swagger
 * /api/doctor/login:
 *   post:
 *     summary: Login Doctor account
 *     tags: [Doctors]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful.
 */
router.post("/login", doctorLogin);


/**
 * @swagger
 * /api/doctor/profile:
 *   get:
 *     summary: Get doctor profile
 *     tags: [Doctors]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Doctor profile retrieved successfully.
 */
router.get("/profile", roleMiddleware('doctor'), getDoctorProfile);

/**
 * @swagger
 * /api/doctor/appointments:
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
router.get("/appointments", roleMiddleware('doctor'), getDoctorAppointments);

/**
 * @swagger
 * /api/doctor/appointments/{appointmentId}:
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
router.get("/appointments/:appointmentId", roleMiddleware('doctor'), getAppointmentById);

/**
 * @swagger
 * /api/doctor/appointments/{appointmentId}/status:
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
router.patch("/appointments/:appointmentId/status", roleMiddleware('doctor'), updateAppointmentStatus);

/**
 * @swagger
 * /api/doctor/appointments/{appointmentId}/notes:
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
router.post("/appointments/:appointmentId/notes", roleMiddleware('doctor'), addMedicalNotes);

/**
 * @swagger
 * /api/doctor/patients/search:
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
router.get("/patients/search", roleMiddleware('doctor'), searchPatients);

/**
 * @swagger
 * /api/doctor/patients/{patientId}/request-otp:
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
router.post("/patients/:patientId/request-otp", roleMiddleware('doctor'), requestPatientOTP);

/**
 * @swagger
 * /api/doctor/patients/{patientId}/records:
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
router.post("/patients/:patientId/records", roleMiddleware('doctor'), getPatientRecords);

/**
 * @swagger
 * /api/doctor/patients/{patientId}/records/add:
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
 *               category:
 *                 type: string
 *                 enum: [Laboratory Results, Prescription, Diagnosis, Imaging, Vaccination, Surgery]
 *                 description: Category of the medical record.
 *               notes:
 *                 type: string
 *                 description: Additional notes or summary.
 *               fileUrl:
 *                 type: string
 *                 description: URL for any associated file.
 *     responses:
 *       201:
 *         description: Medical record added successfully.
 */
router.post("/patients/:patientId/records/add", roleMiddleware('doctor'), addMedicalRecord);

/**
 * @swagger
 * /api/doctor/patients/{patientId}/records/{recordId}:
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
router.post("/patients/:patientId/records/:recordId",roleMiddleware('doctor'), getMedicalRecordById);

module.exports = router;
