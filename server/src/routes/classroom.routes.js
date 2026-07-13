const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { requireMinRole } = require('../middleware/rbac.middleware');
const classroomController = require('../controllers/classroom.controller');

// Get all classrooms (public)
router.get('/', classroomController.getAllClassrooms);

// Get classroom by ID (public)
router.get('/:id', classroomController.getClassroomById);

// All routes below require authentication
router.use(authMiddleware);

// Get video URL for a lesson
router.get('/:classroomId/video/:id', classroomController.getVideoUrl);

// Update user progress in a classroom
router.post('/:classroomId/progress', classroomController.updateProgress);

// Create classroom (teacher/admin only)
router.post('/', requireMinRole('TEACHER'), classroomController.createClassroom);

// Update classroom (teacher/admin only)
router.put('/:id', requireMinRole('TEACHER'), classroomController.updateClassroom);

// Delete classroom (admin only)
router.delete('/:id', requireMinRole('ADMIN'), classroomController.deleteClassroom);

module.exports = router;
