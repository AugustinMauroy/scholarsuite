import readline from 'node:readline';
import { styleText } from 'node:util';
import { PrismaClient } from '@prisma/client';
import { encode } from '@/utils/crypto.ts';

const BELGIAN_SCHOOL_LEVELS = [
  { name: '1ère primaire', order: 1 },
  { name: '2ème primaire', order: 2 },
  { name: '3ème primaire', order: 3 },
  { name: '4ème primaire', order: 4 },
  { name: '5ème primaire', order: 5 },
  { name: '6ème primaire', order: 6 },
  { name: '1ère secondaire', order: 7 },
  { name: '2ème secondaire', order: 8 },
  { name: '3ème secondaire', order: 9 },
  { name: '4ème secondaire', order: 10 },
  { name: '5ème secondaire', order: 11 },
  { name: '6ème secondaire', order: 12 },
];

const FRENCH_SCHOOL_LEVELS = [
  { name: 'CP', order: 1 },
  { name: 'CE1', order: 2 },
  { name: 'CE2', order: 3 },
  { name: 'CM1', order: 4 },
  { name: 'CM2', order: 5 },
  { name: '6ème', order: 6 },
  { name: '5ème', order: 7 },
  { name: '4ème', order: 8 },
  { name: '3ème', order: 9 },
  { name: '2nde', order: 10 },
  { name: '1ère', order: 11 },
  { name: 'Terminale', order: 12 },
];

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const prisma = new PrismaClient();
const users = await prisma.user.findMany();

if (users.length) {
  console.log(
    styleText('red', '⨯') + ' There are already entries in the database'
  );
  process.exit(0);
} else {
  await prisma.user.createMany({
    data: [
      {
        firstName: 'admin',
        lastName: 'admin',
        password: await encode('password'),
        role: 'ADMIN',
      },
    ],
  });

  rl.question(
    'Do you want to use the default preset? (yes/no): ',
    async answer => {
      if (answer === 'yes') {
        rl.question(
          'Do you want to use the Belgian school levels? (yes/no): ',
          async answer => {
            if (answer === 'yes') {
              await prisma.schoolLevel.createMany({
                data: BELGIAN_SCHOOL_LEVELS,
              });
            } else {
              await prisma.schoolLevel.createMany({
                data: FRENCH_SCHOOL_LEVELS,
              });
            }
            rl.close();

            await prisma.$disconnect();

            console.log(styleText('green', '✓') + ' Seed completed');
          }
        );
      } else {
        rl.close();

        await prisma.$disconnect();

        console.log(styleText('green', '✓') + ' Seed completed');
      }
    }
  );
}
