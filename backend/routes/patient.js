const express = require("express");
const {
  registerPatient,
  verifyEmail,
  login,
  bookAppointment,
  viewAppointments,
  getHospitals,
  getAllDoctors,
} = require("../controller/patient");
const { protect } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Patients
 *   description: API routes for patient management
 */

/**
 * @swagger
 * /api/patient/register:
 *   post:
 *     summary: Register a new patient
 *     tags: [Patients]
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
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               bloodType:
 *                 type: string
 *               allergies:
 *                 type: string
 *               nextOfKin:
 *                 type: string
 *               nextOfKinRelation:
 *                 type: string
 *               nextOfKinPhone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient registered successfully. Please verify your email.
 */
router.post("/register", registerPatient);

/**
 * @swagger
 * /api/patient/verify-email/{token}:
 *   get:
 *     summary: Verify patient's email address
 *     tags: [Patients]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Email verified successfully.
 *       400:
 *         description: Invalid or expired token.
 */
router.get("/verify-email/:token", verifyEmail);

/**
 * @swagger
 * /api/patient/login:
 *   post:
 *     summary: Patient login
 *     tags: [Patients]
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
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful. Returns JWT token.
 *       400:
 *         description: Invalid credentials.
 *       403:
 *         description: Please verify your email first.
 */
router.post("/login", login);

/**
 * @swagger
 * /api/patient/appointments:
 *   post:
 *     summary: Book an appointment
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
 *               doctorId:
 *                 type: string
 *               hospitalId:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               time:
 *                 type: string
 *               purpose:
 *                 type: string
 *               notes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment booked successfully.
 */
router.post("/appointments", protect, bookAppointment);

/**
 * @swagger
 * /api/patient/appointments:
 *   get:
 *     summary: View all appointments of a patient
 *     tags: [Patients]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of patient appointments.
 */
router.get("/appointments", protect, viewAppointments);

/**
 * @swagger
 * /api/patient/hospitals:
 *   get:
 *     summary: Get a list of active hospitals
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: Returns a list of active hospitals.
 */
router.get("/hospitals", getHospitals);


/**
 * @swagger
 * /api/patient/doctor:
 *   get:
 *     summary: Get a list of active doctors
 *     tags: [Patients]
 *     responses:
 *       200:
 *         description: Returns a list of active doctors.
 */
router.get("/doctor", getAllDoctors);

module.exports = router;
