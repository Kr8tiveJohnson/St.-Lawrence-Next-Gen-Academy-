const prisma = require('../config/database');
const sanitizeUser = require('../utils/sanitizeUser');

/**
 * Get all groups with member count
 */
async function getAllGroups(req, res) {
  try {
    const groups = await prisma.group.findMany({
      include: {
        _count: {
          select: { enrollments: true }
        }
      }
    });

    res.status(200).json({ groups });
  } catch (error) {
    console.error('Get all groups error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get group by ID with members
 */
async function getGroupById(req, res) {
  try {
    const { id } = req.params;

    const group = await prisma.group.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            user: {
              include: { profile: true }
            }
          }
        }
      }
    });

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Sanitize user data in enrollments
    const enrollmentsWithSafeUsers = group.enrollments.map(enrollment => ({
      ...enrollment,
      user: sanitizeUser(enrollment.user, req.user?.id, req.user?.role)
    }));

    res.status(200).json({ group: { ...group, enrollments: enrollmentsWithSafeUsers } });
  } catch (error) {
    console.error('Get group by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Create a new group (teacher/admin only)
 */
async function createGroup(req, res) {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Group name is required' });
    }

    const group = await prisma.group.create({
      data: {
        name,
        description: description || null
      }
    });

    res.status(201).json({ group });
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Join a group
 */
async function joinGroup(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if group exists
    const group = await prisma.group.findUnique({ where: { id } });
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if already member
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_groupId: { userId, groupId: id }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Already a member of this group' });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        groupId: id
      }
    });

    res.status(201).json({ enrollment });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Leave a group
 */
async function leaveGroup(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const enrollment = await prisma.enrollment.deleteMany({
      where: {
        userId,
        groupId: id
      }
    });

    if (enrollment.count === 0) {
      return res.status(404).json({ error: 'Not a member of this group' });
    }

    res.status(200).json({ message: 'Left group successfully' });
  } catch (error) {
    console.error('Leave group error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Update group (admin only)
 */
async function updateGroup(req, res) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const group = await prisma.group.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined
      }
    });

    res.status(200).json({ group });
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Delete group (admin only)
 */
async function deleteGroup(req, res) {
  try {
    const { id } = req.params;

    await prisma.group.delete({ where: { id } });
    res.status(200).json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllGroups,
  getGroupById,
  createGroup,
  joinGroup,
  leaveGroup,
  updateGroup,
  deleteGroup
};
