const express = require('express');
const router = express.Router();
const prisma = require('../config/database');

/**
 * POST /newsletter/subscribe
 * Stores an email for newsletter subscription
 */
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email is required' });
    }

    // Upsert so duplicate emails don't throw an error
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email },
      update: { updatedAt: new Date() },
    });

    res.status(200).json({ message: 'Subscribed successfully' });
  } catch (error) {
    console.error('Newsletter subscribe error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
