import { platform } from 'os';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const users = await prisma.user.findMany();

if (users.length) {
  if (platform() === 'win32')
    console.log('⨯ Users already exist in the database');
  else console.log('\x1b[31m⨯\x1b[0m Users already exist in the database');
  process.exit(0);
} else {
  await prisma.user.createMany({
    data: [
      {
        firstName: 'augustin',
        lastName: 'mauroy',
        password: 'password',
        role: 1,
      },
      {
        firstName: 'jean',
        lastName: 'dupont',
        password: 'password',
        role: 0,
      },
    ],
  });

  /* Belgian school levels */
  await prisma.schoolLevel.createMany({
    data: [
      { name: '1ère primaire' },
      { name: '2ème primaire' },
      { name: '3ème primaire' },
      { name: '4ème primaire' },
      { name: '5ème primaire' },
      { name: '6ème primaire' },
      { name: '1ère secondaire' },
      { name: '2ème secondaire' },
      { name: '3ème secondaire' },
      { name: '4ème secondaire' },
      { name: '5ème secondaire' },
      { name: '6ème secondaire' },
    ],
  });

  await prisma.$disconnect();

  // this will not necessari when we will use node V21
  // because v21 have styleText
  if (platform() === 'win32') console.log('✓ Seeded database with users');
  else console.log('\x1b[32m✓\x1b[0m Seeded database with users');
}
