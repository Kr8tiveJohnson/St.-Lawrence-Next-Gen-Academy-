require('dotenv').config();
const prisma = require('./src/config/database');

const HOF_ENTRIES = [
  {
    name: 'Adaeze Okonkwo',
    track: 'WAEC SSCE · 2024',
    score: '9 A1s',
    achievement: 'University of Lagos — Medicine',
  },
  {
    name: 'Chukwuemeka Eze',
    track: 'JAMB UTME · 2024',
    score: '340 / 400',
    achievement: 'University of Ibadan — Engineering',
  },
  {
    name: 'Fatima Al-Hassan',
    track: 'NECO SSCE · 2024',
    score: '8 Distinctions',
    achievement: 'Ahmadu Bello University — Law',
  },
  {
    name: 'Ibrahim Musa',
    track: 'Digital Skills · 2024',
    score: 'Top Graduate',
    achievement: 'Now earning $800/month remotely',
  },
];

async function seed() {
  console.log('🌱 Seeding Hall of Fame entries...');

  for (const entry of HOF_ENTRIES) {
    const created = await prisma.news.create({
      data: {
        title: entry.name,
        tag: 'hall-of-fame',
        summary: entry.achievement,
        details: JSON.stringify({
          name: entry.name,
          track: entry.track,
          score: entry.score,
          achievement: entry.achievement,
        }),
        imageUrl: null,
      },
    });
    console.log(`  ✅ Added: ${entry.name}`);
  }

  console.log('\n🎉 Done! All 4 Hall of Fame entries saved to the database.');
  await prisma.$disconnect();
}

seed().catch(e => {
  console.error('❌ Seed failed:', e.message);
  process.exit(1);
});
