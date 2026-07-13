const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@stlawrenceacademy.example';
  
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail }
  });

  if (existingAdmin) {
    console.log('MAIN_ADMIN already exists, skipping seed.');
    return;
  }

  const hashedPassword = await bcrypt.hash('ChangeMe123!', 10);

  const mainAdmin = await prisma.user.create({
    data: {
      email: adminEmail,
      password: hashedPassword,
      role: 'MAIN_ADMIN',
      tier: 'PAID',
      profile: {
        create: {
          fullName: 'System Administrator',
          phone: '+1234567890'
        }
      }
    }
  });

  console.log('Seeded initial MAIN_ADMIN user:');
  console.log(`Email: ${mainAdmin.email}`);
  console.log('Password: ChangeMe123!');
  console.log('IMPORTANT: Change this password immediately after logging in.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
