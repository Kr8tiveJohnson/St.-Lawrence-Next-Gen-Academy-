const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const { requireMinRole } = require('../middleware/rbac.middleware');
const questionController = require('../controllers/question.controller');

// Get all questions (public)
router.get('/', questionController.getAllQuestions);

// Search questions (public)
router.get('/search', questionController.searchQuestions);

// Get question by ID (public)
router.get('/:id', questionController.getQuestionById);

// All routes below require authentication
router.use(authMiddleware);

// Bookmark a question
router.post('/:id/bookmark', questionController.bookmarkQuestion);

// Remove bookmark
router.delete('/:id/bookmark', questionController.removeBookmark);

// Get user's bookmarks
router.get('/bookmarks/my', questionController.getBookmarks);

// Create a question (admin only)
router.post('/', requireMinRole('ADMIN'), questionController.createQuestion);

module.exports = router;
