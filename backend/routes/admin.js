const express = require('express');
const {
    createUser,
    updateSystemSettings,
    viewSystemLogs,
    resetUserPassword,
    getNumberOfUsers
} = require('../controllers/adminController');
const { authenticateUser } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/admin/users:
 *   post:
 *     summary: Create a new user account (Doctor, Patient, Admin)
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
 *               role:
 *                 type: string
 *                 enum: [admin, doctor, patient]
 *     responses:
 *       201:
 *         description: User created successfully
 */
router.post('/users', authenticateUser, createUser);

/**
 * @swagger
 * /api/admin/system-settings:
 *   put:
 *     summary: Update system settings
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
 *               maintenanceMode:
 *                 type: boolean
 *               maxUsers:
 *                 type: integer
 *     responses:
 *       200:
 *         description: System settings updated successfully
 */
router.put('/system-settings', authenticateUser, updateSystemSettings);

/**
 * @swagger
 * /api/admin/system-logs:
 *   get:
 *     summary: View system logs
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of recent system logs
 */
router.get('/system-logs', authenticateUser, viewSystemLogs);

/**
 * @swagger
 * /api/admin/users/{userId}/reset-password:
 *   put:
 *     summary: Reset user password
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.put('/users/:userId/reset-password', authenticateUser, resetUserPassword);

/**
 * @swagger
 * /api/admin/users/count:
 *   get:
 *     summary: Get total number of users
 *     tags: [Admin]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Total number of users
 */
router.get('/users/count', authenticateUser, getNumberOfUsers);

module.exports = router;
