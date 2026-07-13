const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { requireMinRole } = require('../middleware/rbac.middleware');
const groupController = require('../controllers/group.controller');

// Get all groups (public)
router.get('/', groupController.getAllGroups);

// All routes below require authentication
router.use(authMiddleware);

// Get group by ID
router.get('/:id', groupController.getGroupById);

// Create a new group (teacher or admin only)
router.post('/', requireMinRole('TEACHER'), groupController.createGroup);

// Join a group
router.post('/:id/join', groupController.joinGroup);

// Leave a group
router.delete('/:id/leave', groupController.leaveGroup);

// Update group (admin only)
router.put('/:id', requireMinRole('ADMIN'), groupController.updateGroup);

// Delete group (admin only)
router.delete('/:id', requireMinRole('ADMIN'), groupController.deleteGroup);

module.exports = router;
