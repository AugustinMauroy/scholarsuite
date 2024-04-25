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
        role: 0, // administrator
      },
      {
        firstName: 'jean',
        lastName: 'dupont',
        password: 'password',
        role: 1, // teacher
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

  /* Create 3 classes for each secondary school level */
  await prisma.class.createMany({
    data: [
      { name: '1A', schoolLevelId: 7 },
      { name: '1B', schoolLevelId: 7 },
      { name: '1C', schoolLevelId: 7 },
      { name: '2A', schoolLevelId: 8 },
      { name: '2B', schoolLevelId: 8 },
      { name: '2C', schoolLevelId: 8 },
      { name: '3A', schoolLevelId: 9 },
      { name: '3B', schoolLevelId: 9 },
      { name: '3C', schoolLevelId: 9 },
      { name: '4A', schoolLevelId: 10 },
      { name: '4B', schoolLevelId: 10 },
      { name: '4C', schoolLevelId: 10 },
      { name: '5A', schoolLevelId: 11 },
      { name: '5B', schoolLevelId: 11 },
      { name: '5C', schoolLevelId: 11 },
      { name: '6A', schoolLevelId: 12 },
      { name: '6B', schoolLevelId: 12 },
      { name: '6C', schoolLevelId: 12 },
    ],
  });

  /* Create stutend for one class */
  await prisma.student.createMany({
    data: [
      {
        firstName: 'Alice',
        lastName: 'Dubois',
        dateOfBirth: new Date(),
        classId: 1,
      },
      {
        firstName: 'Bob',
        lastName: 'Martin',
        dateOfBirth: new Date(),
        classId: 1,
      },
      {
        firstName: 'Charlie',
        lastName: 'Brown',
        dateOfBirth: new Date(),
        classId: 1,
      },
    ],
  });

  // assing class to teacher
  await prisma.class.update({
    where: { id: 1 },
    data: { userId: 1 },
  });

  // create subjects
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
