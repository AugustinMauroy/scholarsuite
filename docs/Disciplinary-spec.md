# Disciplinary Report Management

## Introduction

Disciplinary report management allows teachers and administrators to document disciplinary incidents involving students. This document describes the specifications and workflow for managing disciplinary reports in ScholarSuite.

## Specifications

### Fields of the Disciplinary Report

1. **Student**: Identifier of the student involved.
2. **Date**: Date of the incident.
3. **Description**: Detailed description of the incident.
4. **Group**: Group in which the incident occurred.
5. **Creation Date**: Date of report creation (for internal use or fraud verification).
6. **Modification Date**: Date of the last modification of the report (for internal use).

### Report Status

1. **Pending**: The report has been created but has not yet been processed.
2. **In Progress**: The report is being processed by an administrator.
3. **Completed**: The report has been processed and appropriate measures have been taken.

### Roles and Permissions

- **Teacher**: Can create and modify disciplinary reports for students in their classes.
- **Administrator**: Can create, modify, and process all disciplinary reports.

## User Workflow

### Creating a Disciplinary Report (Teacher)

1. The teacher accesses the "Disciplinary Reports" section in the application.
2. They select the student involved in the incident.
3. They enter the date of the incident.
4. They select the group in which the incident occurred.
5. They write a detailed description of the incident.
6. They submit the report, which is automatically saved with the status "Pending".

### Processing the Report (Administrator)

1. The administrator accesses the "Disciplinary Reports" section and sees the list of pending reports.
2. They select a report to process.
3. They can add additional comments or notes.
4. They change the report status to "In Progress".
5. Once appropriate measures have been taken (e.g., a discussion with the student, a sanction, etc.), the administrator changes the report status to "Completed".

### Tracking and History

1. Teachers and administrators can view the history of disciplinary reports for a given student.
2. They can see the details of each report, including comments and measures taken.

### Notifying Parents (Optional)

1. If the application includes a parent notification feature, an email can be sent to the student's parents to inform them of the incident and the measures taken.

## User Interface

### Report Creation Page

- **Form**: Fields for Student, Date, Group, Description.
- **Submit Button**: To save the report.

### Report List Page

- **Table**: Columns for Student, Date, Group, Description, Status.
- **Filters**: To display reports by status (Pending, In Progress, Completed).

### Report Details Page

- **Details Display**: Student, Date, Group, Description, Status.
- **Comments Section**: To add additional comments or notes.
- **Status Change Buttons**: In Progress, Completed.

## URLs for Pages

To ensure a smooth user experience and efficient navigation, the following URLs should be implemented for the disciplinary report management system in ScholarSuite:

1. **Report Creation Page**: `/disciplinary-reports/create`

   - This page allows teachers to create new disciplinary reports.

2. **Report List Page**: `/disciplinary-reports`

   - This page displays a list of all disciplinary reports, with filters to view reports by status (Pending, In Progress, Completed).

3. **Report Details Page**: `/disciplinary-reports/[reportId]`

   - This page shows the details of a specific disciplinary report, including the ability to add comments and change the report status.

4. **Student History Page**: `/students/[studentId]/disciplinary-reports`
   - This page displays the history of disciplinary reports for a specific student, allowing teachers and administrators to track incidents over time.
