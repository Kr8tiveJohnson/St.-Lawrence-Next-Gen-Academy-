const axios = require('axios');
const prisma = require('../config/database');
const paymentConfig = require('../config/payment');

class PaymentService {
    static async verifyPaystackPayment(reference) {
        try {
            const response = await axios.get(`https://api.paystack.co/transaction/verify/${reference}`, {
                headers: {
                    Authorization: `Bearer ${paymentConfig.paystackSecretKey}`
                }
            });

            if (response.data.status && response.data.data.status === 'success') {
                return { success: true, data: response.data.data };
            }
            return { success: false, message: 'Payment verification failed' };
        } catch (error) {
            console.error('Paystack verify error:', error.message);
            return { success: false, error: error.message };
        }
    }

    static async recordPayment(userId, amount, type, reference) {
        return prisma.payment.create({
            data: { userId, amount, type, reference, status: 'SUCCESS' }
        });
    }
}

module.exports = PaymentService;
