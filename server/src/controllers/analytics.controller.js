const prisma = require('../config/database');

/**
 * Get active users analytics
 */
async function getActiveUsers(req, res) {
  try {
    const { days = 30 } = req.query;
    const dateThreshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const activeUsers = await prisma.user.count({
      where: {
        updatedAt: {
          gte: dateThreshold
        }
      }
    });

    res.status(200).json({
      activeUsers,
      days,
      period: `Last ${days} days`
    });
  } catch (error) {
    console.error('Get active users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get popular subjects/courses
 */
async function getPopularSubjects(req, res) {
  try {
    const courses = await prisma.course.findMany({
      include: {
        _count: {
          select: { lessons: true }
        }
      },
      orderBy: { id: 'desc' },
      take: 10
    });

    const popular = courses.map(course => ({
      subject: course.subject,
      category: course.category,
      lessonCount: course._count.lessons,
      title: course.title
    }));

    res.status(200).json({ popular });
  } catch (error) {
    console.error('Get popular subjects error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get revenue analytics (admin only)
 */
async function getRevenue(req, res) {
  try {
    const { days = 30 } = req.query;
    const dateThreshold = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Count paid tier users (placeholder - actual implementation would query payment records)
    const paidUsers = await prisma.user.count({
      where: {
        tier: 'PAID'
      }
    });

    // Estimate revenue (would need actual payment data)
    const estimatedRevenue = paidUsers * 5000; // Assume ₦5,000 per user

    res.status(200).json({
      paidUsers,
      estimatedRevenue,
      currency: 'NGN',
      message: 'Revenue calculation is estimated. Implement actual payment tracking.'
    });
  } catch (error) {
    console.error('Get revenue error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get user engagement metrics
 */
async function getEngagementMetrics(req, res) {
  try {
    const [messageCount, bookmarkCount, enrollmentCount] = await Promise.all([
      prisma.message.count(),
      prisma.bookmark.count(),
      prisma.enrollment.count()
    ]);

    res.status(200).json({
      metrics: {
        totalMessages: messageCount,
        totalBookmarks: bookmarkCount,
        totalEnrollments: enrollmentCount
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Get engagement metrics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getActiveUsers,
  getPopularSubjects,
  getRevenue,
  getEngagementMetrics
};
