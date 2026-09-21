const prisma = require('../config/database');

// ── GET /api/progress/me (Student Progress Breakdown) ──────────
async function getMyProgress(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const userId = req.user.id;

    // Fetch user's CBT attempts
    const attempts = await prisma.cbtAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    // Fetch user's completed lessons
    const completedProgress = await prisma.lessonProgress.findMany({
      where: { userId, completed: true },
      include: {
        lesson: {
          include: {
            course: true
          }
        }
      }
    });

    // Fetch all courses and total lessons
    const courses = await prisma.course.findMany({
      include: {
        _count: { select: { lessons: true } }
      }
    });

    // Compute CBT statistics per subject
    const subjectStats = {};
    attempts.forEach((att) => {
      const subj = att.subject || 'General';
      if (!subjectStats[subj]) {
        subjectStats[subj] = {
          subject: subj,
          testsTaken: 0,
          totalScore: 0,
          totalQuestions: 0,
          percentageSum: 0,
          bestScore: 0
        };
      }
      subjectStats[subj].testsTaken += 1;
      subjectStats[subj].totalScore += att.score;
      subjectStats[subj].totalQuestions += att.totalQuestions;
      subjectStats[subj].percentageSum += att.percentage;
      if (att.percentage > subjectStats[subj].bestScore) {
        subjectStats[subj].bestScore = att.percentage;
      }
    });

    // Compute course / lesson completion per subject
    const lessonCompletionStats = {};
    courses.forEach((c) => {
      const subj = c.subject || 'General';
      if (!lessonCompletionStats[subj]) {
        lessonCompletionStats[subj] = { totalLessons: 0, completedLessons: 0 };
      }
      lessonCompletionStats[subj].totalLessons += c._count.lessons;
    });

    completedProgress.forEach((p) => {
      const subj = p.lesson?.course?.subject || 'General';
      if (!lessonCompletionStats[subj]) {
        lessonCompletionStats[subj] = { totalLessons: 0, completedLessons: 0 };
      }
      lessonCompletionStats[subj].completedLessons += 1;
    });

    // Merge into combined subject progress metrics
    const subjects = Array.from(
      new Set([...Object.keys(subjectStats), ...Object.keys(lessonCompletionStats)])
    );

    const subjectProgressList = subjects.map((subj) => {
      const cbt = subjectStats[subj];
      const lesson = lessonCompletionStats[subj];

      const avgCbtScore = cbt && cbt.testsTaken > 0 ? parseFloat((cbt.percentageSum / cbt.testsTaken).toFixed(1)) : null;
      const lessonPercent = lesson && lesson.totalLessons > 0 ? parseFloat(((lesson.completedLessons / lesson.totalLessons) * 100).toFixed(1)) : 0;

      // Overall mastery calculation
      let masteryPercent = 0;
      if (avgCbtScore !== null && lesson && lesson.totalLessons > 0) {
        masteryPercent = Math.round(avgCbtScore * 0.6 + lessonPercent * 0.4);
      } else if (avgCbtScore !== null) {
        masteryPercent = Math.round(avgCbtScore);
      } else {
        masteryPercent = Math.round(lessonPercent);
      }

      return {
        subject: subj,
        masteryPercent,
        avgCbtScore: avgCbtScore !== null ? avgCbtScore : 'No tests taken',
        testsTaken: cbt ? cbt.testsTaken : 0,
        completedLessons: lesson ? lesson.completedLessons : 0,
        totalLessons: lesson ? lesson.totalLessons : 0,
        lessonPercent
      };
    });

    // Identify Strong vs Weak subjects
    const strongSubjects = subjectProgressList
      .filter((s) => s.masteryPercent >= 65 || (typeof s.avgCbtScore === 'number' && s.avgCbtScore >= 65))
      .map((s) => s.subject);

    const weakSubjects = subjectProgressList
      .filter((s) => s.masteryPercent < 60 || (typeof s.avgCbtScore === 'number' && s.avgCbtScore < 60))
      .map((s) => s.subject);

    // Fetch targeted recommendations from database matching weak subjects
    const targetSubjects = weakSubjects.length > 0 ? weakSubjects : ['Mathematics', 'English Language', 'Physics'];

    const [recommendedTips, recommendedResources] = await Promise.all([
      prisma.tip.findMany({
        where: {
          subject: { in: targetSubjects, mode: 'insensitive' }
        },
        take: 4
      }),
      prisma.resource.findMany({
        where: {
          subject: { in: targetSubjects, mode: 'insensitive' }
        },
        take: 4
      })
    ]);

    res.json({
      totalTestsTaken: attempts.length,
      totalCompletedLessons: completedProgress.length,
      subjectProgress: subjectProgressList,
      strongSubjects,
      weakSubjects,
      recommendedTips,
      recommendedResources
    });
  } catch (error) {
    console.error('getMyProgress error:', error);
    res.status(500).json({ error: 'Failed to calculate learning progress' });
  }
}

// ── POST /api/progress/lessons/:lessonId/toggle ─────────────────
async function toggleLessonProgress(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { lessonId } = req.params;
    const userId = req.user.id;

    const existing = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: { userId, lessonId }
      }
    });

    if (existing) {
      await prisma.lessonProgress.delete({
        where: { id: existing.id }
      });
      return res.json({ completed: false, message: 'Lesson marked as uncompleted' });
    } else {
      await prisma.lessonProgress.create({
        data: { userId, lessonId, completed: true }
      });
      return res.json({ completed: true, message: 'Lesson marked as completed! 🎉' });
    }
  } catch (error) {
    console.error('toggleLessonProgress error:', error);
    res.status(500).json({ error: 'Failed to update lesson progress' });
  }
}

module.exports = {
  getMyProgress,
  toggleLessonProgress
};
