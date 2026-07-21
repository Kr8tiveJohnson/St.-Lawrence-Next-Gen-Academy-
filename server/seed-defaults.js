require('dotenv').config();
const prisma = require('./src/config/database');

const UPCOMING_EXAMS = [
  { name: 'WAEC SSCE', date: 'May 5, 2025', countdown: '115 days left', color: 'rgba(59,130,246,0.1)' },
  { name: 'JAMB UTME', date: 'Mar 15, 2025', countdown: '64 days left', color: 'rgba(34,197,94,0.1)' },
  { name: 'NECO SSCE', date: 'Jun 2, 2025', countdown: '143 days left', color: 'rgba(168,85,247,0.1)' }
];

const TRENDING_COURSES = [
  { rank: 1, title: 'Medicine & Surgery', aspirants: '3,420 aspirants' },
  { rank: 2, title: 'Computer Science', aspirants: '2,980 aspirants' },
  { rank: 3, title: 'Law', aspirants: '2,540 aspirants' },
  { rank: 4, title: 'Nursing Science', aspirants: '2,100 aspirants' },
  { rank: 5, title: 'Business Administration', aspirants: '1,850 aspirants' }
];

async function seed() {
  console.log('🌱 Seeding default exams and courses...');

  await prisma.siteContent.upsert({
    where: { key: 'upcoming_exams' },
    update: {},
    create: {
      key: 'upcoming_exams',
      value: JSON.stringify(UPCOMING_EXAMS),
    },
  });
  console.log('  ✅ Saved: upcoming_exams');

  await prisma.siteContent.upsert({
    where: { key: 'trending_courses' },
    update: {},
    create: {
      key: 'trending_courses',
      value: JSON.stringify(TRENDING_COURSES),
    },
  });
  console.log('  ✅ Saved: trending_courses');

  console.log('\n🎉 Done!');
  await prisma.$disconnect();
}

seed().catch(e => {
  console.error('❌ Seed failed:', e);
  process.exit(1);
});
