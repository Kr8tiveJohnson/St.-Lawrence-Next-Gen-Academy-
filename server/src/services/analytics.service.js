const prisma = require('../config/database');

class AnalyticsService {
    static async getDashboardStats() {
        const [users, courses, questions, payments] = await Promise.all([
            prisma.user.count(),
            prisma.course.count(),
            prisma.pastQuestion.count(),
            prisma.payment.aggregate({ _sum: { amount: true } })
        ]);

        return {
            totalUsers: users,
            totalCourses: courses,
            totalQuestions: questions,
            totalRevenue: payments._sum.amount || 0
        };
    }
}

module.exports = AnalyticsService;
