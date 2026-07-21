const transporter = require('../config/mail');

class EmailService {
    static async sendEmail({ to, subject, text, html }) {
        const mailOptions = {
            from: process.env.MAIL_FROM || 'noreply@stlawrence.edu',
            to,
            subject,
            text,
            html
        };

        try {
            const info = await transporter.sendMail(mailOptions);
            return { success: true, info };
        } catch (error) {
            console.error('Email send error:', error);
            return { success: false, error };
        }
    }
}

module.exports = EmailService;
