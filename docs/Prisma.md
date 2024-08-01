# ScholarSuite Prisma Schema Documentation

> **Note:**
> This documentation is intended for ScholarSuite project maintainers. It provides information about the data models used in ScholarSuite and how to manage them with Prisma.

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
- `presences`: relationship with the presences of the academic year
- `gradePeriods`: relationship with the grading periods of the academic year

### 4. `SchoolLevel`

- `id`: unique identifier for the school level
- `name`: name of the school level
- `order`: order of the school levels
- `enabled`: indicates if the school level is enabled
- `createdAt`: creation date of the school level for internal use
- `updatedAt`: modification date of the school level for internal use
- `classes`: relationship with the classes of the school level
- `timeSlots`: relationship with the time slots of the school level
- `groups`: relationship with the groups of the school level

### 5. `Subject`

- `id`: unique identifier for the subject
- `name`: name of the subject
- `enabled`: indicates if the subject is enabled
- `createdAt`: creation date of the subject for internal use
- `updatedAt`: modification date of the subject for internal use
- `grades`: relationship with the grades of the subject
- `groups`: relationship with the groups of the subject

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
- `userClasses`: relationship with the classes of the user (teacher or administrator)
- `apiKeys`: relationship with the API keys of the user
- `userGroups`: relationship with the groups of the user

### 7. `Class`

- `id`: unique identifier for the class
- `name`: name of the class
- `schoolLevel`: relationship with the school level of the class
- `schoolLevelId`: identifier of the school level of the class
- `enabled`: indicates if the class is enabled
- `createdAt`: creation date of the class for internal use
- `updatedAt`: modification date of the class for internal use
- `students`: relationship with the students of the class
- `userClasses`: relationship with the users (teachers or administrators) of the class

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
- `studentGroups`: relationship with the groups of the student

### 9. `Grade`

- `id`: unique identifier for the grade
- `value`: value of the grade
- `student`: relationship with the student of the grade
- `studentId`: identifier of the student of the grade
- `subject`: relationship with the subject of the grade
- `subjectId`: identifier of the subject of the grade
- `gradePeriod`: relationship with the grading period of the grade
- `gradePeriodId`: identifier of the grading period of the grade
- `group`: relationship with the group of the grade
- `groupId`: identifier of the group of the grade
- `enabled`: indicates if the grade is enabled
- `createdAt`: creation date of the grade for internal use
- `updatedAt`: modification date of the grade for internal use

### 10. `TimeSlot`

- `id`: unique identifier for the time slot
- `name`: optional name of the time slot
- `startTime`: start time of the time slot (in string format)
- `endTime`: end time of the time slot (in string format)
- `schoolLevel`: relationship with the school level of the time slot (optional)
- `schoolLevelId`: identifier of the school level of the time slot (optional)
- `enabled`: indicates if the time slot is enabled
- `createdAt`: creation date of the time slot for internal use
- `updatedAt`: modification date of the time slot for internal use
- `presences`: relationship with the presences of the time slot

### 11. `Group`

- `id`: unique identifier for the group
- `name`: name of the group
- `subject`: relationship with the subject of the group
- `subjectId`: identifier of the subject of the group
- `schoolLevel`: relationship with the school level of the group
- `schoolLevelId`: identifier of the school level of the group
- `enabled`: indicates if the group is enabled
- `createdAt`: creation date of the group for internal use
- `updatedAt`: modification date of the group for internal use
- `studentGroups`: relationship with the students of the group
- `userGroups`: relationship with the users of the group

### 12. `GradePeriod`

- `id`: unique identifier for the grading period
- `name`: name of the grading period
- `startDate`: start date of the grading period
- `endDate`: end date of the grading period
- `enabled`: indicates if the grading period is enabled
- `createdAt`: creation date of the grading period for internal use
- `updatedAt`: modification date of the grading period for internal use
- `grades`: relationship with the grades of the grading period
- `academicYears`: relationship with the academic years associated with the grading period

### 13. `Presence`

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
- `group`: relationship with the group of the presence
- `groupId`: identifier of the group of the presence
- `processed`: indicates if the presence has been processed
- `notified`: indicates if the presence has been notified
- `createdAt`: creation date of the presence for internal use
- `updatedAt`: modification date of the presence for internal use

### 14. `DisciplinaryReport`

- `id`: unique identifier for the disciplinary report
- `student`: relationship with the student concerned by the disciplinary report
- `studentId`: identifier of the student concerned by the disciplinary report
- `createdById`: identifier of the user who created the disciplinary report
- `createdBy`: relationship with the user who created the disciplinary report
- `date`: date of the disciplinary report
- `description`: description of the disciplinary report
- `createdAt`: creation date of the disciplinary report for internal use
- `updatedAt`: modification date of the disciplinary report for internal use

### 15. `ApiKey`

- `id`: unique identifier for the API key
- `name`: name of the API key
- `key`: API key value
- `userId`: identifier of the user associated with the API key
- `expiresAt`: expiration date of the API key
- `enabled`: indicates if the API key is enabled
- `createdAt`: creation date of the API key for internal use
- `updatedAt`: modification date of the API key for internal use
- `user`: relationship with the user associated with the API key

### Many-to-Many Relationships

- `GradePeriodAcademicYear`: Many-to-many relationship between `GradePeriod` and `AcademicYear`
- `UserClass`: Many-to-many relationship between `User` and `Class`
- `UserGroup`: Many-to-many relationship between `User` and `Group`
- `StudentGroup`: Many-to-many relationship between `Student` and `Group`
