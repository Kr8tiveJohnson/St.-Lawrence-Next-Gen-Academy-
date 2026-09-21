const express = require('express');
const router = express.Router();
const cbtController = require('../controllers/cbt.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireMinRole } = require('../middleware/rbac.middleware');
const { verifyToken } = require('../utils/tokenHelper');
const prisma = require('../config/database');

// Optional auth helper: attaches user if valid token present, otherwise proceeds without failing
async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split(' ')[1];
  const tokenResult = verifyToken(token);
  if (tokenResult.valid && tokenResult.decoded) {
    if (tokenResult.decoded.isStandaloneAdmin) {
      req.user = { id: 'admin', role: 'ADMIN', isStandaloneAdmin: true };
    } else {
      try {
        const user = await prisma.user.findUnique({
          where: { id: tokenResult.decoded.id }
        });
        if (user) req.user = user;
      } catch {
        /* silent */
      }
    }
  }
  next();
}

// Public & Student CBT endpoints (Sanitized: correctOption & explanation omitted unless teacher/admin)
router.get('/questions', optionalAuth, cbtController.getQuestions);
router.post('/exam/start', cbtController.startExam);
router.post('/exam/submit', optionalAuth, cbtController.submitExam);

// Authenticated Student CBT history
router.get('/attempts/me', authMiddleware, cbtController.getMyAttempts);

// Teacher & Admin Question Bank Management
router.post('/questions', authMiddleware, requireMinRole('TEACHER'), cbtController.createQuestion);
router.put('/questions/:id', authMiddleware, requireMinRole('TEACHER'), cbtController.updateQuestion);
router.delete('/questions/:id', authMiddleware, requireMinRole('TEACHER'), cbtController.deleteQuestion);

module.exports = router;
