const prisma = require('../config/database');

/**
 * Normalize question text for fast and reliable duplicate detection.
 * Strips punctuation, excess spaces, and lowercases.
 */
function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text
    .toLowerCase()
    .replace(/[^\w\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Validate a question payload according to Nigerian CBT standards.
 */
function validateQuestionPayload(data) {
  const errors = [];

  const validExamTypes = ['JAMB', 'WAEC', 'NECO', 'INTERNAL'];
  if (!data.examType || !validExamTypes.includes(data.examType.toUpperCase())) {
    errors.push(`Invalid examType: "${data.examType}". Must be one of: ${validExamTypes.join(', ')}.`);
  }

  if (!data.subject || typeof data.subject !== 'string' || !data.subject.trim()) {
    errors.push('Subject is required.');
  }

  if (!data.topic || typeof data.topic !== 'string' || !data.topic.trim()) {
    errors.push('Topic is required.');
  }

  if (!data.questionText || typeof data.questionText !== 'string' || !data.questionText.trim()) {
    errors.push('Question text is required.');
  }

  const qType = (data.questionType || 'MULTIPLE_CHOICE').toUpperCase();
  if (qType === 'MULTIPLE_CHOICE') {
    if (!Array.isArray(data.options) || data.options.length < 2) {
      errors.push('Multiple-choice questions require at least 2 options (A-D or A-E).');
    } else {
      const validIds = data.options.map(o => (o.id || '').toUpperCase());
      const hasEmpty = data.options.some(o => !o.text || !o.text.toString().trim());
      if (hasEmpty) {
        errors.push('All answer options must contain non-empty text.');
      }
      if (!data.correctOption || !validIds.includes(data.correctOption.toUpperCase())) {
        errors.push(`Correct option "${data.correctOption}" must match one of the defined option IDs (${validIds.join(', ')}).`);
      }
    }
  }

  const validDifficulties = ['EASY', 'MEDIUM', 'HARD'];
  if (data.difficulty && !validDifficulties.includes(data.difficulty.toUpperCase())) {
    errors.push(`Invalid difficulty: "${data.difficulty}". Must be EASY, MEDIUM, or HARD.`);
  }

  const validStatuses = ['DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'ARCHIVED'];
  if (data.status && !validStatuses.includes(data.status.toUpperCase())) {
    errors.push(`Invalid status: "${data.status}". Must be one of: ${validStatuses.join(', ')}.`);
  }

  const validOrigins = ['PAST_QUESTION', 'ORIGINAL_PRACTICE', 'AI_GENERATED'];
  if (data.origin && !validOrigins.includes(data.origin.toUpperCase())) {
    errors.push(`Invalid origin: "${data.origin}". Must be PAST_QUESTION, ORIGINAL_PRACTICE, or AI_GENERATED.`);
  }

  // If marked as official past question, year should be validated
  if (data.origin === 'PAST_QUESTION' && data.year) {
    const yr = parseInt(data.year);
    const curYear = new Date().getFullYear();
    if (isNaN(yr) || yr < 1970 || yr > curYear) {
      errors.push(`Verified past question year must be between 1970 and ${curYear}.`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Robust CSV parser that handles quotes, escaped quotes, multiline values, and commas.
 */
function parseCsv(csvText) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (insideQuotes) {
      if (char === '"' && nextChar === '"') {
        currentField += '"';
        i++; // skip escaped quote
      } else if (char === '"') {
        insideQuotes = false;
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\r') {
        // skip \r
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        if (currentRow.some(cell => cell.length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(cell => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

/**
 * Map CSV rows to standardized question objects based on header keys.
 */
function mapCsvToQuestionObjects(rows) {
  if (rows.length < 2) return [];

  const rawHeaders = rows[0].map(h => h.toLowerCase().replace(/[^a-z0-9]/g, ''));
  const headerMap = {};

  rawHeaders.forEach((h, idx) => {
    if (h.includes('exam')) headerMap.examType = idx;
    else if (h.includes('subject')) headerMap.subject = idx;
    else if (h.includes('topic')) headerMap.topic = idx;
    else if (h.includes('subtopic')) headerMap.subTopic = idx;
    else if (h.includes('question') && !h.includes('type')) headerMap.questionText = idx;
    else if (h === 'optiona' || h === 'a') headerMap.optionA = idx;
    else if (h === 'optionb' || h === 'b') headerMap.optionB = idx;
    else if (h === 'optionc' || h === 'c') headerMap.optionC = idx;
    else if (h === 'optiond' || h === 'd') headerMap.optionD = idx;
    else if (h === 'optione' || h === 'e') headerMap.optionE = idx;
    else if (h.includes('answer') || h.includes('correct')) headerMap.correctOption = idx;
    else if (h.includes('explanation') || h.includes('solution')) headerMap.explanation = idx;
    else if (h.includes('diff')) headerMap.difficulty = idx;
    else if (h.includes('year')) headerMap.year = idx;
    else if (h.includes('origin')) headerMap.origin = idx;
    else if (h.includes('source')) headerMap.sourceName = idx;
    else if (h.includes('passage')) headerMap.passageText = idx;
    else if (h.includes('image')) headerMap.imageUrl = idx;
    else if (h.includes('marking')) headerMap.markingGuide = idx;
  });

  const parsedItems = [];

  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    const getVal = (idx) => (idx !== undefined && row[idx] !== undefined ? row[idx].trim() : '');

    const options = [
      { id: 'A', text: getVal(headerMap.optionA) },
      { id: 'B', text: getVal(headerMap.optionB) },
      { id: 'C', text: getVal(headerMap.optionC) },
      { id: 'D', text: getVal(headerMap.optionD) }
    ];

    const optE = getVal(headerMap.optionE);
    if (optE) {
      options.push({ id: 'E', text: optE });
    }

    const item = {
      rowIndex: r + 1,
      examType: getVal(headerMap.examType) || 'JAMB',
      subject: getVal(headerMap.subject) || 'General',
      topic: getVal(headerMap.topic) || 'General',
      subTopic: getVal(headerMap.subTopic) || null,
      questionText: getVal(headerMap.questionText),
      options: options.filter(o => o.text.length > 0),
      correctOption: (getVal(headerMap.correctOption) || 'A').toUpperCase().charAt(0),
      explanation: getVal(headerMap.explanation) || null,
      difficulty: (getVal(headerMap.difficulty) || 'MEDIUM').toUpperCase(),
      year: getVal(headerMap.year) ? parseInt(getVal(headerMap.year)) : null,
      origin: (getVal(headerMap.origin) || 'PRACTICE_QUESTION').toUpperCase(),
      sourceName: getVal(headerMap.sourceName) || null,
      passageText: getVal(headerMap.passageText) || null,
      imageUrl: getVal(headerMap.imageUrl) || null,
      markingGuide: getVal(headerMap.markingGuide) || null,
      status: 'PENDING_REVIEW', // Rule: Never automatically publish an imported question
      isPublished: false
    };

    parsedItems.push(item);
  }

  return parsedItems;
}

/**
 * Process a batch of question records, detecting duplicates, validating, and saving.
 */
async function processBatchImport({ records, fileName, fileType, importedBy }) {
  let acceptedCount = 0;
  let skippedCount = 0;
  let duplicateCount = 0;
  let failedCount = 0;
  const errors = [];
  const validToInsert = [];

  for (const item of records) {
    const rowNum = item.rowIndex || 0;

    // 1. Validate structure
    const validation = validateQuestionPayload(item);
    if (!validation.isValid) {
      failedCount++;
      errors.push({
        row: rowNum,
        error: validation.errors.join(' | '),
        questionSnippet: (item.questionText || '').slice(0, 80)
      });
      continue;
    }

    // 2. Duplicate Detection via normalized text
    const normalized = normalizeText(item.questionText);
    item.normalizedText = normalized;

    // Check against existing database questions
    const existing = await prisma.cbtQuestion.findFirst({
      where: {
        examType: item.examType,
        subject: { equals: item.subject, mode: 'insensitive' },
        normalizedText: normalized
      },
      select: { id: true, questionText: true }
    });

    if (existing) {
      duplicateCount++;
      errors.push({
        row: rowNum,
        error: `Duplicate question detected in ${item.examType} - ${item.subject} (matches ID: ${existing.id})`,
        questionSnippet: item.questionText.slice(0, 80),
        isDuplicate: true
      });
      continue;
    }

    // Check duplicate within the same batch
    const inBatchDup = validToInsert.find(v => v.normalizedText === normalized && v.examType === item.examType && v.subject === item.subject);
    if (inBatchDup) {
      duplicateCount++;
      errors.push({
        row: rowNum,
        error: `Duplicate question within the same import file.`,
        questionSnippet: item.questionText.slice(0, 80),
        isDuplicate: true
      });
      continue;
    }

    // 3. Prepare for insertion
    validToInsert.push({
      examType: item.examType,
      subject: item.subject,
      targetClass: item.targetClass || (item.examType === 'JAMB' ? 'JAMB UTME' : 'SSS 3'),
      topic: item.topic,
      subTopic: item.subTopic || null,
      syllabusVersion: item.syllabusVersion || null,
      year: item.year ? parseInt(item.year) : null,
      difficulty: item.difficulty || 'MEDIUM',
      questionType: item.questionType || 'MULTIPLE_CHOICE',
      questionText: item.questionText,
      options: item.options,
      correctOption: item.correctOption,
      explanation: item.explanation || null,
      passageText: item.passageText || null,
      imageUrl: item.imageUrl || null,
      markingGuide: item.markingGuide || null,
      origin: item.origin || 'PRACTICE_QUESTION',
      sourceName: item.sourceName || null,
      sourceUrl: item.sourceUrl || null,
      permissionStatus: item.permissionStatus || 'VERIFIED',
      status: 'PENDING_REVIEW', // Stored as Pending Review draft
      isPublished: false,
      normalizedText: normalized,
      authorId: importedBy || null
    });
  }

  // Batch insert valid records
  if (validToInsert.length > 0) {
    // Process in chunks of 50 to prevent connection timeouts
    const chunkSize = 50;
    for (let i = 0; i < validToInsert.length; i += chunkSize) {
      const chunk = validToInsert.slice(i, i + chunkSize);
      await prisma.cbtQuestion.createMany({
        data: chunk
      });
    }
    acceptedCount = validToInsert.length;
  }

  // Record in CbtImportLog
  const importLog = await prisma.cbtImportLog.create({
    data: {
      fileName: fileName || 'batch_import',
      fileType: fileType || 'CSV',
      totalRows: records.length,
      acceptedCount,
      skippedCount,
      duplicateCount,
      failedCount,
      errors: errors.length > 0 ? errors : null,
      importedBy: importedBy || 'admin',
      status: failedCount === records.length ? 'FAILED' : 'COMPLETED'
    }
  });

  return {
    importId: importLog.id,
    totalProcessed: records.length,
    acceptedCount,
    duplicateCount,
    failedCount,
    errors
  };
}

module.exports = {
  normalizeText,
  validateQuestionPayload,
  parseCsv,
  mapCsvToQuestionObjects,
  processBatchImport
};
