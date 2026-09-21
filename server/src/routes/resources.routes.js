const express = require('express');
const router = express.Router();
const resourcesController = require('../controllers/resources.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireMinRole } = require('../middleware/rbac.middleware');

// Public search and download of study materials
router.get('/', resourcesController.getAllResources);
router.get('/:id', resourcesController.getResourceById);

// Teacher and Admin upload, update, and removal
router.post('/', authMiddleware, requireMinRole('TEACHER'), resourcesController.createResource);
router.put('/:id', authMiddleware, requireMinRole('TEACHER'), resourcesController.updateResource);
router.delete('/:id', authMiddleware, requireMinRole('TEACHER'), resourcesController.deleteResource);

module.exports = router;
