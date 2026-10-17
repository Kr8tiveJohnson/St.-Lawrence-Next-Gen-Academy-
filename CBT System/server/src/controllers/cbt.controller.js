const prisma = require('../config/database');

// ── GET /api/cbt/questions (Paginated & Filtered, Sanitized for Students/Public) ───
async function getQuestions(req, res) {
  try {
    const {
      examType,
      subject,
      targetClass,
      topic,
      difficulty,
      year,
      search,
      page = 1,
      limit = 20
    } = req.query;

    const where = {};
    if (examType && examType !== 'ALL') where.examType = examType;
    if (subject && subject !== 'ALL') where.subject = { equals: subject, mode: 'insensitive' };
    if (targetClass && targetClass !== 'ALL') where.targetClass = targetClass;
    if (topic) where.topic = { contains: topic, mode: 'insensitive' };
    if (difficulty && difficulty !== 'ALL') where.difficulty = difficulty;
    if (year) where.year = parseInt(year);
    if (search) {
      where.OR = [
        { questionText: { contains: search, mode: 'insensitive' } },
        { topic: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ];
    }

    const take = Math.min(parseInt(limit) || 20, 100);
    const skip = ((parseInt(page) || 1) - 1) * take;

    // Determine if requester is privileged (Teacher or Admin)
    const isPrivileged = req.user && (req.user.role === 'TEACHER' || req.user.role === 'ADMIN' || req.user.isStandaloneAdmin);

    // If privileged, return all fields including correctOption & explanation.
    // If student/public, strip correctOption and explanation to prevent scraping.
    const select = isPrivileged
      ? undefined
      : {
          id: true,
          examType: true,
          subject: true,
          targetClass: true,
          topic: true,
          year: true,
          difficulty: true,
          questionText: true,
          options: true,
          createdAt: true
        };

    const [questions, total] = await Promise.all([
      prisma.cbtQuestion.findMany({
        where,
        take,
        skip,
        select,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.cbtQuestion.count({ where })
    ]);

    res.json({
      questions,
      total,
      page: parseInt(page) || 1,
      totalPages: Math.ceil(total / take)
    });
  } catch (error) {
    console.error('getQuestions error:', error);
    res.status(500).json({ error: 'Failed to retrieve questions from question bank' });
  }
}

// ── POST /api/cbt/exam/start (Generates Timed Exam from DB) ────
async function startExam(req, res) {
  try {
    const {
      examType = 'JAMB',
      subject = 'Mathematics',
      questionCount = 20,
      durationMinutes = 20
    } = req.body;

    const where = {};
    if (examType && examType !== 'ALL') where.examType = examType;
    if (subject && subject !== 'ALL') where.subject = { equals: subject, mode: 'insensitive' };

    // Fetch candidate questions from database (correctOption deliberately excluded)
    const pool = await prisma.cbtQuestion.findMany({
      where,
      select: {
        id: true,
        examType: true,
        subject: true,
        topic: true,
        year: true,
        difficulty: true,
        questionText: true,
        options: true
      }
    });

    if (pool.length === 0) {
      return res.status(404).json({
        error: `No questions found in database for ${examType} ${subject}. Please seed or add questions first.`
      });
    }

    // Shuffle and pick desired count
    const count = Math.min(parseInt(questionCount) || 20, pool.length);
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    const selectedQuestions = shuffled.slice(0, count);

    res.json({
      examType,
      subject,
      totalQuestions: selectedQuestions.length,
      durationMinutes: parseInt(durationMinutes) || 20,
      questions: selectedQuestions
    });
  } catch (error) {
    console.error('startExam error:', error);
    res.status(500).json({ error: 'Failed to generate CBT examination set' });
  }
}

// ── POST /api/cbt/exam/submit (Auto-Grade, Explain & Record) ───
async function submitExam(req, res) {
  try {
    const {
      examType = 'JAMB',
      subject = 'Mathematics',
      timeSpentSeconds = 0,
      answers = {} // { [questionId]: chosenOption }
    } = req.body;

    const questionIds = Object.keys(answers);
    if (questionIds.length === 0) {
      return res.status(400).json({ error: 'No answers provided for submission' });
    }

    // Retrieve actual questions from database with correct answers & explanations
    const questions = await prisma.cbtQuestion.findMany({
      where: { id: { in: questionIds } }
    });

    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;
    const review = [];
    const attemptAnswersRecord = {};

    questions.forEach((q) => {
      const chosen = answers[q.id] || null;
      const isCorrect = chosen && chosen.toUpperCase() === q.correctOption.toUpperCase();

      if (!chosen) {
        unansweredCount++;
      } else if (isCorrect) {
        correctCount++;
        score++;
      } else {
        wrongCount++;
      }

      attemptAnswersRecord[q.id] = {
        chosen,
        correct: q.correctOption,
        isCorrect
      };

      review.push({
        id: q.id,
        questionText: q.questionText,
        options: q.options,
        chosenOption: chosen,
        correctOption: q.correctOption,
        isCorrect,
        topic: q.topic,
        explanation: q.explanation || 'No detailed explanation provided for this question.'
      });
    });

    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? parseFloat(((score / totalQuestions) * 100).toFixed(1)) : 0;

    // Save attempt if user is authenticated
    let attemptId = null;
    if (req.user && req.user.id && req.user.id !== 'admin') {
      try {
        const savedAttempt = await prisma.cbtAttempt.create({
          data: {
            userId: req.user.id,
            examType,
            subject,
            totalQuestions,
            score,
            percentage,
            timeSpentSeconds: parseInt(timeSpentSeconds) || 0,
            answers: attemptAnswersRecord
          }
        });
        attemptId = savedAttempt.id;
      } catch (saveErr) {
        console.warn('Could not save user attempt record to DB (User might not exist in standalone mode):', saveErr.message);
      }
    }

    res.json({
      attemptId,
      examType,
      subject,
      totalQuestions,
      score,
      percentage,
      timeSpentSeconds: parseInt(timeSpentSeconds) || 0,
      correctCount,
      wrongCount,
      unansweredCount,
      review
    });
  } catch (error) {
    console.error('submitExam error:', error);
    res.status(500).json({ error: 'Failed to grade examination' });
  }
}

// ── GET /api/cbt/attempts/me (User's CBT History) ──────────────
async function getMyAttempts(req, res) {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const attempts = await prisma.cbtAttempt.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json({ attempts });
  } catch (error) {
    console.error('getMyAttempts error:', error);
    res.status(500).json({ error: 'Failed to fetch exam history' });
  }
}

// ── POST /api/cbt/questions (Admin / Teacher Create) ───────────
async function createQuestion(req, res) {
  try {
    const {
      examType,
      subject,
      targetClass,
      topic,
      year,
      difficulty,
      questionText,
      options,
      correctOption,
      explanation
    } = req.body;

    if (!examType || !subject || !topic || !questionText || !options || !correctOption) {
      return res.status(400).json({ error: 'Please provide all required fields: examType, subject, topic, questionText, options, and correctOption' });
    }

    const question = await prisma.cbtQuestion.create({
      data: {
        examType,
        subject,
        targetClass: targetClass || 'GENERAL',
        topic,
        year: year ? parseInt(year) : null,
        difficulty: difficulty || 'MEDIUM',
        questionText,
        options,
        correctOption: correctOption.toUpperCase(),
        explanation: explanation || null,
        authorId: req.user?.id || null
      }
    });

    res.status(201).json({ message: 'Question successfully added to question bank', question });
  } catch (error) {
    console.error('createQuestion error:', error);
    res.status(500).json({ error: 'Failed to create question' });
  }
}

// ── PUT /api/cbt/questions/:id (Admin / Teacher Update) ────────
async function updateQuestion(req, res) {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (data.year) data.year = parseInt(data.year);
    if (data.correctOption) data.correctOption = data.correctOption.toUpperCase();

    const updated = await prisma.cbtQuestion.update({
      where: { id },
      data
    });

    res.json({ message: 'Question updated successfully', question: updated });
  } catch (error) {
    console.error('updateQuestion error:', error);
    res.status(500).json({ error: 'Failed to update question' });
  }
}

// ── DELETE /api/cbt/questions/:id (Admin / Teacher Delete) ─────
async function deleteQuestion(req, res) {
  try {
    const { id } = req.params;
    await prisma.cbtQuestion.delete({ where: { id } });
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('deleteQuestion error:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
}

// ── POST /api/cbt/verify-candidate (Verify Student Candidate by Surname) ────
async function verifyCandidate(req, res) {
  try {
    const { surname, email } = req.body;
    if (!surname || typeof surname !== 'string' || !surname.trim()) {
      return res.status(400).json({ error: 'Please enter your Surname to sign in to the CBT Examination System.' });
    }

    const cleanSurname = surname.trim().toLowerCase();

    // Query profiles where fullName contains the surname
    const matchedProfiles = await prisma.profile.findMany({
      where: {
        fullName: { contains: cleanSurname, mode: 'insensitive' }
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            tier: true,
            createdAt: true
          }
        }
      }
    });

    // Validate that surname actually matches one of the word tokens in fullName
    const candidates = matchedProfiles.filter(p => {
      if (!p.fullName) return false;
      const parts = p.fullName.toLowerCase().split(/\s+/).map(s => s.replace(/[^a-z0-9]/g, ''));
      const target = cleanSurname.replace(/[^a-z0-9]/g, '');
      return parts.includes(target) || p.fullName.toLowerCase().includes(target);
    });

    if (candidates.length === 0) {
      return res.status(404).json({
        error: `No registered student account was found with the surname "${surname.trim()}". You must be an enrolled student on the St. Lawrence Next Gen Academy platform to take this CBT exam.`
      });
    }

    // If email provided or multiple matches, pick best match
    let selected = candidates[0];
    if (email && candidates.length > 1) {
      const byEmail = candidates.find(c => c.user?.email.toLowerCase() === email.trim().toLowerCase());
      if (byEmail) selected = byEmail;
    }

    const { generateToken } = require('../utils/tokenHelper');
    const token = generateToken({
      id: selected.user.id,
      email: selected.user.email,
      role: selected.user.role,
      tier: selected.user.tier
    });

    res.json({
      success: true,
      token,
      user: {
        id: selected.user.id,
        email: selected.user.email,
        role: selected.user.role,
        tier: selected.user.tier,
        profile: {
          id: selected.id,
          fullName: selected.fullName,
          surname: surname.trim(),
          phone: selected.phone,
          avatarUrl: selected.avatarUrl,
          targetClass: selected.targetClass || 'Senior Secondary (SS3)',
          selectedSubjects: selected.selectedSubjects || [
            'Mathematics',
            'English Language',
            'Physics',
            'Chemistry',
            'Biology'
          ]
        }
      }
    });
  } catch (error) {
    console.error('verifyCandidate error:', error);
    res.status(500).json({ error: 'Failed to verify candidate surname. Please try again.' });
  }
}

module.exports = {
  getQuestions,
  startExam,
  submitExam,
  getMyAttempts,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  verifyCandidate
};
