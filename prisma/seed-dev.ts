import { createInterface } from 'node:readline/promises';
import { resolve } from 'node:path';
import { styleText } from 'node:util';
import { PrismaClient, User, Role } from '@prisma/client';
import { generateCurrentAcademicYear } from '@/utils/academicYear.ts';
import { encode } from '@/utils/crypto.ts';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const __dirname = import.meta.dirname;
const now = new Date();
const prisma = new PrismaClient();
const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});
let users = await prisma.user.findMany();

if (users.length) {
  console.log(
    `${styleText('red', '⨯')} There are already entries in the database`
  );
  process.exit(0);
} else {
  console.log(
    `${styleText('green', '✓')} Starting seeding database for development`
  );

  // ask dev for a new user
  let user = null;
  const wantNewUser = await rl.question(
    'Do you want to create a new user? (y/n): '
  );

  if (wantNewUser === 'y') {
    user = {} as User;
    user.firstName = await rl.question('First name: ');
    user.lastName = await rl.question('Last name: ');
    do {
      user.email = await rl.question('Email: ');
      if (!EMAIL_REGEX.test(user.email)) {
        console.log(`${styleText('red', '⨯')} Invalid email address`);
      }
    } while (!EMAIL_REGEX.test(user.email));
    user.password = await encode(await rl.question('Password: '));

    do {
      user.role = (await rl.question(
        'Role (ADMIN, TEACHER, MANAGER): '
      )) as Role;
      if (!['ADMIN', 'TEACHER', 'MANAGER'].includes(user.role)) {
        console.log(
          `${styleText('red', '⨯')} Role must be one of the following values: ADMIN, TEACHER, MANAGER`
        );
      }
    } while (!['ADMIN', 'TEACHER', 'MANAGER'].includes(user.role));
  }

  rl.close();

  await prisma.user.createMany({
    data: [
      {
        firstName: 'Admin',
        lastName: 'Admin',
        email: 'admin',
        password: await encode('password'),
        role: 'ADMIN',
      },
      {
        firstName: 'Teacher',
        lastName: 'Teacher',
        email: 'teacher',
        password: await encode('password'),
        role: 'TEACHER',
      },
      {
        firstName: 'Manager',
        lastName: 'Manager',
        email: 'manager',
        password: await encode('password'),
        role: 'MANAGER',
      },
      ...(user ? [user] : []),
    ],
  });

  users = await prisma.user.findMany();
  const admin = users.find(user => user.role === 'ADMIN');

  if (!admin) {
    console.log(
      `${styleText('red', '⨯')} Admin user not found in the database`
    );
    process.exit(0);
  }

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

  const secondaire4 = await prisma.schoolLevel.findFirst({
    where: {
      name: '4ème secondaire',
    },
  });
  const secondaire5 = await prisma.schoolLevel.findFirst({
    where: {
      name: '5ème secondaire',
    },
  });
  const secondaire6 = await prisma.schoolLevel.findFirst({
    where: {
      name: '6ème secondaire',
    },
  });

  if (!secondaire4 || !secondaire5 || !secondaire6) {
    const pathToFile = resolve(__dirname, 'prisma/seed-dev.ts');

    console.log(
      `${styleText('red', '⨯')} School levels not found in the database
      ${styleText('red', '⨯')} Please check the${styleText('yellow', pathToFile)} file`
    );
    process.exit(0);
  }

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

  const classes = await prisma.class.findMany();

  // bind user to classes
  for (const user of users) {
    for (const _class of classes) {
      await prisma.userClass.create({
        data: {
          userId: user.id,
          classId: _class.id,
        },
      });
    }
  }

  await prisma.student.createMany({
    data: [
      {
        firstName: 'Alice',
        lastName: 'Dubois',
        dateOfBirth: new Date('2010-01-01'),
      },
      {
        firstName: 'Bob',
        lastName: 'Martin',
        dateOfBirth: new Date('2010-01-01'),
      },
      {
        firstName: 'Charlie',
        lastName: 'Brown',
      },
      {
        firstName: 'David',
        lastName: 'Smith',
      },
      {
        firstName: 'Eve',
        lastName: 'Johnson',
      },
      {
        firstName: 'Frank',
        lastName: 'Williams',
      },
      {
        firstName: 'Grace',
        lastName: 'Jones',
      },
      {
        firstName: 'Hugo',
        lastName: 'Garcia',
      },
      {
        firstName: 'Isabel',
        lastName: 'Martinez',
      },
      {
        firstName: 'Jack',
        lastName: 'Brown',
      },
      {
        firstName: 'Karl',
        lastName: 'Schmidt',
      },
      {
        firstName: 'Linda',
        lastName: 'Davis',
      },
      {
        firstName: 'Oliver',
        lastName: 'White',
      },
      {
        firstName: 'Sophia',
        lastName: 'Green',
      },
      {
        firstName: 'Ethan',
        lastName: 'Black',
      },
      {
        firstName: 'Ava',
        lastName: 'Brown',
      },
      {
        firstName: 'Liam',
        lastName: 'Taylor',
      },
      {
        firstName: 'Mia',
        lastName: 'Johnson',
      },
      {
        firstName: 'Noah',
        lastName: 'Smith',
      },
      {
        firstName: 'Emma',
        lastName: 'Williams',
      },
      {
        firstName: 'Olivia',
        lastName: 'Jones',
      },
      {
        firstName: 'William',
        lastName: 'Garcia',
      },
      {
        firstName: 'James',
        lastName: 'Martinez',
      },
      {
        firstName: 'Benjamin',
        lastName: 'Brown',
      },
      {
        firstName: 'Elijah',
        lastName: 'Schmidt',
      },
      {
        firstName: 'Lucas',
        lastName: 'Davis',
      },
      {
        firstName: 'Michael',
        lastName: 'White',
      },
      {
        firstName: 'Alexander',
        lastName: 'Green',
      },
      {
        firstName: 'Daniel',
        lastName: 'Black',
      },
      {
        firstName: 'Henry',
        lastName: 'Brown',
      },
      {
        firstName: 'Joseph',
        lastName: 'Taylor',
      },
      {
        firstName: 'David',
        lastName: 'Johnson',
      },
      {
        firstName: 'Sophia',
        lastName: 'Smith',
      },
      {
        firstName: 'Olivia',
        lastName: 'Williams',
      },
      {
        firstName: 'Jean Christophe',
        lastName: 'Van Damme',
      },
      {
        firstName: 'Christoph Doom',
        lastName: 'Scheider',
      },
      {
        firstName: 'Richard',
        lastName: 'Zven Kruspe',
      },
      {
        firstName: 'Till',
        lastName: 'Lindemann',
      },
      {
        firstName: 'Paul',
        lastName: 'Landers',
      },
      {
        firstName: 'Christian',
        lastName: 'Lorenz',
      },
      {
        firstName: 'Oliver',
        lastName: 'Riedel',
      },
      {
        firstName: 'Bruce',
        lastName: 'Wayne',
      },
      {
        firstName: 'Clark',
        lastName: 'Kent',
      },
      {
        firstName: 'Peter',
        lastName: 'Parker',
      },
      {
        firstName: 'Tony',
        lastName: 'Stark',
      },
      {
        firstName: 'Steve',
        lastName: 'Rogers',
      },
      {
        firstName: 'Peter',
        lastName: 'Von Schönberg Von Hohenstein',
      },
    ],
  });

  const students = await prisma.student.findMany();

  // half student in 5a and half in 6a
  for (let i = 0; i < students.length; i++) {
    await prisma.student.update({
      where: {
        id: students[i].id,
      },
      data: {
        classId: i % 2 === 0 ? 15 : 18,
      },
    });
  }

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

  const science = await prisma.subject.findFirst({
    where: {
      name: 'Science',
    },
  });

  if (!science) {
    const pathToFile = resolve(__dirname, 'prisma/seed-dev.ts');
    let stack = new Error().stack;
    stack = stack ? stack : pathToFile;

    console.log(
      `${styleText('red', '⨯')} Science subject not found in the database
      ${styleText('red', '⨯')} Please check the ${styleText('yellow', stack)} file`
    );
    process.exit(0);
  }

  const DISCIPLINES_REPORT_MESSAGES = [
    'Student was caught cheating during the exam',
    '--firstName-- was imitating a chicken during the class',
    '--firstName-- was caught smoking in the school',
    "--firstName-- won' t stop talking during the revision",
    'Student was caught using a mobile phone during the exam',
    'Student was late for class three times this week',
    '--firstName-- was caught bullying another student',
  ];

  for (let i = 0; i < DISCIPLINES_REPORT_MESSAGES.length; i++) {
    const random = Math.floor(Math.random() * students.length);
    const message = DISCIPLINES_REPORT_MESSAGES[i].replace(
      '--firstName--',
      students[random].firstName
    );

    await prisma.disciplinaryReport.create({
      data: {
        date: new Date(now.setDate(now.getDate() - i)),
        description: message,
        createdById: admin.id,
        studentId: students[random].id,
      },
    });
  }

  /* Create timeslot group */
  await prisma.timeSlotGroup.createMany({
    data: [
      {
        name: 'Matin',
      },
      {
        name: 'Après-midi',
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
        timeSlotGroupId: 1,
      },
      {
        name: '09:15 - 10:05',
        startTime: '09:15',
        endTime: '10:05',
        timeSlotGroupId: 1,
      },
      {
        name: '10:05 - 10:55',
        startTime: '10:05',
        endTime: '10:55',
        timeSlotGroupId: 1,
      },
      {
        name: '10:55 - 11:10',
        startTime: '11:10',
        endTime: '12:00',
        timeSlotGroupId: 1,
      },
      {
        name: '12:00 - 12:50',
        startTime: '12:00',
        endTime: '12:50',
        timeSlotGroupId: 2,
      },
      {
        name: '12:50 - 13:40',
        startTime: '12:50',
        endTime: '13:40',
        timeSlotGroupId: 2,
      },
      {
        name: '13:40 - 14:30',
        startTime: '13:40',
        endTime: '14:30',
        timeSlotGroupId: 2,
      },
      {
        name: '14:30 - 15:20',
        startTime: '14:30',
        endTime: '15:20',
        timeSlotGroupId: 2,
      },
      {
        name: '15:20 - 16:10',
        startTime: '15:20',
        endTime: '16:10',
        timeSlotGroupId: 2,
      },
    ],
  });

  const generatedAcademicYearData = generateCurrentAcademicYear();
  await prisma.academicYear.create({
    data: {
      current: true,
      ...generatedAcademicYearData,
    },
  });

  await prisma.group.createMany({
    data: [
      {
        ref: 'sc_base_gp1_4',
        name: 'Siences de base gp1 4ème',
        subjectId: science.id,
        schoolLevelId: secondaire4.id,
      },
      {
        ref: 'sc_base_4',
        name: 'Siences de base gp2 4ème',
        subjectId: science.id,
        schoolLevelId: secondaire4.id,
      },
      {
        ref: 'sc_gen_4',
        name: 'Siences générales 4ème',
        subjectId: science.id,
        schoolLevelId: secondaire4.id,
      },
      {
        ref: 'sc_base_gp1_5',
        name: 'Siences de base gp1 5ème',
        subjectId: science.id,
        schoolLevelId: secondaire5.id,
      },
      {
        ref: 'sc_base_gp2_5',
        name: 'Siences de base gp2 5ème',
        subjectId: science.id,
        schoolLevelId: secondaire5.id,
      },
      {
        ref: 'sc_gen_5',
        name: 'Siences générales 5ème',
        subjectId: science.id,
        schoolLevelId: secondaire5.id,
      },
      {
        ref: 'sc_base_gp1_6',
        name: 'Siences de base gp1 6ème',
        subjectId: science.id,
        schoolLevelId: secondaire6.id,
      },
      {
        ref: 'sc_base_gp2_6',
        name: 'Siences de base gp2 6ème',
        subjectId: science.id,
        schoolLevelId: secondaire6.id,
      },
      {
        ref: 'sc_gen_6',
        name: 'Siences générales 6ème',
        subjectId: science.id,
        schoolLevelId: secondaire6.id,
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

  // bind students 5 to gp 1 and 6 to gp 2 across all school levels
  const gp1 = groups.filter(group => group.ref.includes('gp1'));
  const gp2 = groups.filter(group => group.ref.includes('gp2'));
  const students5 = await prisma.student.findMany({
    where: {
      classId: 15,
    },
  });
  const students6 = await prisma.student.findMany({
    where: {
      classId: 18,
    },
  });

  for (let i = 0; i < students5.length; i++) {
    await prisma.studentGroup.create({
      data: {
        studentId: students5[i].id,
        groupId: gp1[i % gp1.length].id,
      },
    });
  }

  for (let i = 0; i < students6.length; i++) {
    await prisma.studentGroup.create({
      data: {
        studentId: students6[i].id,
        groupId: gp2[i % gp2.length].id,
      },
    });
  }

  const timeSlots = await prisma.timeSlot.findMany();
  const academicYear = await prisma.academicYear.findFirst();

  if (!academicYear) {
    console.log(
      `${styleText('red', '⨯')} Academic year not found in the database`
    );
    process.exit(0);
  }
  if (!timeSlots.length) {
    console.log(
      `${styleText('red', '⨯')} Time slots not found in the database`
    );
    process.exit(0);
  }

  await prisma.$disconnect();
  console.log(`${styleText('green', '✓')} Seeded database for development`);
}
