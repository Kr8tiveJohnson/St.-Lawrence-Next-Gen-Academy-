const prisma = require('../config/database');

/**
 * Get all news articles (public)
 */
async function getAllNews(req, res) {
  try {
    const news = await prisma.news.findMany({
      orderBy: { date: 'desc' }
    });

    res.status(200).json({ news });
  } catch (error) {
    console.error('Get all news error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get news by ID (public)
 */
async function getNewsById(req, res) {
  try {
    const { id } = req.params;

    const news = await prisma.news.findUnique({
      where: { id }
    });

    if (!news) {
      return res.status(404).json({ error: 'News not found' });
    }

    res.status(200).json({ news });
  } catch (error) {
    console.error('Get news by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Create news article (admin only)
 */
async function createNews(req, res) {
  try {
    const { title, tag, summary, details, imageUrl } = req.body;

    if (!title || !summary || !details) {
      return res.status(400).json({ error: 'Title, summary, and details are required' });
    }

    const news = await prisma.news.create({
      data: {
        title,
        tag: tag || 'general',
        summary,
        details,
        imageUrl: imageUrl || null
      }
    });

    res.status(201).json({ news });
  } catch (error) {
    console.error('Create news error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Update news article (admin only)
 */
async function updateNews(req, res) {
  try {
    const { id } = req.params;
    const { title, tag, summary, details, imageUrl } = req.body;

    const news = await prisma.news.update({
      where: { id },
      data: {
        title: title || undefined,
        tag: tag || undefined,
        summary: summary || undefined,
        details: details || undefined,
        imageUrl: imageUrl !== undefined ? imageUrl : undefined
      }
    });

    res.status(200).json({ news });
  } catch (error) {
    console.error('Update news error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Delete news article (admin only)
 */
async function deleteNews(req, res) {
  try {
    const { id } = req.params;

    await prisma.news.delete({ where: { id } });
    res.status(200).json({ message: 'News deleted successfully' });
  } catch (error) {
    console.error('Delete news error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get hall of fame entries
 */
async function getHallOfFame(req, res) {
  try {
    // Hall of fame could be filtered news items with a specific tag
    const hallOfFame = await prisma.news.findMany({
      where: { tag: 'hall-of-fame' },
      orderBy: { date: 'desc' }
    });

    res.status(200).json({ entries: hallOfFame });
  } catch (error) {
    console.error('Get hall of fame error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Add hall of fame entry (admin only)
 */
async function addHallOfFameEntry(req, res) {
  try {
    const { title, summary, details, imageUrl } = req.body;

    if (!title || !summary) {
      return res.status(400).json({ error: 'Title and summary are required' });
    }

    const entry = await prisma.news.create({
      data: {
        title,
        tag: 'hall-of-fame',
        summary,
        details: details || summary,
        imageUrl: imageUrl || null
      }
    });

    res.status(201).json({ entry });
  } catch (error) {
    console.error('Add hall of fame entry error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  getHallOfFame,
  addHallOfFameEntry
};
