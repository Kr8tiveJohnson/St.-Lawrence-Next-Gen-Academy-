const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { requireMinRole } = require('../middleware/rbac.middleware');
const newsController = require('../controllers/news.controller');

// Get all news (public)
router.get('/', newsController.getAllNews);

// Get news by ID (public)
router.get('/:id', newsController.getNewsById);

// Get hall of fame (public)
router.get('/hall-of-fame/entries', newsController.getHallOfFame);

// All routes below require authentication
router.use(authMiddleware);

// Create news (admin only)
router.post('/', requireMinRole('ADMIN'), newsController.createNews);

// Update news (admin only)
router.put('/:id', requireMinRole('ADMIN'), newsController.updateNews);

// Delete news (admin only)
router.delete('/:id', requireMinRole('ADMIN'), newsController.deleteNews);

// Add hall of fame entry (admin only)
router.post('/hall-of-fame/add', requireMinRole('ADMIN'), newsController.addHallOfFameEntry);

module.exports = router;
