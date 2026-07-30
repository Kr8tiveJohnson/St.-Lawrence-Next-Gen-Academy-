require('dotenv').config();
const prisma = require('./src/config/database');

const title = "2026 Holiday Lessons Now Open — WAEC • NECO • JAMB";
const tag = "Holiday Lessons";
const summary = "St. Lawrence Next Gen Academy is excited to announce our 2026 Holiday Lessons for Primary & Secondary students! Classes run Monday–Thursday, 9:00 AM–1:00 PM from 27th July to 27th August 2026. Lesson fee: ₦10,000 per child.";

const details = `ST. LAWRENCE NEXT GEN ACADEMY
Raising Future Leaders. Building Tomorrow, Today.

📚 WAEC • NECO • JAMB FULL CLASSES COMMENCE
• Active teaching with online classes
• CBT training and practice
• Exam focus with detailed learning
• FREE WiFi for students

──────────────────────────────
🗓 2026 HOLIDAY LESSONS
──────────────────────────────
📅 Duration:  27th July 2026 – 27th August 2026
⏰ Time:       9:00 AM – 1:00 PM
📆 Days:       Monday to Thursday
👥 For:        Primary & Secondary Students

Holiday lessons are for Primary and Secondary students. Adult Education and SSCE classes for WAEC, JAMB, and NECO continue as scheduled.

──────────────────────────────
🎓 SECONDARY SECTION
──────────────────────────────
Subjects Offered:
✅ English Language (with emphasis)
✅ Mathematics
✅ Physics
✅ Chemistry
✅ Biology
✅ Literature in English
✅ Government, and more.
✅ Introduction to Coding (HTML)
✅ Introduction to Artificial Intelligence (AI)

LESSON FEE: ₦10,000 PER CHILD

──────────────────────────────
📖 PRIMARY SECTION
──────────────────────────────
Subjects Offered:
✅ English Language (with emphasis)
✅ Interactive Mathematics (Daily)
✅ Computer Science (Introduction to Coding)
✅ Introduction to AI Basics

LESSON FEE: ₦10,000 PER CHILD

──────────────────────────────
💻 DIGITAL SKILLS
──────────────────────────────
✅ Front-End Development
✅ Back-End Development
✅ Full Web Development
✅ And more...
📩 DM us for more info.

──────────────────────────────
📘 ADULT EDUCATION
──────────────────────────────
Classes hold twice every week.
Contact us for schedule and registration details.`;

async function main() {
  console.log('🔍 Checking if Holiday Lessons news item already exists...');

  const existing = await prisma.news.findFirst({
    where: {
      OR: [
        { title: title },
        { tag: tag }
      ]
    }
  });

  if (existing) {
    console.log(`Found existing news item (ID: ${existing.id}). Updating it...`);
    const updated = await prisma.news.update({
      where: { id: existing.id },
      data: {
        title,
        tag,
        summary,
        details,
        date: new Date('2026-07-27T09:00:00Z')
      }
    });
    console.log('✅ Updated successfully!');
  } else {
    console.log('No existing item found. Creating new news item...');
    const created = await prisma.news.create({
      data: {
        title,
        tag,
        summary,
        details,
        date: new Date('2026-07-27T09:00:00Z')
      }
    });
    console.log(`✅ Created successfully (ID: ${created.id})!`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error executing database insert:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
