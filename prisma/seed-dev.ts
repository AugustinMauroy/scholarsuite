import { styleText } from 'node:util';
import { PrismaClient } from '@prisma/client';
import { encode } from '@/utils/crypto.ts';

const now = new Date();

const getCurrentAcademicYear = () => {
  const data = {
    startDate: now,
    endDate: now,
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
let users = await prisma.user.findMany();

if (users.length) {
  console.log(
    styleText('red', '⨯') + ' There are already entries in the database'
  );
  process.exit(0);
} else {
  await prisma.user.createMany({
    data: [
      {
        firstName: 'Admin',
        lastName: 'Admin',
        password: await encode('password'),
        role: 'ADMIN',
      },
      {
        firstName: 'Teacher',
        lastName: 'Teacher',
        password: await encode('password'),
        role: 'TEACHER',
      },
      {
        firstName: 'Manager',
        lastName: 'Manager',
        password: await encode('password'),
        role: 'MANAGER',
      },
    ],
  });

  users = await prisma.user.findMany();

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

  await prisma.student.createMany({
    data: [
      {
        firstName: 'Alice',
        lastName: 'Dubois',
        dateOfBirth: now,
        classId: 1,
      },
      {
        firstName: 'Bob',
        lastName: 'Martin',
        dateOfBirth: now,
        classId: 1,
      },
      {
        firstName: 'Charlie',
        lastName: 'Brown',
        dateOfBirth: now,
        classId: 1,
      },
      {
        firstName: 'David',
        lastName: 'Smith',
        dateOfBirth: now,
        classId: 1,
      },
      {
        firstName: 'Eve',
        lastName: 'Johnson',
        dateOfBirth: now,
        classId: 1,
      },
      {
        firstName: 'Frank',
        lastName: 'Williams',
        dateOfBirth: now,
        classId: 1,
      },
      {
        firstName: 'Grace',
        lastName: 'Jones',
        dateOfBirth: now,
        classId: 1,
      },
      {
        firstName: 'Hugo',
        lastName: 'Garcia',
        dateOfBirth: now,
        classId: 1,
      },
      {
        firstName: 'Isabel',
        lastName: 'Martinez',
        dateOfBirth: now,
        classId: 1,
      },
      {
        firstName: 'Jack',
        lastName: 'Brown',
        dateOfBirth: now,
        classId: 1,
      },
      {
        firstName: 'Karl',
        lastName: 'Schmidt',
        dateOfBirth: now,
        classId: 1,
      },
      {
        firstName: 'Linda',
        lastName: 'Davis',
        dateOfBirth: now,
        classId: 1,
      },
    ],
  });

  const students = await prisma.student.findMany();

  // assing class to teacher
  await prisma.userClass.createMany({
    data: [
      {
        userId: 1,
        classId: 1,
      },
      {
        userId: 2,
        classId: 1,
      },
      {
        userId: 3,
        classId: 1,
      },
    ],
  });

  await prisma.subject.createMany({
    data: [
      { name: 'Mathematics' },
      { name: 'Science' },
      { name: 'History' },
      { name: 'Geography' },
      { name: 'French' },
      { name: 'English' },
    ],
  });

  await prisma.disciplinaryReport.createMany({
    data: [
      {
        description: 'Student was caught cheating during the exam',
        date: now,
        createdById: 1,
        studentId: 1,
      },
      {
        description: 'Bob was imitating a chicken during the class',
        // one day before
        date: new Date(now.setDate(now.getDate() - 1)),
        createdById: 1,
        studentId: 2,
      },
      {
        description: 'Charlie was caught smoking in the school',
        date: new Date(now.setDate(now.getDate() - 1)),
        createdById: 1,
        studentId: 3,
      },
      {
        description: "Alice won' t stop talking during the revision",
        date: new Date(now.setDate(now.getDate() - 1)),
        createdById: 1,
        studentId: 1,
      },
    ],
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

  const academicYear = getCurrentAcademicYear();
  await prisma.academicYear.create({
    data: academicYear,
  });

  await prisma.group.createMany({
    data: [
      {
        name: 'Siences de base gp1',
        subjectId: 2,
        schoolLevelId: 10,
      },
      {
        name: 'Siences de base gp2',
        subjectId: 2,
        schoolLevelId: 10,
      },
      {
        name: 'Siences générales',
        subjectId: 2,
        schoolLevelId: 10,
      },
      {
        name: 'Siences de base gp1',
        subjectId: 2,
        schoolLevelId: 11,
      },
      {
        name: 'Siences de base gp2',
        subjectId: 2,
        schoolLevelId: 11,
      },
      {
        name: 'Siences générales',
        subjectId: 2,
        schoolLevelId: 11,
      },
      {
        name: 'Siences de base gp1',
        subjectId: 2,
        schoolLevelId: 12,
      },
      {
        name: 'Siences de base gp2',
        subjectId: 2,
        schoolLevelId: 12,
      },
      {
        name: 'Siences générales',
        subjectId: 2,
        schoolLevelId: 12,
      },
    ],
  });

  const groups = await prisma.group.findMany();

  // bind user to groups
  for (const user of users) {
    for (const group of groups) {
      await prisma.userGroup.create({
        data: {
          userId: user.id,
          groupId: group.id,
        },
      });
    }
  }

  // bind all students to all groups
  for (const student of students) {
    for (const group of groups) {
      await prisma.studentGroup.create({
        data: {
          studentId: student.id,
          groupId: group.id,
        },
      });
    }
  }

  await prisma.$disconnect();
  console.log(styleText('green', '✓') + ' Seeded database for developement');
}
