const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const userController = require('../controllers/user.controller');

// All user routes require authentication
router.use(authMiddleware);

// Get current user profile
router.get('/me', userController.getMe);

// Update current user profile
router.put('/me', userController.updateProfile);

// Upload user photo
router.post('/me/photo', userController.uploadPhoto);

// Update privacy settings
router.put('/me/privacy', userController.updatePrivacySettings);

// Update cookie consent
router.put('/me/cookies', userController.updateCookieConsent);

// Get user by ID (with privacy controls)
router.get('/:id', userController.getUserById);

module.exports = router;
