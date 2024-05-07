import { styleText } from 'node:util';
import readline from 'node:readline';
import { PrismaClient } from '@prisma/client';
import { encode } from '@/utils/crypto.ts';

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

const FRENCH_SCHOOL_LEVELS = [
  { name: 'CP' },
  { name: 'CE1' },
  { name: 'CE2' },
  { name: 'CM1' },
  { name: 'CM2' },
  { name: '6ème' },
  { name: '5ème' },
  { name: '4ème' },
  { name: '3ème' },
  { name: '2nde' },
  { name: '1ère' },
  { name: 'Terminale' },
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
        role: 0,
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
