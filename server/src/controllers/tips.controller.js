const prisma = require('../config/database');

// ── GET /api/tips (List & Search TIPS) ──────────────────────────
async function getAllTips(req, res) {
  try {
    const { subject, category, search } = req.query;
    const where = {};

    if (subject && subject !== 'ALL') {
      where.subject = { equals: subject, mode: 'insensitive' };
    }
    if (category && category !== 'ALL') {
      where.category = { contains: category, mode: 'insensitive' };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { keyIdea: { contains: search, mode: 'insensitive' } },
        { explanation: { contains: search, mode: 'insensitive' } },
        { memoryTrick: { contains: search, mode: 'insensitive' } },
        { formulaOrRule: { contains: search, mode: 'insensitive' } },
      ];
    }

    const tips = await prisma.tip.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json({ tips });
  } catch (error) {
    console.error('getAllTips error:', error);
    res.status(500).json({ error: 'Failed to retrieve TIPS lessons' });
  }
}

// ── GET /api/tips/:id (Single TIP Detail) ───────────────────────
async function getTipById(req, res) {
  try {
    const { id } = req.params;
    const tip = await prisma.tip.findUnique({ where: { id } });

    if (!tip) {
      return res.status(404).json({ error: 'TIPS lesson not found' });
    }

    res.json({ tip });
  } catch (error) {
    console.error('getTipById error:', error);
    res.status(500).json({ error: 'Failed to retrieve TIPS details' });
  }
}

// ── POST /api/tips (Teacher / Admin Create) ─────────────────────
async function createTip(req, res) {
  try {
    const {
      title,
      subject,
      category,
      keyIdea,
      explanation,
      example,
      memoryTrick,
      formulaOrRule,
      commonMistake,
      quickRecall
    } = req.body;

    if (!title || !subject || !keyIdea || !explanation) {
      return res.status(400).json({ error: 'Please provide title, subject, keyIdea, and explanation' });
    }

    const tip = await prisma.tip.create({
      data: {
        title,
        subject,
        category: category || 'General',
        keyIdea,
        explanation,
        example: example || null,
        memoryTrick: memoryTrick || null,
        formulaOrRule: formulaOrRule || null,
        commonMistake: commonMistake || null,
        quickRecall: quickRecall || null,
        authorId: req.user?.id || null
      }
    });

    res.status(201).json({ message: 'TIPS topic created successfully', tip });
  } catch (error) {
    console.error('createTip error:', error);
    res.status(500).json({ error: 'Failed to create TIPS topic' });
  }
}

// ── PUT /api/tips/:id (Teacher / Admin Update) ──────────────────
async function updateTip(req, res) {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    const updated = await prisma.tip.update({
      where: { id },
      data
    });

    res.json({ message: 'TIPS topic updated successfully', tip: updated });
  } catch (error) {
    console.error('updateTip error:', error);
    res.status(500).json({ error: 'Failed to update TIPS topic' });
  }
}

// ── DELETE /api/tips/:id (Teacher / Admin Delete) ──────────────
async function deleteTip(req, res) {
  try {
    const { id } = req.params;
    await prisma.tip.delete({ where: { id } });
    res.json({ message: 'TIPS topic deleted successfully' });
  } catch (error) {
    console.error('deleteTip error:', error);
    res.status(500).json({ error: 'Failed to delete TIPS topic' });
  }
}

module.exports = {
  getAllTips,
  getTipById,
  createTip,
  updateTip,
  deleteTip
};
