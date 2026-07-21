const { successResponse, errorResponse } = require('../utils/responseFormatter');
const prisma = require('../config/database');

const checkPrivacySettings = async (req, res, next) => {
    try {
        const { targetUserId } = req.params;
        const requesterId = req.user.id;

        if (targetUserId === requesterId) {
            return next();
        }

        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId },
            include: { permissionOverrides: true }
        });

        if (!targetUser) {
            return errorResponse(res, 404, 'User not found');
        }

        const isProfilePublic = targetUser.permissionOverrides.find(p => p.key === 'profile_public')?.value ?? true;

        if (!isProfilePublic) {
            return errorResponse(res, 403, 'This profile is private');
        }

        next();
    } catch (error) {
        return errorResponse(res, 500, 'Error checking privacy settings', error.message);
    }
};

module.exports = { checkPrivacySettings };
