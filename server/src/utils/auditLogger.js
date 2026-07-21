// auditLogger.js - Logs admin actions (placeholder)
const logAdminAction = (adminId, action, target, details) => {
    console.log(`[AUDIT] Admin ${adminId} performed ${action} on ${target}:`, details);
    // Future: Write to Prisma audit log table
};

module.exports = { logAdminAction };
