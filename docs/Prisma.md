# ScholarSuite Prisma Schema Documentation

> [!NOTE]
> This documentation is intended for ScholarSuite project maintainers. It provides information about the data models used in ScholarSuite and how to manage them with Prisma.

## Models

The data models used in ScholarSuite are as follows:

### 1. `Role`

- `ADMIN`: administrator role
- `MANAGER`: manager role
- `TEACHER`: teacher role

### 2. `AttendanceState`

- `PRESENT`: present attendance state
- `ABSENT`: absent attendance state
- `LATE`: late attendance state
- `EXCUSED`: excused attendance state

### 3. `AbsencePeriodStatus`

- `PENDING`: pending absence period status
- `JUSTIFIED`: justified absence period status
- `UNJUSTIFIED`: unjustified absence period status

### 4. `AbsencePeriod`

- `id`: unique identifier for the absence period
- `studentId`: identifier of the student for the absence period
- `firstAbsenceID`: identifier of the first absence in the period
- `lastAbsenceId`: identifier of the last absence in the period
- `nextPresenceId`: optional identifier of the next presence
- `academicYearId`: identifier of the academic year for the absence period
- `status`: status of the absence period
- `justifyFromDate`: optional start date for justification
- `justifyToDate`: optional end date for justification
- `justifyFromTimeSlot`: optional identifier of the start time slot for justification
- `justifyToTimeSlot`: optional identifier of the end time slot for justification
- `enabled`: indicates if the absence period is enabled (default: true)
- `createdAt`: creation date of the absence period for internal use
- `updatedAt`: modification date of the absence period for internal use
- `Student`: relationship with the student of the absence period
- `AcademicYear`: relationship with the academic year of the absence period
- `FirstAbsence`: relationship with the first absence in the period
- `LastAbsence`: relationship with the last absence in the period
- `NextPresence`: optional relationship with the next presence
- `Comments`: relationship with the comments of the absence period

### 5. `AbsencePeriodComment`

- `id`: unique identifier for the absence period comment
- `userId`: identifier of the user who made the comment
- `absencePeriodId`: identifier of the absence period for the comment
- `comment`: comment text
- `createdAt`: creation date of the absence period comment for internal use
- `updatedAt`: modification date of the absence period comment for internal use
- `User`: relationship with the user who made the comment
- `AbsencePeriod`: relationship with the absence period for the comment

### 6. `AcademicYear`

- `id`: unique identifier for the academic year
- `name`: name of the academic year
- `startDate`: start date of the academic year
- `endDate`: end date of the academic year
- `archives`: indicates if the academic year is archived (default: false)
- `createdAt`: creation date of the academic year for internal use
- `updatedAt`: modification date of the academic year for internal use
- `Attendance`: relationship with the attendance records of the academic year
- `GradePeriods`: relationship with the grading periods of the academic year
- `AttendanceAudit`: relationship with the attendance audits of the academic year
- `AbsencePeriod`: relationship with the absence periods of the academic year

### 7. `SchoolLevel`

- `id`: unique identifier for the school level
- `name`: name of the school level
- `order`: order of the school levels
- `enabled`: indicates if the school level is enabled (default: true)
- `createdAt`: creation date of the school level for internal use
- `updatedAt`: modification date of the school level for internal use
- `Classes`: relationship with the classes of the school level
- `TimeSlot`: relationship with the time slots of the school level
- `Group`: relationship with the groups of the school level

### 8. `Subject`

- `id`: unique identifier for the subject
- `name`: name of the subject
- `enabled`: indicates if the subject is enabled (default: true)
- `createdAt`: creation date of the subject for internal use
- `updatedAt`: modification date of the subject for internal use
- `Grades`: relationship with the grades of the subject
- `Group`: relationship with the groups of the subject

### 9. `User`

