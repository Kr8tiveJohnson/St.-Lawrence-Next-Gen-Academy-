const express = require('express');
const router = express.Router();
const progressController = require('../controllers/progress.controller');
const authMiddleware = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/me', progressController.getMyProgress);
router.post('/lessons/:lessonId/toggle', progressController.toggleLessonProgress);

module.exports = router;
