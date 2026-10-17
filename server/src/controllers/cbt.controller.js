const prisma = require('../config/database');
const {
  normalizeText,
  validateQuestionPayload,
  parseCsv,
  mapCsvToQuestionObjects,
  processBatchImport
} = require('../services/cbtQuestion.service');
const { generateAiQuestions } = require('../services/cbtAiGenerator.service');

// ── GET /api/cbt/admin/stats (Comprehensive Real-time Database Metrics) ─────
async function getAdminStats(req, res) {
  try {
    const [
      total,
      jambCount,
      waecCount,
      necoCount,
      internalCount,
      approvedCount,
      pendingCount,
      draftCount,
      rejectedCount,
      archivedCount,
      publishedCount,
      recentImports,
      questionsBySubjectRaw
    ] = await Promise.all([
      prisma.cbtQuestion.count(),
      prisma.cbtQuestion.count({ where: { examType: 'JAMB' } }),
      prisma.cbtQuestion.count({ where: { examType: 'WAEC' } }),
      prisma.cbtQuestion.count({ where: { examType: 'NECO' } }),
      prisma.cbtQuestion.count({ where: { examType: 'INTERNAL' } }),
      prisma.cbtQuestion.count({ where: { status: 'APPROVED' } }),
      prisma.cbtQuestion.count({ where: { status: 'PENDING_REVIEW' } }),
      prisma.cbtQuestion.count({ where: { status: 'DRAFT' } }),
      prisma.cbtQuestion.count({ where: { status: 'REJECTED' } }),
      prisma.cbtQuestion.count({ where: { status: 'ARCHIVED' } }),
      prisma.cbtQuestion.count({ where: { isPublished: true, status: 'APPROVED' } }),
      prisma.cbtImportLog.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
      prisma.cbtQuestion.groupBy({
        by: ['subject'],
        _count: { id: true }
      })
    ]);

    const subjectBreakdown = {};
    questionsBySubjectRaw.forEach(item => {
      subjectBreakdown[item.subject] = item._count.id;
    });

    res.json({
      total,
      byExam: {
        JAMB: jambCount,
        WAEC: waecCount,
        NECO: necoCount,
        INTERNAL: internalCount
      },
      byStatus: {
        APPROVED: approvedCount,
        PENDING_REVIEW: pendingCount,
        DRAFT: draftCount,
        REJECTED: rejectedCount,
        ARCHIVED: archivedCount
      },
      publishedCount,
      subjectBreakdown,
      recentImports
    });
  } catch (error) {
    console.error('getAdminStats error:', error);
    res.status(500).json({ error: 'Failed to compute question bank metrics' });
  }
}

