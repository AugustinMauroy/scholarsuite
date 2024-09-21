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
        email: 'admin',
        password: await encode('password'),
        role: 'ADMIN',
      },
    ],
  });

  if (
    process.env.USE_BELGIUM_SCHOOL_LVLS ||
    process.env.USE_BELGIUM_SCHOOL_LVLS
  ) {
    if (process.env.USE_BELGIUM_SCHOOL_LVLS === 'true') {
      await prisma.schoolLevel.createMany({
        data: BELGIAN_SCHOOL_LEVELS,
      });
    }
    if (process.env.USE_FRENCH_SCHOOL_LVLS === 'true') {
      await prisma.schoolLevel.createMany({
        data: FRENCH_SCHOOL_LEVELS,
      });
    }
  } else {
    console.log('Do you want to seed school levels? (y/n) [default: n]');

    rl.question(
      'Do you want to seed school levels? (y/n) [default: n]',
      async answer => {
        if (answer === 'y') {
          rl.question(
            'Which school levels do you want to seed? (belgium, french) [default: belgium]',
            async answer => {
              if (answer === 'belgium') {
                await prisma.schoolLevel.createMany({
                  data: BELGIAN_SCHOOL_LEVELS,
                });
              } else if (answer === 'french') {
                await prisma.schoolLevel.createMany({
                  data: FRENCH_SCHOOL_LEVELS,
                });
              } else {
                console.log(
                  styleText('red', '⨯') + ' School levels not seeded'
                );
              }
            }
          );
        } else {
          console.log(styleText('red', '⨯') + ' School levels not seeded');
        }
      }
    );
  }

  await prisma.$disconnect();
  console.log(styleText('green', '✓') + ' Seed completed');
}