- `id`: unique identifier for the user
- `firstName`: first name of the user
- `lastName`: last name of the user
- `email`: optional email address of the user
- `password`: hashed password of the user
- `enabled`: state of the user (enabled or disabled) (default: true)
- `role`: role of the user (ADMIN, MANAGER, or TEACHER)
- `createdAt`: creation date of the user for internal use
- `updatedAt`: modification date of the user for internal use
- `Attendance`: relationship with the attendance records of the user
- `DisciplinaryReport`: relationship with the disciplinary reports of the user
- `UserClass`: relationship with the classes of the user (teacher or administrator)
- `ApiKey`: relationship with the API keys of the user
- `UserGroup`: relationship with the groups of the user
- `AttendanceAuditBy`: relationship with the attendance audits made by the user
- `AttendanceAuditUser`: relationship with the attendance audits for the user
- `AbsencePeriodComment`: relationship with the comments of the absence periods of the user

### 10. `Class`

- `id`: unique identifier for the class
- `name`: name of the class
- `schoolLevelId`: identifier of the school level of the class
- `enabled`: indicates if the class is enabled (default: true)
- `createdAt`: creation date of the class for internal use
- `updatedAt`: modification date of the class for internal use
- `SchoolLevel`: relationship with the school level of the class
- `Students`: relationship with the students of the class
- `UserClasss`: relationship with the users (teachers or administrators) of the class

### 11. `Student`

- `id`: unique identifier for the student
- `firstName`: first name of the student
- `lastName`: last name of the student
- `dateOfBirth`: date of birth of the student
- `classId`: identifier of the class of the student
- `contactEmail`: contact email address of the student
- `enabled`: state of the student (enabled or disabled) (default: true)
- `createdAt`: creation date of the student for internal use
- `updatedAt`: modification date of the student for internal use
- `Class`: relationship with the class of the student
- `Grades`: relationship with the grades of the student
- `DisciplinaryReports`: relationship with the disciplinary reports of the student
- `Attendance`: relationship with the attendance records of the student
- `StudentGroup`: relationship with the groups of the student
- `AbsencePeriod`: relationship with the absence periods of the student

### 12. `Grade`

- `id`: unique identifier for the grade
- `value`: value of the grade
- `studentId`: identifier of the student of the grade
- `subjectId`: identifier of the subject of the grade
- `gradePeriodId`: identifier of the grading period of the grade
- `groupId`: identifier of the group of the grade
- `enabled`: indicates if the grade is enabled (default: true)
- `createdAt`: creation date of the grade for internal use
- `updatedAt`: modification date of the grade for internal use
- `Student`: relationship with the student of the grade
- `Subject`: relationship with the subject of the grade
- `GradePeriod`: relationship with the grading period of the grade

### 13. `TimeSlot`

- `id`: unique identifier for the time slot
- `name`: optional name of the time slot
- `startTime`: start time of the time slot (in string format)
- `endTime`: end time of the time slot (in string format)
- `schoolLevelId`: optional identifier of the school level of the time slot
- `enabled`: indicates if the time slot is enabled (default: true)
- `createdAt`: creation date of the time slot for internal use
- `updatedAt`: modification date of the time slot for internal use
- `SchoolLevel`: optional relationship with the school level of the time slot
- `Attendance`: relationship with the attendance records of the time slot
- `AttendanceAudit`: relationship with the attendance audits of the time slot

### 14. `Group`

- `id`: unique identifier for the group
- `ref`: reference of the group
- `name`: optional name of the group
- `subjectId`: identifier of the subject of the group
- `schoolLevelId`: optional identifier of the school level of the group
- `enabled`: indicates if the group is enabled (default: true)
- `createdAt`: creation date of the group for internal use
- `updatedAt`: modification date of the group for internal use
- `Subject`: relationship with the subject of the group
- `StudentGroup`: relationship with the students of the group
- `UserGroup`: relationship with the users of the group
- `SchoolLevel`: optional relationship with the school level of the group
- `Attendance`: relationship with the attendance records of the group

