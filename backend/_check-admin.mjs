import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
try {
  const admin = await prisma.admin.findUnique({ where: { email: 'admin@baltena.com' } });
  console.log(admin ? JSON.stringify(admin) : 'NO_ADMIN_FOUND');
} finally {
  await prisma.$disconnect();
}
