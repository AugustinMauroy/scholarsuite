import { PrismaClient } from '@prisma/client';
import type { PrismaClient as PrismaClientType } from '@prisma/client';

// Prevent multiple instances of Prisma Client in development
declare global {
  var prisma: PrismaClientType;
}

let prisma: PrismaClientType;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
