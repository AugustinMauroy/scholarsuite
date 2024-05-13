# ScholarSuite Prisma Documentation

> [!NOTE]
> Cette documentation est à destination des mainteneurs du projet ScholarSuite. Elle fournit des informations sur les modèles de données utilisés dans ScholarSuite et comment les gérer avec Prisma.


## Models

The data models used in ScholarSuite are as follows:

### 1. `Role`

- `ADMIN`: administrator role
- `MANAGER`: manager role
- `TEACHER`: teacher role

### 2. `PresenceState`

- `PRESENT`: present presence state
- `ABSENT`: absent presence state
- `LATE`: late presence state
- `EXCUSED`: excused presence state

### 3. `AcademicYear`

- `id`: unique identifier for the academic year
- `name`: name of the academic year
- `startDate`: start date of the academic year
- `endDate`: end date of the academic year
- `createdAt`: creation date of the academic year for internal use
- `updatedAt`: modification date of the academic year for internal use
- `archives`: indicates if the academic year is archived
- `courses`: relationship with the courses of the academic year
- `presences`: relationship with the presences of the academic year
- `gradePeriods`: relationship with the grading periods of the academic year

### 4. `SchoolLevel`

- `id`: unique identifier for the school level
- `name`: name of the school level
- `order`: order of the school levels
- `createdAt`: creation date of the school level for internal use
- `updatedAt`: modification date of the school level for internal use
- `classes`: relationship with the classes of the school level
- `timeSlots`: relationship with the time slots of the school level

### 5. `Subject`

- `id`: unique identifier for the subject
- `name`: name of the subject
- `createdAt`: creation date of the subject for internal use
- `updatedAt`: modification date of the subject for internal use
- `grades`: relationship with the grades of the subject
- `courses`: relationship with the courses of the subject

### 6. `User`

- `id`: unique identifier for the user
- `firstName`: first name of the user
- `lastName`: last name of the user
- `email`: optional email address of the user
- `password`: hashed password of the user
- `role`: role of the user (ADMIN, MANAGER, or TEACHER)
- `enabled`: state of the user (enabled or disabled)
- `createdAt`: creation date of the user for internal use
- `updatedAt`: modification date of the user for internal use
- `presences`: relationship with the presences of the user
- `disciplinaryReports`: relationship with the disciplinary reports of the user
- `courses`: relationship with the courses of the user
- `classUsers`: relationship with the classes of the user (teacher or administrator)

### 7. `Class`

- `id`: unique identifier for the class
- `name`: name of the class
- `schoolLevel`: relationship with the school level of the class
- `schoolLevelId`: identifier of the school level of the class
- `createdAt`: creation date of the class for internal use
- `updatedAt`: modification date of the class for internal use
- `students`: relationship with the students of the class
- `classUsers`: relationship with the users (teachers or administrators) of the class

### 8. `Student`

- `id`: unique identifier for the student
- `firstName`: first name of the student
- `lastName`: last name of the student
- `dateOfBirth`: date of birth of the student
- `class`: relationship with the class of the student
- `classId`: identifier of the class of the student
- `contactEmail`: contact email address of the student
- `enabled`: state of the student (enabled or disabled)
- `createdAt`: creation date of the student for internal use
- `updatedAt`: modification date of the student for internal use
- `grades`: relationship with the grades of the student
- `disciplinaryReports`: relationship with the disciplinary reports of the student
- `presences`: relationship with the presences of the student

### 9. `Grade`

- `id`: unique identifier for the grade
- `value`: value of the grade
- `student`: relationship with the student of the grade
- `studentId`: identifier of the student of the grade
- `subject`: relationship with the subject of the grade
- `subjectId`: identifier of the subject of the grade
- `gradePeriod`: relationship with the grading period of the grade
- `gradePeriodId`: identifier of the grading period of the grade
- `course`: relationship with the course of the grade
- `courseId`: identifier of the course of the grade
- `createdAt`: creation date of the grade for internal use
- `updatedAt`: modification date of the grade for internal use

### 10. `TimeSlot`

- `id`: unique identifier for the time slot
- `name`: optional name of the time slot
- `startTime`: start time of the time slot (in string format)
- `endTime`: end time of the time slot (in string format)
- `schoolLevel`: relationship with the school level of the time slot (optional)
- `schoolLevelId`: identifier of the school level of the time slot (optional)
- `createdAt`: creation date of the time slot for internal use
- `updatedAt`: modification date of the time slot for internal use
- `presences`: relationship with the presences of the time slot

### 11. `ClassUser`

- `id`: unique identifier for the user-class relationship
- `userId`: identifier of the user
- `classId`: identifier of the class
- `user`: relationship with the user
- `class`: relationship with the class

### 12. `Course`

- `id`: unique identifier for the course
- `name`: name of the course
- `description`: description of the course (optional)
- `subject`: relationship with the subject of the course
- `subjectId`: identifier of the subject of the course
- `teacher`: relationship with the teacher responsible for the course
- `teacherId`: identifier of the teacher responsible for the course
- `academicYear`: relationship with the academic year of the course
- `academicYearId`: identifier of the academic year of the course
- `createdAt`: creation date of the course for internal use
- `updatedAt`: modification date of the course for internal use
- `presences`: relationship with the presences of the course

### 13. `GradePeriod`

- `id`: unique identifier for the grading period
- `name`: name of the grading period
- `startDate`: start date of the grading period
- `endDate`: end date of the grading period
- `createdAt`: creation date of the grading period for internal use
- `updatedAt`: modification date of the grading period for internal use
- `grades`: relationship with the grades of the grading period
- `academicYears`: relationship with the academic years associated with the grading period

### 14. `GradePeriodAcademicYear`

- `id`: unique identifier for the grading period-academic year relationship
- `gradePeriodId`: identifier of the grading period
- `academicYearId`: identifier of the academic year
- `gradePeriod`: relationship with the grading period
- `academicYear`: relationship with the academic year

### 15. `Presence`

- `id`: unique identifier for the presence
- `student`: relationship with the student of the presence
- `studentId`: identifier of the student of the presence
- `state`: state of the presence (present, absent, etc.)
- `date`: date and time of the presence
- `user`: relationship with the user responsible for recording the presence
- `userId`: identifier of the user responsible for recording the presence
- `academicYear`: relationship with the academic year of the presence
- `academicYearId`: identifier of the academic year of the presence
- `timeSlot`: relationship with the time slot of the presence
- `timeSlotId`: identifier of the time slot of the presence
- `course`: relationship with the course of the presence
- `courseId`: identifier of the course of the presence
- `processed`: indicates if the presence has been processed

### 16. `DisciplinaryReport`

- `id`: unique identifier for the disciplinary report
- `student`: relationship with the student concerned by the disciplinary report
- `studentId`: identifier of the student concerned by the disciplinary report
- `createdById`: identifier of the user who created the disciplinary report
- `createdBy`: relationship with the user who created the disciplinary report
- `date`: date of the disciplinary report
- `description`: description of the disciplinary report
- `createdAt`: creation date of the disciplinary report for internal use
- `updatedAt`: modification date of the disciplinary report for internal use