// ── GET /api/cbt/questions (Search, Filter, Paginate, and Role-Sanitize) ───
async function getQuestions(req, res) {
  try {
    const {
      examType,
      subject,
      targetClass,
      topic,
      difficulty,
      year,
      origin,
      status,
      isPublished,
      search,
      page = 1,
      limit = 20
    } = req.query;

    const isPrivileged = req.user && (req.user.role === 'TEACHER' || req.user.role === 'ADMIN' || req.user.isStandaloneAdmin);

    const where = {};

    if (examType && examType !== 'ALL') where.examType = examType;
    if (subject && subject !== 'ALL') where.subject = { equals: subject, mode: 'insensitive' };
    if (targetClass && targetClass !== 'ALL') where.targetClass = targetClass;
    if (topic && topic !== 'ALL') where.topic = { contains: topic, mode: 'insensitive' };
    if (difficulty && difficulty !== 'ALL') where.difficulty = difficulty.toUpperCase();
    if (year && year !== 'ALL') where.year = parseInt(year);
    if (origin && origin !== 'ALL') where.origin = origin.toUpperCase();

    // Workflow status & publication controls
    if (isPrivileged) {
      if (status && status !== 'ALL') where.status = status.toUpperCase();
      if (isPublished !== undefined && isPublished !== 'ALL') {
        where.isPublished = isPublished === 'true' || isPublished === true;
      }
    } else {
      // CRITICAL: Students only ever see APPROVED and PUBLISHED questions!
      where.status = 'APPROVED';
      where.isPublished = true;
    }

    if (search && search.trim()) {
      const q = search.trim();
      where.OR = [
        { questionText: { contains: q, mode: 'insensitive' } },
        { topic: { contains: q, mode: 'insensitive' } },
        { subject: { contains: q, mode: 'insensitive' } },
        { sourceName: { contains: q, mode: 'insensitive' } },
        { passageText: { contains: q, mode: 'insensitive' } }
      ];
    }

    const take = Math.min(parseInt(limit) || 20, 100);
    const skip = ((parseInt(page) || 1) - 1) * take;

    // Student projection strips correctOption & explanation to prevent scraping
    const select = isPrivileged
      ? undefined
      : {
          id: true,
          examType: true,
          subject: true,
          targetClass: true,
          topic: true,
          subTopic: true,
          year: true,
          difficulty: true,
          questionType: true,
          questionText: true,
          options: true,
          passageText: true,
          imageUrl: true,
          origin: true,
          sourceName: true,
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

// ── GET /api/cbt/questions/:id (Single Question Details for Admin) ─────────
async function getQuestionById(req, res) {
  try {
    const { id } = req.params;
    const question = await prisma.cbtQuestion.findUnique({
      where: { id }
    });

    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }

    res.json({ question });
  } catch (error) {
    console.error('getQuestionById error:', error);
    res.status(500).json({ error: 'Failed to retrieve question details' });
  }
}

// ── POST /api/cbt/questions (Admin / Teacher Manual Creation) ─────────────
async function createQuestion(req, res) {
  try {
    const data = { ...req.body };

    const validation = validateQuestionPayload(data);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors.join('; ') });
    }

    const normalized = normalizeText(data.questionText);
    data.normalizedText = normalized;

    // Duplicate check
    const existing = await prisma.cbtQuestion.findFirst({
      where: {
        examType: data.examType,
        subject: { equals: data.subject, mode: 'insensitive' },
        normalizedText: normalized
      }
    });

    if (existing) {
      return res.status(409).json({
        error: `A matching question already exists in ${data.examType} ${data.subject} (ID: ${existing.id}).`
      });
    }

    const question = await prisma.cbtQuestion.create({
      data: {
        examType: data.examType,
        subject: data.subject,
        targetClass: data.targetClass || (data.examType === 'JAMB' ? 'JAMB UTME' : 'SSS 3'),
        topic: data.topic,
        subTopic: data.subTopic || null,
        syllabusVersion: data.syllabusVersion || null,
        year: data.year ? parseInt(data.year) : null,
        difficulty: (data.difficulty || 'MEDIUM').toUpperCase(),
        questionType: (data.questionType || 'MULTIPLE_CHOICE').toUpperCase(),
        questionText: data.questionText.trim(),
        options: data.options,
        correctOption: data.correctOption ? data.correctOption.toUpperCase() : null,
        explanation: data.explanation || null,
        passageText: data.passageText || null,
        imageUrl: data.imageUrl || null,
        markingGuide: data.markingGuide || null,
        origin: (data.origin || 'ORIGINAL_PRACTICE').toUpperCase(),
        sourceName: data.sourceName || null,
        sourceUrl: data.sourceUrl || null,
        permissionStatus: data.permissionStatus || 'VERIFIED',
        status: data.status || 'APPROVED',
        isPublished: data.isPublished !== undefined ? Boolean(data.isPublished) : true,
        normalizedText: normalized,
        authorId: req.user?.id || null
      }
    });

    res.status(201).json({ message: 'Question created successfully', question });
  } catch (error) {
    console.error('createQuestion error:', error);
    res.status(500).json({ error: 'Failed to create question in database' });
  }
}

