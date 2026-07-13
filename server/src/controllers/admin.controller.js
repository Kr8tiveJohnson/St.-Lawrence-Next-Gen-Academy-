const prisma = require('../config/database');

/**
 * Get system dashboard stats (admin only)
 */
async function getDashboardStats(req, res) {
  try {
    const [totalUsers, activeTeachers, courses, newsArticles, hallOfFameEntries, messages] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'TEACHER' } }),
      prisma.course.count(),
      prisma.news.count({ where: { tag: { not: 'hall-of-fame' } } }),
      prisma.news.count({ where: { tag: 'hall-of-fame' } }),
      prisma.message.count()
    ]);

    const premiumUsers = await prisma.user.count({ where: { tier: 'PAID' } });

    res.status(200).json({
      totalUsers,
      activeTeachers,
      premiumUsers,
      totalRevenue: null,
      coursesPublished: courses,
      newsArticles,
      hallOfFameEntries,
      totalMessages: messages,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get all users (admin only)
 */
async function getAllUsers(req, res) {
  try {
    const { role, tier, limit = 50, offset = 0 } = req.query;

    const whereClause = {};
    if (role) whereClause.role = role;
    if (tier) whereClause.tier = tier;

    const users = await prisma.user.findMany({
      where: whereClause,
      include: { profile: true },
      take: parseInt(limit),
      skip: parseInt(offset),
      orderBy: { createdAt: 'desc' }
    });

    const total = await prisma.user.count({ where: whereClause });

    res.status(200).json({ users, total, limit: parseInt(limit), offset: parseInt(offset) });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Update user role or tier (admin only)
 */
async function updateUserRole(req, res) {
  try {
    const { id } = req.params;
    const { role, tier } = req.body;

    if (!role && !tier) {
      return res.status(400).json({ error: 'Role or tier must be provided' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: {
        role: role || undefined,
        tier: tier || undefined
      },
      include: { profile: true }
    });

    res.status(200).json({ user });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Delete user account (admin only)
 */
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    // Cascade delete via Prisma relations
    await prisma.user.delete({ where: { id } });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get all classroom requests/activity (admin only)
 */
async function getClassroomActivity(req, res) {
  try {
    const classrooms = await prisma.course.findMany({
      include: {
        _count: { select: { lessons: true } },
        lessons: { take: 5 }
      },
      orderBy: { id: 'desc' }
    });

    res.status(200).json({ classrooms });
  } catch (error) {
    console.error('Get classroom activity error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get audit logs (admin only)
 */
async function getAuditLogs(req, res) {
  try {
    const { limit = 100, offset = 0 } = req.query;

    // Placeholder for audit logs - you may need to create an AuditLog model
    res.status(200).json({
      logs: [],
      message: 'Audit logging system needs to be implemented'
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Manage ad settings (admin only)
 */
async function manageAdSettings(req, res) {
  try {
    const { slot, clientId, isActive, price } = req.body;

    if (!slot) {
      return res.status(400).json({ error: 'Slot is required' });
    }

    const setting = await prisma.adSetting.upsert({
      where: { slot },
      create: { slot, clientId, isActive: isActive !== false, price },
      update: { clientId, isActive, price }
    });

    res.status(200).json({ setting });
  } catch (error) {
    console.error('Manage ad settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get all ad settings (admin only)
 */
async function getAdSettings(req, res) {
  try {
    const settings = await prisma.adSetting.findMany();
    res.status(200).json({ settings });
  } catch (error) {
    console.error('Get ad settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getClassroomActivity,
  getAuditLogs,
  manageAdSettings,
  getAdSettings
};
