require('dotenv').config();
const path = require('path');
const { execSync } = require('child_process');
const app = require('./app');
const prisma = require('./config/database');

const PORT = process.env.PORT || 5000;

async function initDatabase() {
  try {
    await prisma.user.count();
    console.log('✅ Database schema verified.');
  } catch (err) {
    if (err.message && (err.message.includes('does not exist') || err.code === 'P2021')) {
      console.log('⚡ Tables missing in database. Auto-pushing schema...');
      try {
        execSync('npx prisma db push --skip-generate --accept-data-loss', {
          cwd: path.resolve(__dirname, '..'),
          stdio: 'inherit',
          env: { ...process.env }
        });
        console.log('✅ Prisma schema pushed successfully!');
      } catch (pushErr) {
        console.error('❌ Failed to auto-push schema on startup:', pushErr.message);
      }
    } else {
      console.error('Database connection check:', err.message);
    }
  }
}

async function seedDefaultContent() {
  try {
    const existingExams = await prisma.siteContent.findUnique({ where: { key: 'upcoming_exams' } });
    if (!existingExams) {
      await prisma.siteContent.create({
        data: {
          key: 'upcoming_exams',
          value: JSON.stringify([
            { name: 'WAEC SSCE', date: 'May 5, 2025', countdown: '115 days left', color: 'rgba(59,130,246,0.1)' },
            { name: 'JAMB UTME', date: 'Mar 15, 2025', countdown: '64 days left', color: 'rgba(34,197,94,0.1)' },
            { name: 'NECO SSCE', date: 'Jun 2, 2025', countdown: '143 days left', color: 'rgba(168,85,247,0.1)' }
          ])
        }
      });
      console.log('✅ Seeded upcoming_exams');
    }

    const existingCourses = await prisma.siteContent.findUnique({ where: { key: 'trending_courses' } });
    if (!existingCourses) {
      await prisma.siteContent.create({
        data: {
          key: 'trending_courses',
          value: JSON.stringify([
            { rank: 1, title: 'Medicine & Surgery', aspirants: '3,420 aspirants' },
            { rank: 2, title: 'Computer Science', aspirants: '2,980 aspirants' },
            { rank: 3, title: 'Law', aspirants: '2,540 aspirants' },
            { rank: 4, title: 'Nursing Science', aspirants: '2,100 aspirants' },
            { rank: 5, title: 'Business Administration', aspirants: '1,850 aspirants' }
          ])
        }
      });
      console.log('✅ Seeded trending_courses');
    }
  } catch (err) {
    // If table doesn't exist yet, ignore
  }
}

async function seedDefaultGroups() {
  try {
    const count = await prisma.group.count();
    if (count === 0) {
      console.log('🌱 Database has 0 study groups. Seeding default circles...');
      await prisma.group.createMany({
        data: [
          {
            name: "WAEC Science Circle",
            description: "Physics, Chemistry & Biology drills with weekly coordinator-led sessions."
          },
          {
            name: "JAMB Elite Reading Room",
            description: "Timed comprehension, vocabulary drills, and peer accountability for Use of English."
          },
          {
            name: "Frontend Builders Guild",
            description: "UI reviews, React debugging help, and shipping portfolio projects together."
          },
          {
            name: "VA Accountability Pod",
            description: "Daily wins, SOP sharing, and check-ins for remote career students."
          }
        ]
      });
      console.log('✅ Default study groups successfully seeded.');
    }
  } catch (err) {
    // If table doesn't exist yet, ignore
  }
}

async function bootstrap() {
  await initDatabase();
  await seedDefaultContent();
  await seedDefaultGroups();

  app.listen(PORT, (err) => {
    if (err) {
      console.error(`❌ Failed to start server:`, err.message);
      process.exit(1);
    }
    console.log(`🚀 Server running on port ${PORT}`);
  });
}

bootstrap();
