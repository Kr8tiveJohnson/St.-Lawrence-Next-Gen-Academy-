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
    const { fullName, phone, dateOfBirth } = req.body;
    const userId = req.user.id;

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        fullName: fullName || undefined,
        phone: phone || undefined,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined
      }
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, permissionOverrides: true }
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

    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: { avatarUrl }
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

module.exports = {
  getMe,
  updateProfile,
  getUserById,
  uploadPhoto,
  updatePrivacySettings,
  updateCookieConsent
};
