const express = require('express');
const router = express.Router();
const prisma = require('../config/database');
const { newsletterLimiter } = require('../middleware/rateLimiter');

/**
 * POST /newsletter/subscribe
 * Stores an email for newsletter subscription with rate limiting
 */
router.post('/subscribe', newsletterLimiter, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email is required' });
    }

    // Upsert so duplicate emails don't throw an error
    await prisma.newsletterSubscriber.upsert({
      where: { email: email.trim().toLowerCase() },
      create: { email: email.trim().toLowerCase() },
      update: { updatedAt: new Date() },
    });

    res.status(200).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
