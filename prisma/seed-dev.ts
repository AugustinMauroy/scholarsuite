import { platform } from 'os';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const users = await prisma.user.findMany();

if (/*users.length*/ false) {
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

  await prisma.class.createMany({
    data: [
      { name: '1A', schoolLevelId: 1 },
      { name: '2A', schoolLevelId: 2 },
      { name: '3A', schoolLevelId: 3 },
    ],
  });
  const classes = await prisma.class.findMany();

  await prisma.student.createMany({
    data: [
      {
        firstName: 'Alice',
        lastName: 'Dubois',
        dateOfBirth: new Date(),
        classId: classes[0].id,
      },
      {
        firstName: 'Bob',
        lastName: 'Martin',
        dateOfBirth: new Date(),
        classId: classes[1].id,
      },
      {
        firstName: 'Charlie',
        lastName: 'Brown',
        dateOfBirth: new Date(),
        classId: classes[2].id,
      },
    ],
  });

  await prisma.subject.createMany({
    data: [{ name: 'Mathematics' }, { name: 'Science' }, { name: 'History' }],
  });

  await prisma.$disconnect();

  if (platform() === 'win32')
    console.log(
      '✓ Seeded database with users, classes, students, and subjects'
    );
  else
    console.log(
      '\x1b[32m✓\x1b[0m Seeded database with users, classes, students, and subjects'
    );
}
