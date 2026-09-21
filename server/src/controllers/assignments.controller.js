const prisma = require('../config/database');

// ── GET /api/assignments (Student & Class Assignments) ─────────
async function getAllAssignments(req, res) {
  try {
    const { targetClass, subject } = req.query;
    const where = {};

    if (targetClass && targetClass !== 'ALL') {
      where.targetClass = { contains: targetClass, mode: 'insensitive' };
    }
    if (subject && subject !== 'ALL') {
      where.subject = { equals: subject, mode: 'insensitive' };
    }

    const assignments = await prisma.assignment.findMany({
      where,
      include: {
        _count: { select: { submissions: true } },
        submissions: req.user?.id ? {
          where: { studentId: req.user.id },
          select: {
            id: true,
            status: true,
            score: true,
            feedback: true,
            submittedAt: true,
            submissionText: true,
            fileUrl: true
          }
        } : false
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ assignments });
  } catch (error) {
    console.error('getAllAssignments error:', error);
    res.status(500).json({ error: 'Failed to retrieve assignments' });
  }
}

// ── POST /api/assignments (Teacher / Admin Create) ─────────────
async function createAssignment(req, res) {
  try {
    const { title, subject, targetClass, description, fileUrl, dueDate } = req.body;

    if (!title || !subject || !targetClass || !description) {
      return res.status(400).json({ error: 'Please provide title, subject, targetClass, and description' });
    }

    const assignment = await prisma.assignment.create({
      data: {
        title,
        subject,
        targetClass,
        description,
        fileUrl: fileUrl || null,
        dueDate: dueDate ? new Date(dueDate) : null,
        teacherId: req.user?.id || 'admin'
      }
    });

    res.status(201).json({ message: 'Assignment published successfully', assignment });
  } catch (error) {
    console.error('createAssignment error:', error);
    res.status(500).json({ error: 'Failed to create assignment' });
  }
}

// ── POST /api/assignments/:id/submit (Student Submit) ──────────
async function submitAssignment(req, res) {
  try {
    const { id } = req.params;
    const { submissionText, fileUrl } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!submissionText && !fileUrl) {
      return res.status(400).json({ error: 'Please provide submission answers or upload a file' });
    }

    // Upsert submission
    const existing = await prisma.assignmentSubmission.findFirst({
      where: {
        assignmentId: id,
        studentId: req.user.id
      }
    });

    let submission;
    if (existing) {
      submission = await prisma.assignmentSubmission.update({
        where: { id: existing.id },
        data: {
          submissionText: submissionText || existing.submissionText,
          fileUrl: fileUrl || existing.fileUrl,
          status: 'SUBMITTED',
          submittedAt: new Date()
        }
      });
    } else {
      submission = await prisma.assignmentSubmission.create({
        data: {
          assignmentId: id,
          studentId: req.user.id,
          submissionText: submissionText || null,
          fileUrl: fileUrl || null,
          status: 'SUBMITTED'
        }
      });
    }

    res.json({ message: 'Assignment submitted successfully', submission });
  } catch (error) {
    console.error('submitAssignment error:', error);
    res.status(500).json({ error: 'Failed to submit assignment' });
  }
}

// ── GET /api/assignments/:id/submissions (Teacher View) ────────
async function getSubmissionsForAssignment(req, res) {
  try {
    const { id } = req.params;

    const assignment = await prisma.assignment.findUnique({
      where: { id },
      include: {
        submissions: {
          include: {
            student: {
              select: {
                id: true,
                email: true,
                profile: true
              }
            }
          },
          orderBy: { submittedAt: 'desc' }
        }
      }
    });

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json({ assignment, submissions: assignment.submissions });
  } catch (error) {
    console.error('getSubmissionsForAssignment error:', error);
    res.status(500).json({ error: 'Failed to retrieve assignment submissions' });
  }
}

// ── PUT /api/assignments/submissions/:id/grade (Teacher Grade) ──
async function gradeSubmission(req, res) {
  try {
    const { id } = req.params;
    const { score, feedback } = req.body;

    const submission = await prisma.assignmentSubmission.update({
      where: { id },
      data: {
        score: parseFloat(score),
        feedback: feedback || null,
        status: 'GRADED'
      }
    });

    res.json({ message: 'Submission successfully marked and graded', submission });
  } catch (error) {
    console.error('gradeSubmission error:', error);
    res.status(500).json({ error: 'Failed to grade submission' });
  }
}

module.exports = {
  getAllAssignments,
  createAssignment,
  submitAssignment,
  getSubmissionsForAssignment,
  gradeSubmission
};
