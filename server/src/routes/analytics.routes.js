const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { requireMinRole } = require('../middleware/rbac.middleware');
const analyticsController = require('../controllers/analytics.controller');

// All analytics routes require authentication
router.use(authMiddleware);

// Get active users (public)
router.get('/active-users', analyticsController.getActiveUsers);

// Get popular subjects (public)
router.get('/popular-subjects', analyticsController.getPopularSubjects);

// Get engagement metrics (public)
router.get('/engagement', analyticsController.getEngagementMetrics);

// Get revenue (admin only)
router.get('/revenue', requireMinRole('ADMIN'), analyticsController.getRevenue);

module.exports = router;
