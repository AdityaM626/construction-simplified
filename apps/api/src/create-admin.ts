import bcrypt from 'bcryptjs';
import { createDataClient } from '@construction-os/data';

const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const fullName = process.env.ADMIN_NAME?.trim();
const password = process.env.ADMIN_PASSWORD;
if (!email || !email.includes('@') || !fullName || !password || password.length < 12) {
  throw new Error('ADMIN_EMAIL, ADMIN_NAME and ADMIN_PASSWORD (12+ characters) are required');
}

const prisma = createDataClient();
try {
  if (await prisma.user.findUnique({ where: { email } })) {
    throw new Error('An account with this email already exists');
  }
  await prisma.user.create({ data: {
    email, fullName, passwordHash: await bcrypt.hash(password, 12), role: 'ADMIN'
  } });
  console.log('Administrator account created');
} finally {
  await prisma.$disconnect();
}
