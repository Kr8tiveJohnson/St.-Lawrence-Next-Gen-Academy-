const prisma = require('../config/database');

/**
 * Get all past questions with filtering
 */
async function getAllQuestions(req, res) {
  try {
    const { examType, subject, year } = req.query;

    const whereClause = {};
    if (examType) whereClause.examType = examType;
    if (subject) whereClause.subject = subject;
    if (year) whereClause.year = parseInt(year);

    const questions = await prisma.pastQuestion.findMany({
      where: whereClause,
      orderBy: { year: 'desc' }
    });

    res.status(200).json({ questions });
  } catch (error) {
    console.error('Get all questions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Search past questions
 */
async function searchQuestions(req, res) {
  try {
    const { q, examType, subject } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const questions = await prisma.pastQuestion.findMany({
      where: {
        AND: [
          {
            OR: [
              { questionText: { contains: q, mode: 'insensitive' } },
              { examType: { contains: q, mode: 'insensitive' } },
              { subject: { contains: q, mode: 'insensitive' } }
            ]
          },
          examType ? { examType } : {},
          subject ? { subject } : {}
        ]
      }
    });

    res.status(200).json({ questions });
  } catch (error) {
    console.error('Search questions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get question by ID
 */
async function getQuestionById(req, res) {
  try {
    const { id } = req.params;

    const question = await prisma.pastQuestion.findUnique({
      where: { id }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.status(200).json({ question });
  } catch (error) {
    console.error('Get question by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Bookmark a question
 */
async function bookmarkQuestion(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if question exists
    const question = await prisma.pastQuestion.findUnique({ where: { id } });
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    // Check if already bookmarked
    const existing = await prisma.bookmark.findUnique({
      where: {
        userId_pastQuestionId: { userId, pastQuestionId: id }
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Question already bookmarked' });
    }

    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        pastQuestionId: id
      }
    });

    res.status(201).json({ bookmark });
  } catch (error) {
    console.error('Bookmark question error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Remove bookmark
 */
async function removeBookmark(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await prisma.bookmark.deleteMany({
      where: {
        userId,
        pastQuestionId: id
      }
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Bookmark not found' });
    }

    res.status(200).json({ message: 'Bookmark removed' });
  } catch (error) {
    console.error('Remove bookmark error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get user's bookmarks
 */
async function getBookmarks(req, res) {
  try {
    const userId = req.user.id;

    const bookmarks = await prisma.bookmark.findMany({
      where: { userId },
      include: {
        pastQuestion: true
      }
    });

    res.status(200).json({ bookmarks });
  } catch (error) {
    console.error('Get bookmarks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Create a past question (admin only)
 */
async function createQuestion(req, res) {
  try {
    const { examType, subject, year, questionText, options, correctOption, isPaid } = req.body;

    if (!examType || !subject || !year || !questionText || !options || !correctOption) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const question = await prisma.pastQuestion.create({
      data: {
        examType,
        subject,
        year,
        questionText,
        options,
        correctOption,
        isPaid: isPaid || false
      }
    });

    res.status(201).json({ question });
  } catch (error) {
    console.error('Create question error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllQuestions,
  searchQuestions,
  getQuestionById,
  bookmarkQuestion,
  removeBookmark,
  getBookmarks,
  createQuestion
};
