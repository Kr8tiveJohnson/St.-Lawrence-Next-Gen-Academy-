require('dotenv').config();
const app = require('./app');
const prisma = require('./config/database');

const PORT = process.env.PORT || 5000;

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
    console.error('❌ Failed to seed default study groups:', err);
  }
}

// Seed and start server
seedDefaultGroups().then(() => {
  app.listen(PORT, (err) => {
    if (err) {
      console.error(`❌ Failed to start server:`, err.message);
      process.exit(1);
    }
    console.log(`🚀 Server running on port ${PORT}`);
  });
});

