const prisma = require('../config/database');
const sanitizeUser = require('../utils/sanitizeUser');

/**
 * Get current user profile
 */
async function getMe(req, res) {
  try {
    const user = sanitizeUser(req.user, req.user.id, req.user.role);
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Update user profile
 */
async function updateProfile(req, res) {
  try {
    const { fullName, surname, firstName, phone, dateOfBirth, targetClass, selectedSubjects } = req.body;
    const userId = req.user.id;

    const dataToUpdate = {
      phone: phone !== undefined ? phone : undefined,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      targetClass: targetClass !== undefined ? targetClass : undefined,
      selectedSubjects: selectedSubjects !== undefined ? selectedSubjects : undefined
    };

    if (surname !== undefined) dataToUpdate.surname = surname ? surname.trim() : null;
    if (firstName !== undefined) dataToUpdate.firstName = firstName ? firstName.trim() : null;
    if (fullName !== undefined) {
      dataToUpdate.fullName = fullName ? fullName.trim() : null;
    } else if (surname !== undefined || firstName !== undefined) {
      dataToUpdate.fullName = `${firstName || ''} ${surname || ''}`.trim() || undefined;
    }

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: dataToUpdate
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, permissionOverrides: true, enrollments: true }
    });

    const safeUser = sanitizeUser(user, userId, user.role);
    res.status(200).json({ user: safeUser });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get user by ID (with privacy controls)
 */
async function getUserById(req, res) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: { profile: true }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Apply privacy filtering and tier restrictions
    const safeUser = sanitizeUser(user, req.user?.id, req.user?.role);
    res.status(200).json({ user: safeUser });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Upload or update user photo
 */
async function uploadPhoto(req, res) {
  try {
    const { avatarUrl } = req.body;
    const userId = req.user.id;

    if (!avatarUrl) {
      return res.status(400).json({ error: 'Avatar URL is required' });
    }

    const updatedProfile = await prisma.profile.upsert({
      where: { userId },
      create: { userId, avatarUrl },
      update: { avatarUrl }
    });

    res.status(200).json({ profile: updatedProfile });
  } catch (error) {
    console.error('Upload photo error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Update privacy settings for current user
 */
async function updatePrivacySettings(req, res) {
  try {
    const { settings } = req.body;
    const userId = req.user.id;

    if (!settings || typeof settings !== 'object') {
      return res.status(400).json({ error: 'Settings object is required' });
    }

    // Upsert permission overrides
    const updated = [];
    for (const [key, value] of Object.entries(settings)) {
      const override = await prisma.permissionOverride.upsert({
        where: {
          userId_key: { userId, key }
        },
        create: { userId, key, value },
        update: { value }
      });
      updated.push(override);
    }

    res.status(200).json({ overrides: updated });
  } catch (error) {
    console.error('Update privacy settings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Update cookie consent for current user
 */
async function updateCookieConsent(req, res) {
  try {
    const { consent } = req.body;
    const userId = req.user.id;

    if (typeof consent !== 'boolean') {
      return res.status(400).json({ error: 'Consent boolean is required' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { cookieConsent: consent },
      include: { profile: true }
    });

    res.status(200).json({ cookieConsent: updatedUser.cookieConsent });
  } catch (error) {
    console.error('Update cookie consent error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Search users by name or email
 */
async function searchUsers(req, res) {
  try {
    const { q } = req.query;
    const currentUserId = req.user.id;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: 'Search query must be at least 2 characters' });
    }

    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: currentUserId } },
          { isActive: true },
          {
            OR: [
              { email: { contains: q.trim(), mode: 'insensitive' } },
              { profile: { fullName: { contains: q.trim(), mode: 'insensitive' } } },
            ]
          }
        ]
      },
      include: { profile: true },
      take: 20,
    });

    const safeUsers = users.map(u => sanitizeUser(u, currentUserId, req.user.role));
    res.status(200).json({ users: safeUsers });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getMe,
  updateProfile,
  getUserById,
  uploadPhoto,
  updatePrivacySettings,
  updateCookieConsent,
  searchUsers,
};