### 15. `GradePeriod`

- `id`: unique identifier for the grading period
- `name`: name of the grading period
- `startDate`: start date of the grading period
- `endDate`: end date of the grading period
- `enabled`: indicates if the grading period is enabled (default: true)
- `createdAt`: creation date of the grading period for internal use
- `updatedAt`: modification date of the grading period for internal use
- `Grades`: relationship with the grades of the grading period
- `AcademicYears`: relationship with the academic years associated with the grading period

### 16. `Attendance`

- `id`: unique identifier for the attendance record
- `studentId`: identifier of the student of the attendance record
- `state`: state of the attendance record (present, absent, etc.)
- `date`: date and time of the attendance record
- `userId`: identifier of the user responsible for recording the attendance
- `academicYearId`: identifier of the academic year of the attendance record
- `timeSlotId`: identifier of the time slot of the attendance record
- `groupId`: identifier of the group of the attendance record
- `processed`: indicates if the attendance record has been processed (default: false)
- `notified`: indicates if the attendance record has been notified (default: false)
- `createdAt`: creation date of the attendance record for internal use
- `updatedAt`: modification date of the attendance record for internal use
- `User`: relationship with the user responsible for recording the attendance
- `Student`: relationship with the student of the attendance record
- `AcademicYear`: relationship with the academic year of the attendance record
- `TimeSlot`: relationship with the time slot of the attendance record
- `Group`: relationship with the group of the attendance record
- `AttendanceAudit`: relationship with the attendance audits of the attendance record
- `FirstAbsence`: relationship with the first absence in the period
- `LastAbsence`: relationship with the last absence in the period
- `NextPresence`: optional relationship with the next presence

### 17. `AttendanceAudit`

- `id`: unique identifier for the attendance audit
- `attendanceId`: identifier of the attendance record for the audit
- `state`: state of the attendance record (present, absent, etc.)
- `date`: date and time of the attendance record
- `userId`: identifier of the user responsible for recording the attendance
- `academicYearId`: identifier of the academic year of the attendance record
- `timeSlotId`: identifier of the time slot of the attendance record
- `processed`: indicates if the attendance record has been processed
- `notified`: indicates if the attendance record has been notified
- `changedBy`: identifier of the user who made the change
- `changedAt`: date and time of the change
- `Attendance`: relationship with the attendance record for the audit
- `AcademicYear`: relationship with the academic year of the attendance record
- `TimeSlot`: relationship with the time slot of the attendance record
- `ChangedByUser`: relationship with the user who made the change
- `User`: relationship with the user responsible for recording the attendance

### 18. `DisciplinaryReport`

- `id`: unique identifier for the disciplinary report
- `studentId`: identifier of the student concerned by the disciplinary report
- `createdById`: identifier of the user who created the disciplinary report
- `date`: date of the disciplinary report
- `description`: description of the disciplinary report
- `createdAt`: creation date of the disciplinary report for internal use
- `updatedAt`: modification date of the disciplinary report for internal use
- `CreatedBy`: relationship with the user who created the disciplinary report
- `Student`: relationship with the student concerned by the disciplinary report

### 19. `ApiKey`

- `id`: unique identifier for the API key
- `name`: name of the API key
- `key`: API key value
- `userId`: identifier of the user associated with the API key
- `expiresAt`: expiration date of the API key
- `enabled`: indicates if the API key is enabled (default: true)
- `createdAt`: creation date of the API key for internal use
- `updatedAt`: modification date of the API key for internal use
- `User`: relationship with the user associated with the API key

### Many-to-Many Relationships

- `GradePeriodAcademicYear`: Many-to-many relationship between `GradePeriod` and `AcademicYear`
- `UserClass`: Many-to-many relationship between `User` and `Class`
- `UserGroup`: Many-to-many relationship between `User` and `Group`
- `StudentGroup`: Many-to-many relationship between `Student` and `Group`
