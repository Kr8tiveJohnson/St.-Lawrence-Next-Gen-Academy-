const prisma = require('../config/database');

// ── GET /api/resources (List & Filter Study Resources) ──────────
async function getAllResources(req, res) {
  try {
    const { subject, targetClass, resourceType, search } = req.query;
    const where = {};

    if (subject && subject !== 'ALL') {
      where.subject = { equals: subject, mode: 'insensitive' };
    }
    if (targetClass && targetClass !== 'ALL') {
      where.targetClass = { contains: targetClass, mode: 'insensitive' };
    }
    if (resourceType && resourceType !== 'ALL') {
      where.resourceType = resourceType;
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    const resources = await prisma.resource.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    res.json({ resources });
  } catch (error) {
    console.error('getAllResources error:', error);
    res.status(500).json({ error: 'Failed to retrieve learning resources' });
  }
}

// ── GET /api/resources/:id (Download / View Counter) ────────────
async function getResourceById(req, res) {
  try {
    const { id } = req.params;
    const resource = await prisma.resource.update({
      where: { id },
      data: { downloadsCount: { increment: 1 } }
    });

    res.json({ resource });
  } catch (error) {
    console.error('getResourceById error:', error);
    res.status(500).json({ error: 'Resource not found' });
  }
}

// ── POST /api/resources (Teacher / Admin Upload/Link) ───────────
async function createResource(req, res) {
  try {
    const { title, subject, targetClass, resourceType, description, fileUrl } = req.body;

    if (!title || !subject || !resourceType || !fileUrl) {
      return res.status(400).json({ error: 'Please provide title, subject, resourceType, and fileUrl' });
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        subject,
        targetClass: targetClass || 'GENERAL',
        resourceType,
        description: description || null,
        fileUrl,
        authorId: req.user?.id || null
      }
    });

    res.status(201).json({ message: 'Resource added successfully', resource });
  } catch (error) {
    console.error('createResource error:', error);
    res.status(500).json({ error: 'Failed to upload resource' });
  }
}

// ── PUT /api/resources/:id (Teacher / Admin Update) ────────────
async function updateResource(req, res) {
  try {
    const { id } = req.params;
    const { title, subject, targetClass, resourceType, description, fileUrl } = req.body;

    const data = {};
    if (title !== undefined) data.title = title;
    if (subject !== undefined) data.subject = subject;
    if (targetClass !== undefined) data.targetClass = targetClass;
    if (resourceType !== undefined) data.resourceType = resourceType;
    if (description !== undefined) data.description = description;
    if (fileUrl !== undefined) data.fileUrl = fileUrl;

    const resource = await prisma.resource.update({
      where: { id },
      data
    });

    res.json({ message: 'Resource updated successfully', resource });
  } catch (error) {
    console.error('updateResource error:', error);
    res.status(500).json({ error: 'Failed to update resource' });
  }
}

// ── DELETE /api/resources/:id (Teacher / Admin Delete) ──────────
async function deleteResource(req, res) {
  try {
    const { id } = req.params;
    await prisma.resource.delete({ where: { id } });
    res.json({ message: 'Resource removed successfully' });
  } catch (error) {
    console.error('deleteResource error:', error);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
}

module.exports = {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource
};
