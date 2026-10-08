import bcrypt from 'bcryptjs';
import { prisma } from '../db.js';

async function createAdmin() {
  const email = process.argv[2] || 'admin@pathiq.dev';
  const password = process.argv[3] || 'AdminPass123!';

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN', passwordHash },
    create: {
      email,
      passwordHash,
      name: 'Super Admin',
      role: 'ADMIN',
      emailVerified: true,
      ageConfirmed: true,
      isUnder18: false,
    },
  });

  console.log(`✅ Admin user ready: ${user.email}`);
  await prisma.$disconnect();
}

createAdmin();
