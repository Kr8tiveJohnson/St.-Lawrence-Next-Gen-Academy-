/**
 * Role definitions and hierarchy
 * STUDENT: Base user role
 * TEACHER: Can create classrooms, moderate groups
 * ADMIN: Can manage content, users, groups
 * MAIN_ADMIN: Super admin, full system access
 */

const ROLES = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN',
  MAIN_ADMIN: 'MAIN_ADMIN'
};

const ROLE_HIERARCHY = {
  [ROLES.STUDENT]: 1,
  [ROLES.TEACHER]: 2,
  [ROLES.ADMIN]: 3,
  [ROLES.MAIN_ADMIN]: 4
};

module.exports = { ROLES, ROLE_HIERARCHY };
