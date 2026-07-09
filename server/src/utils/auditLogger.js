// auditLogger.js — Explicit audit trail for all sensitive admin actions
// Logs to the auditLog model (database) AND optionally to file/monitoring service.
// Events tracked:
//   PROMOTE_TO_TEACHER     — student upgraded to teacher (who did it, when)
//   APPOINT_ADMIN          — new admin appointed (SuperAdmin only action)
//   REVOKE_ADMIN           — admin access removed (SuperAdmin only)
//   GRANT_OVERRIDE         — per-profile permission exception added
//   REVOKE_OVERRIDE        — per-profile permission exception removed
//   APPROVE_TEACHER_REG    — teacher registration accepted
//   DENY_TEACHER_REG       — teacher registration rejected
//   APPROVE_PHOTO          — profile photo approved
//   REJECT_PHOTO           — profile photo rejected
//   GRANT_CLASSROOM        — classroom/group creation request approved (free or paid)
//   BAN_USER               — account suspended or banned
//   UPGRADE_TIER           — manual tier upgrade granted to a user
