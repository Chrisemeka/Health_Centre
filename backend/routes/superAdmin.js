// routes/superAdminRoutes.js
const express = require('express');
const router = express.Router();
const superAdminController = require('../controller/superAdmin'); 
// ^ adjust path if your file is actually named superAdminController.js or in a different folder
const roleMiddleware = require('../middleware/role');

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
 *               password:
 *                 type: string
 *             example:
 *               firstName: Admin
 *               lastName: User
 *               email: adminuser@example.com
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

module.exports = router;
