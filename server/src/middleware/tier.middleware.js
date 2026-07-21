const { errorResponse } = require('../utils/responseFormatter');
const { TIERS } = require('../constants/tiers');

const requirePremium = (req, res, next) => {
    if (!req.user) {
        return errorResponse(res, 401, 'Unauthorized access');
    }

    if (req.user.tier !== TIERS.PAID) {
        return errorResponse(res, 403, 'Premium subscription required to access this feature');
    }

    next();
};

const requireTier = (allowedTiers) => {
    return (req, res, next) => {
        if (!req.user || !allowedTiers.includes(req.user.tier)) {
            return errorResponse(res, 403, 'You do not have the required subscription tier');
        }
        next();
    };
};

module.exports = { requirePremium, requireTier };
