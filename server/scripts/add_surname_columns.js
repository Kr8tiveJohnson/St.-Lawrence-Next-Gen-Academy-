const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const prisma = require('../src/config/database');

async function main() {
  console.log('Connecting using DATABASE_URL:', process.env.DATABASE_URL ? 'Loaded successfully' : 'Missing!');
  console.log('Adding surname and firstName columns to Profile table...');
  await prisma.$executeRawUnsafe(`
    ALTER TABLE "Profile" 
    ADD COLUMN IF NOT EXISTS "surname" TEXT,
    ADD COLUMN IF NOT EXISTS "firstName" TEXT;
  `);
  console.log('✅ Columns surname and firstName successfully added to Profile table!');
  
  // Backfill existing rows if any
  const profiles = await prisma.profile.findMany();
  console.log(`Found ${profiles.length} existing profiles to backfill.`);
  for (const p of profiles) {
    if (p.fullName && (!p.surname || !p.firstName)) {
      const parts = p.fullName.trim().split(/\s+/);
      const first = parts[0] || '';
      const sur = parts.length > 1 ? parts[parts.length - 1] : parts[0];
      await prisma.$executeRawUnsafe(
        `UPDATE "Profile" SET "firstName" = $1, "surname" = $2 WHERE id = $3`,
        first,
        sur,
        p.id
      );
      console.log(`Updated profile ${p.id} (${p.fullName}) -> firstName: "${first}", surname: "${sur}"`);
    }
  }
}

main()
  .catch((e) => {
    console.error('Migration error:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
