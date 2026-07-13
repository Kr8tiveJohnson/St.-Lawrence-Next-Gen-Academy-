const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware');
const paymentController = require('../controllers/payment.controller');

// Initialize checkout
router.post('/checkout', authMiddleware, paymentController.initializeCheckout);

// Payment webhook (public, should verify signature)
router.post('/webhook', paymentController.handlePaymentWebhook);

// Toggle ad-free status
router.put('/ad-free/toggle', authMiddleware, paymentController.toggleAdFree);

// Get payment history
router.get('/history', authMiddleware, paymentController.getPaymentHistory);

module.exports = router;
