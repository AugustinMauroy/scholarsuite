import { styleText } from 'node:util';
import { PrismaClient } from '@prisma/client';
import { encode } from '@/utils/crypto.ts';
const now = new Date();

const getCurrentAcademicYear = () => {
  const data = {
    startDate: new Date(),
    endDate: new Date(),
    name: '',
  };

  if (now.getMonth() < 8) {
    data.name = `${now.getFullYear() - 1}-${now.getFullYear()}`;
    data.startDate = new Date(now.getFullYear() - 1, 8, 1);
    data.endDate = new Date(now.getFullYear(), 7, 31);
  } else {
    data.name = `${now.getFullYear()}-${now.getFullYear() + 1}`;
    data.startDate = new Date(now.getFullYear(), 8, 1);
    data.endDate = new Date(now.getFullYear() + 1, 7, 31);
  }

  return data;
};

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
        firstName: 'Augustin',
        lastName: 'Mauroy',
        password: await encode('password'),
        role: 'ADMIN',
      },
      {
        firstName: 'Jean',
        lastName: 'Dupont',
        password: await encode('password'),
        role: 'TEACHER',
      },
      {
        firstName: 'Paul',
        lastName: 'Martin',
        password: await encode('password'),
        role: 'MANAGER',
      },
    ],
  });

  /* Belgian school levels */
  await prisma.schoolLevel.createMany({
    data: [
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

  await prisma.subject.createMany({
    data: [{ name: 'Mathematics' }, { name: 'Science' }, { name: 'History' }],
  });

  await prisma.disciplinaryReport.create({
    data: {
      description: 'Student was caught cheating during the exam',
      date: new Date(),
      createdBy: { connect: { id: 1 } },
      student: { connect: { id: 1 } },
    },
  });

  /* Create the Create schedule (timeslot) */
  await prisma.timeSlot.createMany({
    data: [
      {
        name: '08:25 - 09:15',
        startTime: '08:25',
        endTime: '09:15',
      },
      {
        name: '09:15 - 10:05',
        startTime: '09:15',
        endTime: '10:05',
      },
      {
        name: '10:05 - 10:55',
        startTime: '10:05',
        endTime: '10:55',
      },
      {
        name: '10:55 - 11:10',
        startTime: '11:10',
        endTime: '12:00',
      },
      {
        name: '12:00 - 12:50',
        startTime: '12:00',
        endTime: '12:50',
      },
      {
        name: '12:50 - 13:40',
        startTime: '12:50',
        endTime: '13:40',
      },
      {
        name: '13:40 - 14:30',
        startTime: '13:40',
        endTime: '14:30',
      },
      {
        name: '14:30 - 15:20',
        startTime: '14:30',
        endTime: '15:20',
      },
      {
        name: '15:20 - 16:10',
        startTime: '15:20',
        endTime: '16:10',
      },
    ],
  });

  const AcademicYear = getCurrentAcademicYear();
  await prisma.academicYear.create({
    data: {
      name: AcademicYear.name,
      startDate: AcademicYear.startDate,
      endDate: AcademicYear.endDate,
    },
  });

  await prisma.gradePeriod.createMany({
    data: [
      // first semester 1 september - 31 january
      {
        name: 'First semester',
        startDate: new Date(now.getFullYear(), 8, 1),
        endDate: new Date(now.getFullYear(), 11, 31),
      },
      // second semester 1 february - 31 july
      {
        name: 'Second semester',
        startDate: new Date(now.getFullYear(), 1, 1),
        endDate: new Date(now.getFullYear(), 6, 31),
      },
    ],
  });

  await prisma.$disconnect();
  console.log(styleText('green', '✓') + ' Seeded database for developement');
}
