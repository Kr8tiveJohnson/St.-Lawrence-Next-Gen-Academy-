const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { requireMinRole } = require('../middleware/rbac.middleware');
const siteContentController = require('../controllers/siteContent.controller');

// Get content (public)
router.get('/', siteContentController.getAllSiteContent);
router.get('/:key', siteContentController.getSiteContent);

// Update content (admin only)
router.use(authMiddleware);
router.put('/:key', requireMinRole('ADMIN'), siteContentController.updateSiteContent);

module.exports = router;
