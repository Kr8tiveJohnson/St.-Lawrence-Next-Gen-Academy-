const prisma = require('../config/database');

/**
 * Get system dashboard stats (admin only)
 */
async function getDashboardStats(req, res) {
  try {
    const [
      totalUsers,
      totalStudents,
      activeTeachers,
      courses,
      newsArticles,
      hallOfFameEntries,
      messages,
      maleCount,
      femaleCount,
      cbtQuestions,
      cbtAttempts,
      recentUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'TEACHER' } }),
      prisma.course.count(),
      prisma.news.count({ where: { tag: { not: 'hall-of-fame' } } }),
      prisma.news.count({ where: { tag: 'hall-of-fame' } }),
      prisma.message.count(),
      prisma.profile.count({ where: { gender: { equals: 'Male', mode: 'insensitive' } } }).catch(() => 0),
      prisma.profile.count({ where: { gender: { equals: 'Female', mode: 'insensitive' } } }).catch(() => 0),
      prisma.cbtQuestion.count().catch(() => 0),
      prisma.cbtAttempt.count().catch(() => 0),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { profile: true }
      })
    ]);

    const premiumUsers = await prisma.user.count({ where: { tier: 'PAID' } });

    const revenueSum = await prisma.payment.aggregate({
      where: { status: 'SUCCESS' },
      _sum: {
        amount: true
      }
    });

    // Monthly registrations breakdown for dynamic bar chart
    const monthlyRegistrations = await prisma.user.findMany({
      select: { createdAt: true, role: true },
      orderBy: { createdAt: 'asc' }
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthMap = {};
    monthNames.forEach(m => { monthMap[m] = { month: m, student: 0, teacher: 0 }; });

    monthlyRegistrations.forEach(u => {
      const d = new Date(u.createdAt);
      const m = monthNames[d.getMonth()];
      if (monthMap[m]) {
        if (u.role === 'TEACHER') monthMap[m].teacher += 1;
        else monthMap[m].student += 1;
      }
    });

    const chartData = monthNames.map(m => monthMap[m]);

    res.status(200).json({
      totalUsers,
      totalStudents,
      activeTeachers,
      premiumUsers,
      totalRevenue: revenueSum._sum.amount || 0,
      coursesPublished: courses,
      newsArticles,
      hallOfFameEntries,
      totalMessages: messages,
      cbtQuestions,
      cbtAttempts,
      demographics: {
        male: maleCount,
        female: femaleCount,
        totalWithGender: maleCount + femaleCount
      },
      chartData,
      recentUsers,
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
    const { role, tier, search, limit = 100, offset = 0 } = req.query;

    const whereClause = {};
    if (role && role !== 'ALL') whereClause.role = role;
    if (tier && tier !== 'ALL') whereClause.tier = tier;
    if (search && search.trim()) {
      const q = search.trim();
      whereClause.OR = [
        { email: { contains: q, mode: 'insensitive' } },
        { profile: { fullName: { contains: q, mode: 'insensitive' } } },
        { profile: { surname: { contains: q, mode: 'insensitive' } } },
        { profile: { firstName: { contains: q, mode: 'insensitive' } } },
        { profile: { phone: { contains: q, mode: 'insensitive' } } }
      ];
    }

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

/**
 * Get all payment records (admin only)
 */
async function getPayments(req, res) {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        user: {
          include: { profile: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ payments });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get full detail for a single user (admin only)
 */
async function getUserDetail(req, res) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        enrollments: {
          include: { group: true }
        },
        sentFriendships: {
          where: { status: 'ACCEPTED' },
          include: { receiver: { include: { profile: true } } }
        },
        receivedFriendships: {
          where: { status: 'ACCEPTED' },
          include: { requester: { include: { profile: true } } }
        },
        sentMessages: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
        permissionOverrides: true,
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build a clean summary
    const friends = [
      ...user.sentFriendships.map(f => f.receiver),
      ...user.receivedFriendships.map(f => f.requester),
    ];

    const groups = user.enrollments.map(e => e.group);

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tier: user.tier,
        createdAt: user.createdAt,
        profile: user.profile,
      },
      stats: {
        friendsCount: friends.length,
        groupsCount: groups.length,
        messagesSent: user.sentMessages.length,
      },
      friends: friends.map(f => ({ id: f.id, email: f.email, fullName: f.profile?.fullName })),
      groups: groups.map(g => ({ id: g.id, name: g.name })),
    });
  } catch (error) {
    console.error('Get user detail error:', error);
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
  getAdSettings,
  getPayments,
  getUserDetail,
};
