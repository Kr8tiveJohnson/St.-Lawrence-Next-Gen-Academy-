const express = require('express');
const router = express.Router();
const cbtController = require('../controllers/cbt.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireMinRole } = require('../middleware/rbac.middleware');
const { verifyToken } = require('../utils/tokenHelper');
const prisma = require('../config/database');

// Optional auth helper: attaches user if valid token present, otherwise proceeds
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
          where: { id: tokenResult.decoded.id },
          include: { profile: true }
        });
        if (user) req.user = user;
      } catch {
        /* silent */
      }
    }
  }
  next();
}

// ── Public & Student CBT endpoints ───────────────────────────────────────────
router.post('/verify-candidate', cbtController.verifyCandidate);
router.get('/subjects', cbtController.getSubjects);
router.get('/questions', optionalAuth, cbtController.getQuestions);
router.post('/exam/start', cbtController.startExam);
router.post('/exam/submit', optionalAuth, cbtController.submitExam);
router.get('/attempts/me', authMiddleware, cbtController.getMyAttempts);

// ── Teacher & Admin CBT Question Management System ───────────────────────────
// Metrics & Statistics
router.get('/admin/stats', authMiddleware, requireMinRole('TEACHER'), cbtController.getAdminStats);

// Bulk Import & Templates
router.get('/questions/import-template', cbtController.getImportTemplate);
router.get('/questions/import-history', authMiddleware, requireMinRole('TEACHER'), cbtController.getImportHistory);
router.post('/questions/import', authMiddleware, requireMinRole('TEACHER'), cbtController.importQuestions);

// AI Question Generation
router.post('/questions/ai-generate', authMiddleware, requireMinRole('TEACHER'), cbtController.aiGenerate);

// Bulk Actions (Approve, Reject, Archive, Publish, Delete)
router.post('/questions/bulk', authMiddleware, requireMinRole('TEACHER'), cbtController.bulkActionQuestions);

// Single Question Details, Create, Update, Delete, Review
router.get('/questions/:id', authMiddleware, requireMinRole('TEACHER'), cbtController.getQuestionById);
router.post('/questions', authMiddleware, requireMinRole('TEACHER'), cbtController.createQuestion);
router.put('/questions/:id', authMiddleware, requireMinRole('TEACHER'), cbtController.updateQuestion);
router.delete('/questions/:id', authMiddleware, requireMinRole('TEACHER'), cbtController.deleteQuestion);
router.post('/questions/:id/review', authMiddleware, requireMinRole('TEACHER'), cbtController.reviewQuestion);

// Subject & Topic Configuration
router.post('/subjects', authMiddleware, requireMinRole('TEACHER'), cbtController.createSubject);
router.post('/subjects/:subjectId/topics', authMiddleware, requireMinRole('TEACHER'), cbtController.createTopic);

module.exports = router;
