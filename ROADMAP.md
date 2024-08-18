# ScholarSuite Roadmap

## Introduction

ScholarSuite 1.0 is a school management application that allows for managing users, school levels, classes, students, attendance, disciplinary reports, and more.

## Technologies

- [react](https://reactjs.org/)
- [tailwindcss](https://tailwindcss.com/)
- [typescript](https://www.typescriptlang.org/)
- [nextjs](https://nextjs.org/)
- [next-auth](https://next-auth.js.org/)
- [prisma](https://www.prisma.io/)
- [nodejs](https://nodejs.org/)
- [storybook](https://storybook.js.org/)
- [react-pdf](https://react-pdf.org/)
- [react-pdf-tailwind](https://www.npmjs.com/package/react-pdf-tailwind)
- [nodemailer](https://nodemailer.com/)
- [react-email](https://nodemailer.com)
- [postgreSQL](https://www.postgresql.org/)

## Features

- [x] **User management**
  - [x] First name
  - [x] Last name
  - [x] Email (optional)
  - [x] Password (hashed)
  - [x] Role (teacher or administrator represented by an integer)
  - [x] State (enabled or disabled)
  - [x] Creation date (internal use)
  - [x] Modification date (internal use)
- [x] **School level management**
      Represents school levels (primary, secondary, etc.)
  - [x] Name
  - [x] Order, allowing to give an order to the school levels
  - [x] Creation date (internal use)
  - [x] Modification date (internal use)
- [x] **Class management**
      Represents classes (1a, 1b, 2a, 2b, etc...) of a school level.
  - [x] Name
  - [x] School level
  - [x] Creation date (internal use)
  - [x] Modification date (internal use)
- [x] **Student management**
  - [x] First name
  - [x] Last name
  - [x] Date of birth
  - [x] Class
  - [x] Contact email
  - [x] State (enabled or disabled)
  - [x] Creation date (internal use)
  - [x] Modification date (internal use)
- [x] **Subject management**
      Represents the subjects taught in a class (Ex: Mathematics, French, etc...).
  - [x] Name
  - [x] Creation date (internal use)
  - [x] Modification date (internal use)
- [ ] **Grade management**
  - [ ] A value
  - [ ] A student
  - [ ] A subject
  - [ ] A grade period
  - [ ] A group
  - [ ] CSV file template management
  - [ ] Importing grades from a CSV file
  - [ ] User interface for entering grades
- [x] **Attendance management**
  - [x] Student
  - [x] Date (`date` date db type), only the day is taken into account because the time depends on the time slot
  - [x] User (teacher, or administrator)
  - [x] Time slot
  - [x] Group
  - [x] Treated (for educators who can process absences)
  - [x] School year
  - [x] Creation date (internal use or for fraud verification)
  - [x] Modification date (internal use)
- [x] **Disciplinary report management**
  - [x] Student
  - [x] Date (Represents the date of the incident)
  - [x] Description
  - [x] Creation date (internal use, or for fraud verification)
  - [x] Modification date (internal use)
- [x] **Time slot management**
      Represents time slots (h1, h2, h3, h4, etc...) of a school day. Time slots are used for attendance.
  - [x] Name
  - [x] Start time
  - [x] End time
  - [x] School level (optional)
  - [x] Creation date (internal use)
  - [x] Modification date (internal use)
- [ ] **Grading period management**
      Represents a grading period (trimester, semester, etc...).
  - [ ] Name
  - [ ] Start date
  - [ ] End date
  - [ ] Academic year(s)
  - [ ] Creation date (internal use)
  - [ ] Modification date (internal use)
- [ ] **Report card management**
  - [ ] Generation of report cards in web or pdf format
- [x] **Group management**
      Represents the groups of students (Ex: Group A, Group B, etc...).
  - [x] Name
  - [x] Subject
  - [x] User(s)
  - [x] Student(s)
  - [x] School level (optional)
  - [x] Creation date (internal use)
  - [x] Modification date (internal use)
- [x] **School year management**
      Represents school years (2021-2022, 2022-2023, etc...).
  - [x] Name
  - [x] Start date
  - [x] End date
  - [x] Archived (boolean)
  - [x] Creation date (internal use)
  - [x] Modification date (internal use)
- [x] **API Key management**
  - [x] Name
  - [x] Key (unique)
  - [x] User
  - [x] Expiration date
  - [x] Creation date (internal use)
  - [x] Modification date (internal use)
- [x] \*_Many-to-Many relations_
  - [x] Between User and Class
  - [x] Between User and Group
  - [x] Between Student and Group

## Technical points

- [x] Authentication
- [x] Relational database
- [x] Internationalization
- [ ] Design system and reusable components
- [ ] No duplicated code
- [ ] REST API, which can be used by third-party services
- [x] Unit tests
- [ ] Integration tests (E2E)
- [ ] Visual testing (Storybook)
- [ ] Markdown documentation, for maintainers, contributors and users
- [ ] Docker (to be discussed)
- [ ] SSO (to be discussed)

## Others

- [x] The application must support light and dark theme
- [ ] Schedule management (If there is a demand or someone who knows how to develop it)
- [ ] Use of email sending for password reset or to notify of events such as an unjustified absence.
- [ ] Management of justified and unjustified absences
