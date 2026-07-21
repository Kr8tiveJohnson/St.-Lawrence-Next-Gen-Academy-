require('dotenv').config();
const prisma = require('./src/config/database');

async function seed() {
  console.log('🌱 Seeding Latest Achievement...');

  // 1. Save as a news article (tag: announcement)
  const news = await prisma.news.create({
    data: {
      title: 'Adaeze Okonkwo scored 9 A1s in WAEC 2024 🎉',
      tag: 'announcement',
      summary: 'Outstanding student performance continues to define the St. Lawrence standard.',
      details: 'Adaeze Okonkwo scored 9 A1s in WAEC 2024 — a remarkable achievement that reflects the quality of preparation at St. Lawrence Next Gen Academy. Outstanding student performance continues to define the St. Lawrence standard.',
      imageUrl: null,
    },
  });
  console.log('  ✅ News article created:', news.title);

  // 2. Save as latest_achievement site content (for the homepage banner)
  const achievement = await prisma.siteContent.upsert({
    where: { key: 'latest_achievement' },
    update: {
      value: JSON.stringify({
        label: '🏆 Latest Achievement',
        headline: 'Adaeze Okonkwo scored 9 A1s in WAEC 2024 🎉',
        subtext: 'Outstanding student performance continues to define the St. Lawrence standard.',
      }),
    },
    create: {
      key: 'latest_achievement',
      value: JSON.stringify({
        label: '🏆 Latest Achievement',
        headline: 'Adaeze Okonkwo scored 9 A1s in WAEC 2024 🎉',
        subtext: 'Outstanding student performance continues to define the St. Lawrence standard.',
      }),
    },
  });
  console.log('  ✅ SiteContent saved: latest_achievement');

  console.log('\n🎉 Done!');
  await prisma.$disconnect();
}

seed().catch(e => {
  console.error('❌ Seed failed:', e.message);
  process.exit(1);
});
