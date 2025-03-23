const express = require('express');
const router = express.Router();
const superAdminController = require('../controller/superAdmin');
const roleMiddleware = require('../middleware/role');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: SuperAdmin
 *   description: Endpoints accessible only by super admins
 */

/**
 * @swagger
 * /api/super/create:
 *   post:
 *     summary: Create a new admin user (requires super admin privileges).
 *     tags: [SuperAdmin]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - password
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
 *             example:
 *               firstName: Admin
 *               lastName: User
 *               email: adminuser@example.com
 *               phone: "1234567890"
 *               DOB: "1990-01-01"
 *               gender: "Female"
 *               address: "123 Admin Street"
 *               password: Passw0rd!
 *     responses:
 *       201:
 *         description: New admin created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: New admin created successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     userType:
 *                       type: string
 *                       example: admin
 *       400:
 *         description: Missing fields or email already in use
 *       403:
 *         description: Forbidden. Only super admins can create new admins
 *       500:
 *         description: Server error
 */
router.post('/create', roleMiddleware('superAdmin'), superAdminController.createAdmin);

/**
 * @swagger
 * /api/super/stats:
 *   get:
 *     summary: Get total admins, total patients, total doctors, and creation logs (requires super admin).
 *     tags: [SuperAdmin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns counts and logs
 *       403:
 *         description: Forbidden. Only super admins can access this route.
 *       500:
 *         description: Server error
 */
// <<< ADDED >>>
router.get('/stats', roleMiddleware('superAdmin'), superAdminController.getStats);


/**
 * @swagger
 * /api/super/admins:
 *   get:
 *     summary: Get all admins
 *     tags: [SuperAdmin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all admins retrieved successfully.
 *       403:
 *         description: Access denied. Only super admins can view this information.
 *       500:
 *         description: Server error
 */
router.get("/admins", roleMiddleware("superAdmin"), superAdminController.getAllAdmins); // New route for getting all admins


module.exports = router;
