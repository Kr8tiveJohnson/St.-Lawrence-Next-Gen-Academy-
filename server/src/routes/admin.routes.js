const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { requireMinRole } = require('../middleware/rbac.middleware');
const adminController = require('../controllers/admin.controller');

// All admin routes require authentication and ADMIN role
router.use(authMiddleware);
router.use(requireMinRole('ADMIN'));

// Dashboard stats
router.get('/stats', adminController.getDashboardStats);

// User management
router.get('/users', adminController.getAllUsers);
router.put('/users/:id/role', adminController.updateUserRole);
router.delete('/users/:id', adminController.deleteUser);

// Classroom activity
router.get('/classrooms/activity', adminController.getClassroomActivity);

// Audit logs
router.get('/logs', adminController.getAuditLogs);

// Ad settings
router.get('/ads/settings', adminController.getAdSettings);
router.post('/ads/settings', adminController.manageAdSettings);

module.exports = router;
