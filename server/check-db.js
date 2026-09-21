require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const q = await prisma.cbtQuestion.count();
  const sampleQ = await prisma.cbtQuestion.findFirst();
  console.log('Sample Question:', JSON.stringify(sampleQ, null, 2));
  const t = await prisma.tip.count();
  const r = await prisma.resource.count();
  const a = await prisma.assignment.count();
  console.log('CBT Questions:', q, '| TIPS:', t, '| Resources:', r, '| Assignments:', a);

  await prisma.$disconnect();
  await pool.end();
}
main().catch(e => { console.error(e.message); process.exit(1); });