// ── PUT /api/cbt/questions/:id (Admin / Teacher Update) ───────────────────
async function updateQuestion(req, res) {
  try {
    const { id } = req.params;
    const data = { ...req.body };

    if (data.questionText) {
      data.normalizedText = normalizeText(data.questionText);
    }
    if (data.year) data.year = parseInt(data.year);
    if (data.correctOption) data.correctOption = data.correctOption.toUpperCase();
    if (data.difficulty) data.difficulty = data.difficulty.toUpperCase();
    if (data.status) data.status = data.status.toUpperCase();
    if (data.origin) data.origin = data.origin.toUpperCase();
    if (data.isPublished !== undefined) data.isPublished = Boolean(data.isPublished);

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

// ── DELETE /api/cbt/questions/:id (Safe Delete or Archive) ────────────────
async function deleteQuestion(req, res) {
  try {
    const { id } = req.params;
    const { soft } = req.query;

    if (soft === 'true') {
      await prisma.cbtQuestion.update({
        where: { id },
        data: { status: 'ARCHIVED', isPublished: false }
      });
      return res.json({ message: 'Question successfully archived (hidden from CBT tests)' });
    }

    await prisma.cbtQuestion.delete({ where: { id } });
    res.json({ message: 'Question deleted permanently' });
  } catch (error) {
    console.error('deleteQuestion error:', error);
    res.status(500).json({ error: 'Failed to delete question' });
  }
}

// ── POST /api/cbt/questions/bulk (Bulk Actions: Approve, Archive, Delete) ─
async function bulkActionQuestions(req, res) {
  try {
    const { ids, action } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Please provide an array of question IDs.' });
    }

    const reviewerName = req.user?.profile?.fullName || req.user?.email || 'Admin';

    switch (action) {
      case 'APPROVE':
        await prisma.cbtQuestion.updateMany({
          where: { id: { in: ids } },
          data: {
            status: 'APPROVED',
            isPublished: true,
            reviewedBy: reviewerName,
            reviewedAt: new Date()
          }
        });
        return res.json({ message: `Successfully approved and published ${ids.length} questions.` });

      case 'REJECT':
        await prisma.cbtQuestion.updateMany({
          where: { id: { in: ids } },
          data: {
            status: 'REJECTED',
            isPublished: false,
            reviewedBy: reviewerName,
            reviewedAt: new Date()
          }
        });
        return res.json({ message: `Marked ${ids.length} questions as Rejected.` });

      case 'ARCHIVE':
        await prisma.cbtQuestion.updateMany({
          where: { id: { in: ids } },
          data: {
            status: 'ARCHIVED',
            isPublished: false
          }
        });
        return res.json({ message: `Archived ${ids.length} questions.` });

      case 'PUBLISH':
        await prisma.cbtQuestion.updateMany({
          where: { id: { in: ids }, status: 'APPROVED' },
          data: { isPublished: true }
        });
        return res.json({ message: `Published eligible approved questions.` });

      case 'UNPUBLISH':
        await prisma.cbtQuestion.updateMany({
          where: { id: { in: ids } },
          data: { isPublished: false }
        });
        return res.json({ message: `Unpublished ${ids.length} questions.` });

      case 'DELETE':
        await prisma.cbtQuestion.deleteMany({
          where: { id: { in: ids } }
        });
        return res.json({ message: `Permanently deleted ${ids.length} questions.` });

      default:
        return res.status(400).json({ error: `Unknown bulk action: "${action}"` });
    }
  } catch (error) {
    console.error('bulkActionQuestions error:', error);
    res.status(500).json({ error: 'Failed to execute bulk action on questions' });
  }
}

// ── POST /api/cbt/questions/:id/review (Formal Approval / Review Workflow) ─
async function reviewQuestion(req, res) {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    const validStatuses = ['APPROVED', 'REJECTED', 'PENDING_REVIEW', 'ARCHIVED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status: ${status}` });
    }

    const reviewerName = req.user?.profile?.fullName || req.user?.email || 'Admin';

    const updated = await prisma.cbtQuestion.update({
      where: { id },
      data: {
        status,
        isPublished: status === 'APPROVED',
        reviewNotes: reviewNotes || null,
        reviewedBy: reviewerName,
        reviewedAt: new Date()
      }
    });

    res.json({ message: `Question status updated to ${status}`, question: updated });
  } catch (error) {
    console.error('reviewQuestion error:', error);
    res.status(500).json({ error: 'Failed to record question review decision' });
  }
}

// ── POST /api/cbt/questions/import (Bulk CSV/JSON Import with Preview/Validation) ───
async function importQuestions(req, res) {
  try {
    const { fileContent, fileType = 'CSV', fileName = 'upload.csv' } = req.body;

    if (!fileContent || typeof fileContent !== 'string') {
      return res.status(400).json({ error: 'File content must be provided as text string (CSV or JSON).' });
    }

    let records = [];

    if (fileType.toUpperCase() === 'JSON') {
      try {
        const parsed = JSON.parse(fileContent);
        if (!Array.isArray(parsed)) {
          return res.status(400).json({ error: 'JSON import must be an array of question objects.' });
        }
        records = parsed.map((item, idx) => ({ ...item, rowIndex: idx + 1 }));
      } catch (jsonErr) {
        return res.status(400).json({ error: 'Malformed JSON: ' + jsonErr.message });
      }
    } else {
      // Parse CSV
      const rows = parseCsv(fileContent);
      if (rows.length < 2) {
        return res.status(400).json({ error: 'CSV file is empty or missing headers.' });
      }
      records = mapCsvToQuestionObjects(rows);
    }

    const summary = await processBatchImport({
      records,
      fileName,
      fileType: fileType.toUpperCase(),
      importedBy: req.user?.email || req.user?.id || 'Admin'
    });

    res.status(200).json({
      success: true,
      message: `Batch import complete. ${summary.acceptedCount} accepted, ${summary.duplicateCount} duplicates skipped, ${summary.failedCount} invalid rows.`,
      summary
    });
  } catch (error) {
    console.error('importQuestions error:', error);
    res.status(500).json({ error: 'Internal error processing question batch import' });
  }
}

