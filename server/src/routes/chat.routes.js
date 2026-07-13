const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const chatController = require('../controllers/chat.controller');

// All chat routes require authentication
router.use(authMiddleware);

// Get all chat rooms/conversations
router.get('/rooms', chatController.getChatRooms);

// Get messages in a specific room
router.get('/rooms/:id/messages', chatController.getRoomMessages);

// Send a direct message
router.post('/messages', chatController.sendMessage);

// Report a message
router.post('/messages/:id/report', chatController.reportMessage);

module.exports = router;
