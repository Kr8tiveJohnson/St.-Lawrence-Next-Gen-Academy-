const express = require('express');
const router = express.Router();
const assignmentsController = require('../controllers/assignments.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireMinRole } = require('../middleware/rbac.middleware');
const { verifyToken } = require('../utils/tokenHelper');
const prisma = require('../config/database');

async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return next();
  const token = authHeader.split(' ')[1];
  const tokenResult = verifyToken(token);
  if (tokenResult.valid && tokenResult.decoded) {
    if (tokenResult.decoded.isStandaloneAdmin) {
      req.user = { id: 'admin', role: 'ADMIN', isStandaloneAdmin: true };
    } else {
      try {
        const user = await prisma.user.findUnique({ where: { id: tokenResult.decoded.id } });
        if (user) req.user = user;
      } catch {}
    }
  }
  next();
}

// Student & Public list
router.get('/', optionalAuth, assignmentsController.getAllAssignments);

// Student Submit
router.post('/:id/submit', authMiddleware, assignmentsController.submitAssignment);

// Teacher & Admin Management
router.post('/', authMiddleware, requireMinRole('TEACHER'), assignmentsController.createAssignment);
router.get('/:id/submissions', authMiddleware, requireMinRole('TEACHER'), assignmentsController.getSubmissionsForAssignment);
router.put('/submissions/:id/grade', authMiddleware, requireMinRole('TEACHER'), assignmentsController.gradeSubmission);

module.exports = router;
