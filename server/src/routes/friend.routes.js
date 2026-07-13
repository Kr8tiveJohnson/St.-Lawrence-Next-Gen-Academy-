const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const friendController = require('../controllers/friend.controller');

// All friend routes require authentication
router.use(authMiddleware);

// Get user's friends list
router.get('/', friendController.getFriends);

// Get pending friend requests
router.get('/requests/pending', friendController.getPendingRequests);

// Send a friend request
router.post('/request', friendController.sendFriendRequest);

// Accept a friend request
router.put('/:id/accept', friendController.acceptFriendRequest);

// Reject or unfriend
router.put('/:id/reject', friendController.rejectFriendRequest);

module.exports = router;
