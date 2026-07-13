const prisma = require('../config/database');

/**
 * Get all classrooms
 */
async function getAllClassrooms(req, res) {
  try {
    const classrooms = await prisma.course.findMany({
      include: {
        lessons: true,
        _count: {
          select: { lessons: true }
        }
      }
    });

    res.status(200).json({ classrooms });
  } catch (error) {
    console.error('Get all classrooms error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get classroom by ID with lessons
 */
async function getClassroomById(req, res) {
  try {
    const { id } = req.params;

    const classroom = await prisma.course.findUnique({
      where: { id },
      include: { lessons: true }
    });

    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found' });
    }

    res.status(200).json({ classroom });
  } catch (error) {
    console.error('Get classroom by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Create a new classroom (teacher/admin only)
 */
async function createClassroom(req, res) {
  try {
    const { title, category, subject, isPaid } = req.body;

    if (!title || !category || !subject) {
      return res.status(400).json({ error: 'Title, category, and subject are required' });
    }

    const classroom = await prisma.course.create({
      data: {
        title,
        category,
        subject,
        isPaid: isPaid || false
      }
    });

    res.status(201).json({ classroom });
  } catch (error) {
    console.error('Create classroom error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Update classroom (teacher/admin only)
 */
async function updateClassroom(req, res) {
  try {
    const { id } = req.params;
    const { title, category, subject, isPaid } = req.body;

    const classroom = await prisma.course.update({
      where: { id },
      data: {
        title: title || undefined,
        category: category || undefined,
        subject: subject || undefined,
        isPaid: isPaid !== undefined ? isPaid : undefined
      },
      include: { lessons: true }
    });

    res.status(200).json({ classroom });
  } catch (error) {
    console.error('Update classroom error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get classroom video URL (signed URL for Cloudinary)
 */
async function getVideoUrl(req, res) {
  try {
    const { id } = req.params;

    const lesson = await prisma.lesson.findUnique({
      where: { id }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    // In production, this would sign the video URL with Cloudinary credentials
    // For now, return the playback ID
    res.status(200).json({
      videoUrl: lesson.playbackId,
      type: 'mux' // or cloudinary depending on your setup
    });
  } catch (error) {
    console.error('Get video URL error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Track/update user progress in a lesson
 */
async function updateProgress(req, res) {
  try {
    const { classroomId } = req.params;
    const { lessonId, progress } = req.body;
    const userId = req.user.id;

    if (!lessonId || progress === undefined) {
      return res.status(400).json({ error: 'Lesson ID and progress are required' });
    }

    // Store progress (you may need to add a Progress model to Prisma schema)
    // For now, just acknowledge
    res.status(200).json({
      message: 'Progress updated',
      data: {
        userId,
        classroomId,
        lessonId,
        progress
      }
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Delete classroom (admin only)
 */
async function deleteClassroom(req, res) {
  try {
    const { id } = req.params;

    await prisma.course.delete({ where: { id } });
    res.status(200).json({ message: 'Classroom deleted successfully' });
  } catch (error) {
    console.error('Delete classroom error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  getAllClassrooms,
  getClassroomById,
  createClassroom,
  updateClassroom,
  getVideoUrl,
  updateProgress,
  deleteClassroom
};