// ── GET /api/cbt/questions/import-template (Downloadable Standard Template) ──
function getImportTemplate(req, res) {
  const templateCsv = `Examination,Subject,Topic,Question Text,Option A,Option B,Option C,Option D,Option E,Correct Answer,Explanation,Difficulty,Examination Year,Question Origin,Source Name
JAMB,Mathematics,Algebra,Find the value of x if 2^(2x+1) = 32,1,2,3,4,,B,2^(2x+1) = 2^5 => 2x+1 = 5 => 2x = 4 => x = 2,MEDIUM,2023,PAST_QUESTION,JAMB Official UTME 2023
WAEC,English Language,Lexis & Structure,The accused was acquitted _____ the charges against him.,from,with,of,for,,C,Acquitted collocates with the preposition 'of'.,EASY,2022,PAST_QUESTION,WAEC SSCE June 2022
NECO,Physics,Mechanics,Calculate the work done when a force of 50 N moves a body through 4 m.,100 J,200 J,400 J,800 J,,B,Work = Force x Distance = 50 x 4 = 200 Joules,EASY,2021,PAST_QUESTION,NECO SSCE 2021
INTERNAL,Chemistry,Acids and Bases,What is the conjugate base of HSO4-?,SO4(2-),H2SO4,H3O+,OH-,,A,Loss of a proton from HSO4- leaves SO4(2-),MEDIUM,2025,ORIGINAL_PRACTICE,St. Lawrence Faculty Mock`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename="st_lawrence_cbt_question_template.csv"');
  res.status(200).send(templateCsv);
}

// ── GET /api/cbt/questions/import-history (Import Audit Logs) ──────────────
async function getImportHistory(req, res) {
  try {
    const logs = await prisma.cbtImportLog.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' }
    });
    res.json({ logs });
  } catch (error) {
    console.error('getImportHistory error:', error);
    res.status(500).json({ error: 'Failed to retrieve import audit logs' });
  }
}

// ── POST /api/cbt/questions/ai-generate (AI-Assisted Question Generator) ──
async function aiGenerate(req, res) {
  try {
    const {
      examType = 'JAMB',
      subject = 'Mathematics',
      topic = 'General',
      difficulty = 'MEDIUM',
      count = 3
    } = req.body;

    const result = await generateAiQuestions({
      examType,
      subject,
      topic,
      difficulty,
      count,
      authorId: req.user?.id || 'Admin'
    });

    res.json({
      success: true,
      message: `Generated ${result.savedCount} questions under ${examType} - ${subject} (${topic}). Questions saved as Pending Review.`,
      questions: result.questions
    });
  } catch (error) {
    console.error('aiGenerate error:', error);
    res.status(500).json({ error: 'Failed to generate AI questions' });
  }
}

// ── SUBJECTS & TOPICS CONFIGURATION ───────────────────────────────────────
async function getSubjects(req, res) {
  try {
    const subjects = await prisma.cbtSubject.findMany({
      where: { isActive: true },
      include: {
        topics: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { name: 'asc' }
    });

    // Also get real question counts per subject
    const counts = await prisma.cbtQuestion.groupBy({
      by: ['subject'],
      _count: { id: true }
    });
    const countMap = {};
    counts.forEach(c => { countMap[c.subject.toLowerCase()] = c._count.id; });

    const enriched = subjects.map(s => ({
      ...s,
      questionCount: countMap[s.name.toLowerCase()] || 0
    }));

    res.json({ subjects: enriched });
  } catch (error) {
    console.error('getSubjects error:', error);
    res.status(500).json({ error: 'Failed to fetch configurable CBT subjects' });
  }
}

async function createSubject(req, res) {
  try {
    const { name, code, icon, examTypes, description } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Subject name is required.' });
    }

    const created = await prisma.cbtSubject.create({
      data: {
        name: name.trim(),
        code: code ? code.trim().toUpperCase() : null,
        icon: icon || '📚',
        examTypes: examTypes || ['JAMB', 'WAEC', 'NECO', 'INTERNAL'],
        description: description || null
      }
    });

    res.status(201).json({ message: 'Subject created successfully', subject: created });
  } catch (error) {
    console.error('createSubject error:', error);
    res.status(500).json({ error: 'Failed to create subject' });
  }
}

