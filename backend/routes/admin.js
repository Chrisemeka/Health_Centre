const express = require("express");
const {
  registerHospital,
  getAllHospitals,
  getHospitalById,
  getHospitalStats,
} = require("../controller/admin");
const { protect } = require("../middleware/auth"); // Ensure authentication middleware is used
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
 *     summary: Register a new hospital
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
 *               adminName:
 *                 type: string
 *               adminEmail:
 *                 type: string
 *                 format: email
 *               adminPhone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Hospital registered successfully.
 */
router.post("/hospitals", protect, roleMiddleware('admin'), registerHospital);

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
router.get("/hospitals/:id/stats", protect,roleMiddleware('admin'), getHospitalStats);

module.exports = router;
