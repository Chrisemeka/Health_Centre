const express = require("express");
const {
  createDoctor,
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  changeDoctorStatus,
  hospitalLogin,
} = require("../controller/hospital");

const roleMiddleware = require("../middleware/role");
const { protect } = require("../middleware/auth");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Hospitals
 *   description: API routes for hospital management
 */

/**
 * @swagger
 * /api/hospitals/doctors:
 *   post:
 *     summary: Create a new doctor in the hospital
 *     tags: [Hospitals]
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
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: docPassword
 *               specialty:
 *                 type: string
 *               phone:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *               department:
 *                 type: string
 *     responses:
 *       201:
 *         description: Doctor created successfully.
 */
router.post("/doctors", protect, createDoctor);

/**
 * @swagger
 * /api/hospitals/login:
 *   post:
 *     summary: Login hospital account
 *     tags: [Hospitals]
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
router.post("/login", hospitalLogin);




/**
 * @swagger
 * /api/hospitals/doctors:
 *   get:
 *     summary: Get all doctors in the hospital
 *     tags: [Hospitals]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of doctors in the hospital.
 */
router.get("/doctors", getAllDoctors);

/**
 * @swagger
 * /api/hospitals/doctors/{doctorId}:
 *   get:
 *     summary: Get specific doctor details
 *     tags: [Hospitals]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the doctor.
 *     responses:
 *       200:
 *         description: Doctor details retrieved successfully.
 */
router.get("/doctors/:id", protect, getDoctorById);

/**
 * @swagger
 * /api/hospitals/doctors/{doctorId}:
 *   put:
 *     summary: Update doctor details
 *     tags: [Hospitals]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the doctor.
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
 *               specialty:
 *                 type: string
 *               phone:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [Male, Female, Other]
 *               department:
 *                 type: string
 *     responses:
 *       200:
 *         description: Doctor updated successfully.
 */
router.put("/doctors/:id", protect, updateDoctor);

/**
 * @swagger
 * /api/hospitals/doctors/{doctorId}/status:
 *   patch:
 *     summary: Change doctor status (Active/Inactive)
 *     tags: [Hospitals]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: doctorId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the doctor.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Doctor status updated successfully.
 */
router.patch("/doctors/:id/status", protect, changeDoctorStatus);

module.exports = router;