async function createTopic(req, res) {
  try {
    const { subjectId } = req.params;
    const { name, syllabusVersion } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Topic name is required.' });
    }

    const topic = await prisma.cbtTopic.create({
      data: {
        subjectId,
        name: name.trim(),
        syllabusVersion: syllabusVersion || 'Current Syllabus'
      }
    });

    res.status(201).json({ message: 'Topic added successfully', topic });
  } catch (error) {
    console.error('createTopic error:', error);
    res.status(500).json({ error: 'Failed to add topic' });
  }
}

// ── POST /api/cbt/exam/start (Generates Timed Exam from DB) ─────────────────
async function startExam(req, res) {
  try {
    const {
      examType = 'JAMB',
      subject = 'Mathematics',
      questionCount = 20,
      durationMinutes = 20
    } = req.body;

    const where = {
      status: 'APPROVED',
      isPublished: true
    };
    if (examType && examType !== 'ALL') where.examType = examType;
    if (subject && subject !== 'ALL') where.subject = { equals: subject, mode: 'insensitive' };

    // Fetch candidate questions from database (correctOption & explanation strictly excluded)
    const pool = await prisma.cbtQuestion.findMany({
      where,
      select: {
        id: true,
        examType: true,
        subject: true,
        topic: true,
        year: true,
        difficulty: true,
        questionType: true,
        questionText: true,
        options: true,
        passageText: true,
        imageUrl: true
      }
    });

    if (pool.length === 0) {
      return res.status(404).json({
        error: `No approved questions found in database for ${examType} ${subject}. Please add and approve questions first.`
      });
    }

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

// ── POST /api/cbt/exam/submit (Auto-Grade, Explain & Record) ────────────────
async function submitExam(req, res) {
  try {
    const {
      examType = 'JAMB',
      subject = 'Mathematics',
      timeSpentSeconds = 0,
      answers = {}
    } = req.body;

    const questionIds = Object.keys(answers);
    if (questionIds.length === 0) {
      return res.status(400).json({ error: 'No answers provided for submission' });
    }

    const questions = await prisma.cbtQuestion.findMany({
      where: { id: { in: questionIds } }
    });

    let score = 0;
    const review = [];
    const attemptAnswersRecord = {};

    questions.forEach((q) => {
      const chosen = answers[q.id];
      const isCorrect = chosen && chosen.toUpperCase() === q.correctOption.toUpperCase();
      if (isCorrect) score += 1;

      attemptAnswersRecord[q.id] = {
        chosen: chosen || null,
        correct: q.correctOption,
        isCorrect
      };

      review.push({
        questionId: q.id,
        questionText: q.questionText,
        options: q.options,
        passageText: q.passageText,
        imageUrl: q.imageUrl,
        chosenOption: chosen || 'Unanswered',
        correctOption: q.correctOption,
        explanation: q.explanation || 'No detailed explanation provided for this question.',
        isCorrect
      });
    });

    const totalQuestions = questions.length;
    const percentage = totalQuestions > 0 ? parseFloat(((score / totalQuestions) * 100).toFixed(2)) : 0;

    let attemptRecord = null;
    if (req.user && req.user.id) {
      attemptRecord = await prisma.cbtAttempt.create({
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
    }

    res.json({
      attemptId: attemptRecord ? attemptRecord.id : null,
      examType,
      subject,
      score,
      totalQuestions,
      percentage,
      timeSpentSeconds,
      correctCount: score,
      wrongCount: totalQuestions - score,
      review
    });
  } catch (error) {
    console.error('submitExam error:', error);
    res.status(500).json({ error: 'Failed to grade CBT examination' });
  }
}

// ── GET /api/cbt/attempts/me (Student Test History) ─────────────────────────
async function getMyAttempts(req, res) {
  try {
    const attempts = await prisma.cbtAttempt.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    res.json({ attempts });
  } catch (error) {
    console.error('getMyAttempts error:', error);
    res.status(500).json({ error: 'Failed to fetch test history' });
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

    const matchedProfiles = await prisma.profile.findMany({
      where: {
        OR: [
          { surname: { equals: cleanSurname, mode: 'insensitive' } },
          { fullName: { contains: cleanSurname, mode: 'insensitive' } }
        ]
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

    const candidates = matchedProfiles.filter(p => {
      if (p.surname && p.surname.trim().toLowerCase() === cleanSurname) return true;
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
  getAdminStats,
  getQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  bulkActionQuestions,
  reviewQuestion,
  importQuestions,
  getImportTemplate,
  getImportHistory,
  aiGenerate,
  getSubjects,
  createSubject,
  createTopic,
  startExam,
  submitExam,
  getMyAttempts,
  verifyCandidate
};
