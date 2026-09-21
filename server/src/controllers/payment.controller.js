const crypto = require('crypto');
const prisma = require('../config/database');

/**
 * Initiate checkout session for Paystack
 * Prepares reference and metadata for frontend Paystack Popup / Inline / Redirect
 */
async function initializeCheckout(req, res) {
  try {
    const { amount, type = 'ad_free', plan = 'monthly' } = req.body;
    const userId = req.user.id;
    const userEmail = req.user.email;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    const paystackPublicKey = process.env.PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder';

    // Unique transaction reference
    const reference = `STLN_${Date.now()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    // If Paystack Secret Key is configured, we can initialize via Paystack API or return client config
    res.status(200).json({
      message: 'Paystack checkout session initialized',
      provider: 'paystack',
      reference,
      amount: Math.round(Number(amount) * 100), // Paystack accepts amount in Kobo
      currency: 'NGN',
      email: userEmail,
      publicKey: paystackPublicKey,
      metadata: {
        userId,
        type,
        plan
      }
    });
  } catch (error) {
    console.error('Initialize checkout error:', error);
    res.status(500).json({ error: 'Internal server error initializing checkout' });
  }
}

/**
 * Handle Paystack payment webhook with cryptographic HMAC-SHA512 verification
 */
async function handlePaymentWebhook(req, res) {
  try {
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;

    // Reject webhook processing if secret key is not configured to prevent unauthenticated access
    if (!paystackSecretKey) {
      console.warn('Payment webhook received but PAYSTACK_SECRET_KEY is not configured on server.');
      return res.status(503).json({ error: 'Payment gateway configuration pending' });
    }

    // Verify signature header
    const signature = req.headers['x-paystack-signature'];
    if (!signature) {
      return res.status(401).json({ error: 'Missing Paystack signature header' });
    }

    // Compute expected hash from raw payload
    const hash = crypto
      .createHmac('sha512', paystackSecretKey)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (hash !== signature) {
      console.warn('Invalid Paystack webhook signature rejected');
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const { event, data } = req.body;

    // Process charge.success event
    if (event === 'charge.success') {
      const { reference, customer, metadata, amount } = data || {};
      const targetEmail = customer?.email || metadata?.email;
      const targetUserId = metadata?.userId;

      let user = null;
      if (targetUserId) {
        user = await prisma.user.findUnique({ where: { id: targetUserId } });
      } else if (targetEmail) {
        user = await prisma.user.findUnique({ where: { email: targetEmail } });
      }

      if (user) {
        // Upgrade user tier to PAID
        await prisma.user.update({
          where: { id: user.id },
          data: { tier: 'PAID' }
        });

        // Grant ad-free permission override
        await prisma.permissionOverride.upsert({
          where: { userId_key: { userId: user.id, key: 'ads_disabled' } },
          create: { userId: user.id, key: 'ads_disabled', value: true },
          update: { value: true }
        });

        console.log(`Payment confirmed for user: ${user.email}, Reference: ${reference}`);
      }

      return res.status(200).json({ message: 'Webhook processed successfully' });
    }

    // Acknowledge other event types from Paystack
    res.status(200).json({ message: 'Webhook received' });
  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(500).json({ error: 'Internal server error processing webhook' });
  }
}

/**
 * Toggle ad-free status for user (only allowed for PAID tier users)
 */
async function toggleAdFree(req, res) {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.tier !== 'PAID') {
      return res.status(403).json({ error: 'Ad-free access requires an active paid subscription' });
    }

    const existing = await prisma.permissionOverride.findUnique({
      where: { userId_key: { userId, key: 'ads_disabled' } }
    });

    const nextValue = existing ? !existing.value : true;

    const override = await prisma.permissionOverride.upsert({
      where: { userId_key: { userId, key: 'ads_disabled' } },
      create: { userId, key: 'ads_disabled', value: nextValue },
      update: { value: nextValue }
    });

    res.status(200).json({ adFree: override.value });
  } catch (error) {
    console.error('Toggle ad-free error:', error);
    res.status(500).json({ error: 'Internal server error toggling ad preferences' });
  }
}

/**
 * Get user's payment history
 */
async function getPaymentHistory(req, res) {
  try {
    const userId = req.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { tier: true, createdAt: true }
    });

    res.status(200).json({
      tier: user?.tier || 'FREE',
      payments: []
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Internal server error fetching payment history' });
  }
}

module.exports = {
  initializeCheckout,
  handlePaymentWebhook,
  toggleAdFree,
  getPaymentHistory
};
