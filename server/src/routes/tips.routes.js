const express = require('express');
const router = express.Router();
const tipsController = require('../controllers/tips.controller');
const authMiddleware = require('../middleware/auth.middleware');
const { requireMinRole } = require('../middleware/rbac.middleware');

// Public access to TIPS
router.get('/', tipsController.getAllTips);
router.get('/:id', tipsController.getTipById);

// Teacher and Admin content management
router.post('/', authMiddleware, requireMinRole('TEACHER'), tipsController.createTip);
router.put('/:id', authMiddleware, requireMinRole('TEACHER'), tipsController.updateTip);
router.delete('/:id', authMiddleware, requireMinRole('TEACHER'), tipsController.deleteTip);

module.exports = router;
