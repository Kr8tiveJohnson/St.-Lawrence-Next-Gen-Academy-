const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const prisma = require('../src/config/database');

async function main() {
  console.log('--- Migrating CBT Question Management Schema ---');

  // 1. Extend CbtQuestion columns
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "CbtQuestion"
    ADD COLUMN IF NOT EXISTS "subTopic" TEXT,
    ADD COLUMN IF NOT EXISTS "syllabusVersion" TEXT,
    ADD COLUMN IF NOT EXISTS "questionType" TEXT DEFAULT 'MULTIPLE_CHOICE',
    ADD COLUMN IF NOT EXISTS "passageText" TEXT,
    ADD COLUMN IF NOT EXISTS "imageUrl" TEXT,
    ADD COLUMN IF NOT EXISTS "markingGuide" TEXT,
    ADD COLUMN IF NOT EXISTS "origin" TEXT DEFAULT 'PRACTICE_QUESTION',
    ADD COLUMN IF NOT EXISTS "sourceName" TEXT,
    ADD COLUMN IF NOT EXISTS "sourceUrl" TEXT,
    ADD COLUMN IF NOT EXISTS "permissionStatus" TEXT DEFAULT 'VERIFIED',
    ADD COLUMN IF NOT EXISTS "status" TEXT DEFAULT 'APPROVED',
    ADD COLUMN IF NOT EXISTS "isPublished" BOOLEAN DEFAULT true,
    ADD COLUMN IF NOT EXISTS "reviewNotes" TEXT,
    ADD COLUMN IF NOT EXISTS "reviewedBy" TEXT,
    ADD COLUMN IF NOT EXISTS "reviewedAt" TIMESTAMP(3),
    ADD COLUMN IF NOT EXISTS "normalizedText" TEXT;
  `);
  console.log('✅ Extended CbtQuestion table with all metadata, workflow, and origin columns.');

  // 2. Create CbtSubject table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "CbtSubject" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT UNIQUE NOT NULL,
      "code" TEXT UNIQUE,
      "examTypes" JSONB NOT NULL DEFAULT '["JAMB", "WAEC", "NECO", "INTERNAL"]'::jsonb,
      "description" TEXT,
      "icon" TEXT,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✅ Ensured CbtSubject table exists.');

  // 3. Create CbtTopic table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "CbtTopic" (
      "id" TEXT PRIMARY KEY,
      "subjectId" TEXT NOT NULL REFERENCES "CbtSubject"("id") ON DELETE CASCADE,
      "name" TEXT NOT NULL,
      "syllabusVersion" TEXT,
      "order" INTEGER NOT NULL DEFAULT 1,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "CbtTopic_subjectId_name_key" UNIQUE ("subjectId", "name")
    );
  `);
  console.log('✅ Ensured CbtTopic table exists.');

  // 4. Create CbtImportLog table
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "CbtImportLog" (
      "id" TEXT PRIMARY KEY,
      "fileName" TEXT NOT NULL,
      "fileType" TEXT NOT NULL,
      "totalRows" INTEGER NOT NULL DEFAULT 0,
      "acceptedCount" INTEGER NOT NULL DEFAULT 0,
      "skippedCount" INTEGER NOT NULL DEFAULT 0,
      "duplicateCount" INTEGER NOT NULL DEFAULT 0,
      "failedCount" INTEGER NOT NULL DEFAULT 0,
      "errors" JSONB,
      "importedBy" TEXT,
      "status" TEXT NOT NULL DEFAULT 'COMPLETED',
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
  console.log('✅ Ensured CbtImportLog table exists.');

  // 5. Backfill normalizedText for existing questions
  const existingQuestions = await prisma.cbtQuestion.findMany({
    select: { id: true, questionText: true, normalizedText: true }
  });
  console.log(`Checking ${existingQuestions.length} existing questions for normalized text...`);
  for (const q of existingQuestions) {
    if (!q.normalizedText && q.questionText) {
      const norm = q.questionText.toLowerCase().replace(/[^a-z0-9]/g, ' ').replace(/\s+/g, ' ').trim();
      await prisma.$executeRawUnsafe(
        `UPDATE "CbtQuestion" SET "normalizedText" = $1 WHERE "id" = $2`,
        norm,
        q.id
      );
    }
  }

  // 6. Seed Standard Nigerian CBT Subjects
  const DEFAULT_SUBJECTS = [
    { name: 'Mathematics', code: 'MTH', icon: '📐', topics: ['Algebra', 'Calculus', 'Geometry', 'Trigonometry', 'Statistics & Probability', 'Number & Numeration', 'Matrices & Determinants'] },
    { name: 'English Language', code: 'ENG', icon: '📖', topics: ['Comprehension Passages', 'Lexis & Structure', 'Oral English & Vowels', 'Sentence Patterns', 'Registers & Idiomatic Expressions'] },
    { name: 'Physics', code: 'PHY', icon: '⚡', topics: ['Mechanics', 'Waves & Optics', 'Electricity & Magnetism', 'Thermal Physics', 'Modern & Quantum Physics', 'Gravitational Field'] },
    { name: 'Chemistry', code: 'CHM', icon: '🧪', topics: ['Atomic Structure & Periodic Table', 'Chemical Bonding', 'Stoichiometry & Mole Concept', 'Acids, Bases & Salts', 'Organic Chemistry & Hydrocarbons', 'Electrochemistry', 'Chemical Kinetics'] },
    { name: 'Biology', code: 'BIO', icon: '🧬', topics: ['Cell Biology & Genetics', 'Ecology & Ecosystems', 'Nutrition & Digestion', 'Circulatory & Respiratory Systems', 'Reproduction in Plants & Animals', 'Evolution & Adaptation'] },
    { name: 'Economics', code: 'ECN', icon: '📈', topics: ['Theory of Demand & Supply', 'Production & Cost Analysis', 'Money, Banking & Inflation', 'National Income Accounting', 'Public Finance & Fiscal Policy', 'International Trade'] },
    { name: 'Government', code: 'GOV', icon: '🏛️', topics: ['Basic Concepts in Government', 'Constitutional Development in Nigeria', 'Arms of Government', 'Political Parties & Electoral Systems', 'Public Administration', 'International Organizations'] },
    { name: 'Literature in English', code: 'LIT', icon: '🎭', topics: ['Literary Appreciation & Terms', 'African Prose & Drama', 'Non-African Prose & Drama', 'African Poetry', 'Non-African Poetry'] },
    { name: 'Commerce', code: 'COM', icon: '💼', topics: ['Introduction to Commerce', 'Home & Foreign Trade', 'Banking, Insurance & Finance', 'Business Organizations', 'Marketing & Advertising', 'Stock Exchange'] },
    { name: 'Financial Accounting', code: 'ACC', icon: '📊', topics: ['Introduction to Bookkeeping', 'Double Entry Principle', 'Final Accounts of Sole Trader', 'Bank Reconciliation Statements', 'Partnership Accounts', 'Company Accounts'] },
    { name: 'Agricultural Science', code: 'AGR', icon: '🌱', topics: ['Basic Principles of Agriculture', 'Soil Science & Fertility', 'Crop Production & Management', 'Animal Husbandry & Nutrition', 'Agricultural Economics & Extension'] },
    { name: 'Civic Education', code: 'CIV', icon: '🇳🇬', topics: ['Values and Society', 'Citizenship & Human Rights', 'Democracy & Rule of Law', 'National Security & Public Service'] }
  ];

  const crypto = require('crypto');
  for (const s of DEFAULT_SUBJECTS) {
    const existing = await prisma.$queryRawUnsafe(
      `SELECT id FROM "CbtSubject" WHERE name = $1 LIMIT 1`,
      s.name
    );
    let subjectId;
    if (existing && existing.length > 0) {
      subjectId = existing[0].id;
    } else {
      subjectId = crypto.randomUUID();
      await prisma.$executeRawUnsafe(
        `INSERT INTO "CbtSubject" (id, name, code, icon, "examTypes", "isActive", "createdAt", "updatedAt") 
         VALUES ($1, $2, $3, $4, '["JAMB", "WAEC", "NECO", "INTERNAL"]'::jsonb, true, NOW(), NOW())`,
        subjectId,
        s.name,
        s.code,
        s.icon
      );
      console.log(`Seeded subject: ${s.name}`);
    }

    // Seed topics
    for (let i = 0; i < s.topics.length; i++) {
      const topicName = s.topics[i];
      const topicExists = await prisma.$queryRawUnsafe(
        `SELECT id FROM "CbtTopic" WHERE "subjectId" = $1 AND name = $2 LIMIT 1`,
        subjectId,
        topicName
      );
      if (!topicExists || topicExists.length === 0) {
        await prisma.$executeRawUnsafe(
          `INSERT INTO "CbtTopic" (id, "subjectId", name, "order", "createdAt", "updatedAt")
           VALUES ($1, $2, $3, $4, NOW(), NOW())`,
          crypto.randomUUID(),
          subjectId,
          topicName,
          i + 1
        );
      }
    }
  }

  console.log('✅ Standard Nigerian CBT Subjects & Topics seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Migration error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
