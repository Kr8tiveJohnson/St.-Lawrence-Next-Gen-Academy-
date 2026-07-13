/**
 * Role-Based Access Control Middleware
 * Enforces minimum role requirements per route
 */

const roleHierarchy = {
  'STUDENT': 1,
  'TEACHER': 2,
  'ADMIN': 3,
  'MAIN_ADMIN': 4
};

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }

    const userRole = req.user.role;
    const hasRole = allowedRoles.includes(userRole);

    if (!hasRole) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
}

function requireMinRole(minimumRole) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: User not authenticated' });
    }

    const userLevel = roleHierarchy[req.user.role] || 0;
    const minimumLevel = roleHierarchy[minimumRole] || 0;

    if (userLevel < minimumLevel) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
}

module.exports = { requireRole, requireMinRole };
