const express = require("express");
const {
  registerHospital,
  getAllHospitals,
  getHospitalById,
  getHospitalStats,
  // <<< ADDED >>>
  createDoctor,
  getAdminStats,
} = require("../controller/admin");
const { protect } = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: API routes for admin management
 */

/**
 * @swagger
 * /api/admin/hospitals:
 *   post:
 *     summary: Register a new hospital (Admin Only)
 *     tags: [Admin]
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
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *             example:
 *               name: MyHospital
 *               email: hospital@example.com
 *               password: "SecretPassword123"
 *               phone: "123-456-7890"
 *               address: "1234 Some St"
 *               city: "SomeCity"
 *               state: "ST"
 *               country: "Country"
 *     responses:
 *       201:
 *         description: Hospital registered successfully.
 */
router.post("/hospitals", protect, registerHospital);

/**
 * @swagger
 * /api/admin/hospitals:
 *   get:
 *     summary: Get a list of all active hospitals
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of active hospitals retrieved successfully.
 */
router.get("/hospitals", protect, getAllHospitals);

/**
 * @swagger
 * /api/admin/hospitals/{id}:
 *   get:
 *     summary: Get specific hospital details
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hospital details retrieved successfully.
 *       404:
 *         description: Hospital not found.
 */
router.get("/hospitals/:id", protect, getHospitalById);

/**
 * @swagger
 * /api/admin/hospitals/{id}/stats:
 *   get:
 *     summary: Get hospital statistics (Doctors & Patients count)
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hospital statistics retrieved successfully.
 */
router.get(
  "/hospitals/:id/stats",
  protect,
  getHospitalStats
);

/* ------------------------------------------------------------------
   NEW ROUTES
   1) Create a doctor (Admin only)
   2) Get admin stats
   ------------------------------------------------------------------ */

/**
 * @swagger
 * /api/admin/doctor:
 *   post:
 *     summary: Create a new doctor (Admin Only)
 *     tags: [Admin]
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
 *               phone:
 *                 type: string
 *               DOB:
 *                 type: string
 *               gender:
 *                 type: string
 *               address:
 *                 type: string
 *               password:
 *                 type: string
 *               hospitalId:
 *                 type: string
 *               specialty:
 *                 type: string
 *               licenseNumber:
 *                 type: string
 *               department:
 *                 type: string
 *             example:
 *               firstName: John
 *               lastName: Doe
 *               email: john.doe@hospital.com
 *               phone: "123456789"
 *               DOB: "1980-06-15"
 *               gender: "Male"
 *               address: "1234 Some Place"
 *               password: "DoctorPassword!"
 *               hospitalId: "602c74aae8e0861e245d7355"
 *               specialty: "Brain surgery"
 *               licenseNumber: "120200202!"
 *               department: "surgery"
 *     responses:
 *       201:
 *         description: Doctor created successfully
 *       400:
 *         description: A doctor with this email already exists
 *       500:
 *         description: Server error
 */
router.post("/doctor", protect, createDoctor);


module.exports = router;
