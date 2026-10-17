const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const prisma = require('../src/config/database');

async function main() {
  console.log('=== USERS & PROFILES ===');
  const users = await prisma.user.findMany({
    include: { profile: true },
    orderBy: { createdAt: 'desc' }
  });
  console.log(JSON.stringify(users.map(u => ({
    id: u.id,
    email: u.email,
    role: u.role,
    tier: u.tier,
    firstName: u.profile?.firstName,
    surname: u.profile?.surname,
    fullName: u.profile?.fullName,
    phone: u.profile?.phone,
    dob: u.profile?.dateOfBirth,
    createdAt: u.createdAt
  })), null, 2));

  console.log('\n=== CBT QUESTIONS COUNT ===');
  const questionsCount = await prisma.cbtQuestion.count();
  console.log(`Total CBT Questions: ${questionsCount}`);

  console.log('\n=== CBT ATTEMPTS COUNT ===');
  const attemptsCount = await prisma.cbtAttempt.count();
  console.log(`Total CBT Attempts: ${attemptsCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
