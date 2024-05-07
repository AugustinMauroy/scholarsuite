import { platform } from 'node:os';
import readline from 'node:readline';
import { PrismaClient } from '@prisma/client';
import { encode } from '@/utils/crypto';

const BELGIAN_SCHOOL_LEVELS = [
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
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const prisma = new PrismaClient();
const users = await prisma.user.findMany();

if (users.length) {
  if (platform() === 'win32')
    console.log('⨯ There are already entries in the database');
  else
    console.log('\x1b[31m⨯\x1b[0m There are already entries in the database');
  process.exit(0);
} else {
  await prisma.user.createMany({
    data: [
      {
        firstName: 'admin',
        lastName: 'admin',
        password: await encode('password'),
        role: 0,
      },
    ],
  });

  rl.question(
    'Do you want to use the default preset? (yes/no): ',
    async answer => {
      if (answer === 'yes') {
        await prisma.schoolLevel.createMany({
          data: BELGIAN_SCHOOL_LEVELS,
        });
      }
      rl.close();

      await prisma.$disconnect();

      if (platform() === 'win32') console.log('✓ Seed completed');
      else console.log('\x1b[32m✓\x1b[0m Seed completed');
    }
  );
}
