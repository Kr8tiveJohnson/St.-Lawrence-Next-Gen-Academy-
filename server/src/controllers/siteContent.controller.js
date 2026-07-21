const prisma = require('../config/database');

/**
 * Get site content by key
 */
async function getSiteContent(req, res) {
  try {
    const { key } = req.params;
    
    const content = await prisma.siteContent.findUnique({
      where: { key }
    });

    if (!content) {
      return res.status(404).json({ error: 'Content not found' });
    }

    res.status(200).json({ key: content.key, value: JSON.parse(content.value), updatedAt: content.updatedAt });
  } catch (error) {
    console.error('Get site content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Update site content (admin only)
 */
async function updateSiteContent(req, res) {
  try {
    const { key } = req.params;
    const { value } = req.body;

    if (!value) {
      return res.status(400).json({ error: 'Value is required' });
    }

    const valueString = typeof value === 'string' ? value : JSON.stringify(value);

    const content = await prisma.siteContent.upsert({
      where: { key },
      update: { value: valueString },
      create: { key, value: valueString }
    });

    res.status(200).json({ key: content.key, value: JSON.parse(content.value), updatedAt: content.updatedAt });
  } catch (error) {
    console.error('Update site content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get all site content
 */
async function getAllSiteContent(req, res) {
  try {
    const contents = await prisma.siteContent.findMany();
    
    const mapped = contents.map(c => ({
      key: c.key,
      value: JSON.parse(c.value),
      updatedAt: c.updatedAt
    }));

    res.status(200).json({ contents: mapped });
  } catch (error) {
    console.error('Get all site content error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getSiteContent,
  updateSiteContent,
  getAllSiteContent
};
