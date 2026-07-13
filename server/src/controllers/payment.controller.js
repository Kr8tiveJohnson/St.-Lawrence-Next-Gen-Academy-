const prisma = require('../config/database');

/**
 * Initiate checkout session (Paystack/Flutterwave)
 */
async function initializeCheckout(req, res) {
  try {
    const { amount, type, provider } = req.body;
    const userId = req.user.id;

    if (!amount || !type || !provider) {
      return res.status(400).json({ error: 'Amount, type, and provider are required' });
    }

    // Create a payment record or session
    // This would integrate with Paystack/Flutterwave APIs
    // For now, return a placeholder response
    
    const paymentData = {
      userId,
      amount,
      type, // e.g., 'premium_access', 'ad_free'
      provider, // 'paystack' or 'flutterwave'
      status: 'pending',
      reference: `PAY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    res.status(200).json({
      message: 'Payment initialization would happen here',
      ...paymentData,
      // In production, you'd get a redirect URL from the payment provider
      redirectUrl: `https://payment-provider.com/checkout?reference=${paymentData.reference}`
    });
  } catch (error) {
    console.error('Initialize checkout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Handle payment webhook (Paystack/Flutterwave)
 */
async function handlePaymentWebhook(req, res) {
  try {
    const { event, data } = req.body;

    // Verify webhook signature here with provider's public key
    // This is a placeholder implementation

    if (event === 'charge.success' || event === 'transaction.successful') {
      const { reference, customer, amount } = data;

      // Find user by email and update their tier
      const user = await prisma.user.findUnique({
        where: { email: customer?.email }
      });

      if (user) {
        await prisma.user.update({
          where: { id: user.id },
          data: { tier: 'PAID' }
        });
      }

      res.status(200).json({ message: 'Payment processed successfully' });
    } else {
      res.status(200).json({ message: 'Webhook received but not processed' });
    }
  } catch (error) {
    console.error('Payment webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Toggle ad-free status for user
 */
async function toggleAdFree(req, res) {
  try {
    const userId = req.user.id;

    // Check if user is PAID tier
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || user.tier !== 'PAID') {
      return res.status(403).json({ error: 'User is not a paid member' });
    }

    // Toggle ad-free permission override
    const override = await prisma.permissionOverride.upsert({
      where: {
        userId_key: { userId, key: 'ads_disabled' }
      },
      create: { userId, key: 'ads_disabled', value: true },
      update: { value: !true } // Toggle
    });

    res.status(200).json({ adFree: override.value });
  } catch (error) {
    console.error('Toggle ad-free error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get user's payment history
 */
async function getPaymentHistory(req, res) {
  try {
    const userId = req.user.id;

    // Placeholder - would query payment records from database
    res.status(200).json({
      payments: [],
      message: 'Payment history would be retrieved here'
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  initializeCheckout,
  handlePaymentWebhook,
  toggleAdFree,
  getPaymentHistory
};
