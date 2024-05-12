# ScholarSuite Prisma Documentation

> [!NOTE]
> Cette documentation est à destination des mainteneurs du projet ScholarSuite. Elle fournit des informations sur les modèles de données utilisés dans ScholarSuite et comment les gérer avec Prisma.

## Modèles

Les modèles de données utilisés dans ScholarSuite sont les suivants :

### 1. `Role`

- `ADMIN` : rôle administrateur
- `MANAGER` : rôle gestionnaire
- `TEACHER` : rôle enseignant

### 2. `PresenceState`

- `PRESENT` : état de présence présent
- `ABSENT` : état de présence absent
- `LATE` : état de présence en retard
- `EXCUSED` : état de présence excusé

### 3. `AcademicYear`

- `id` : identifiant unique de l'année scolaire
- `name` : nom de l'année scolaire
- `startDate` : date de début de l'année scolaire
- `endDate` : date de fin de l'année scolaire
- `createdAt` : date de création de l'année scolaire pour un usage interne
- `updatedAt` : date de modification de l'année scolaire pour un usage interne
- `archives` : indique si l'année scolaire est archivée
- `courses` : relation avec les cours de l'année scolaire
- `presences` : relation avec les présences de l'année scolaire
- `gradePeriods` : relation avec les périodes de cotation de l'année scolaire

### 4. `SchoolLevel`

- `id` : identifiant unique du niveau scolaire
- `name` : nom du niveau scolaire
- `order` : ordre des niveaux scolaires
- `createdAt` : date de création du niveau scolaire pour un usage interne
- `updatedAt` : date de modification du niveau scolaire pour un usage interne
- `classes` : relation avec les classes du niveau scolaire
- `timeSlots` : relation avec les tranches horaires du niveau scolaire

### 5. `Subject`

- `id` : identifiant unique de la matière
- `name` : nom de la matière
- `createdAt` : date de création de la matière pour un usage interne
- `updatedAt` : date de modification de la matière pour un usage interne
- `grades` : relation avec les notes de la matière
- `courses` : relation avec les cours de la matière

### 6. `User`

- `id` : identifiant unique de l'utilisateur
- `firstName` : prénom de l'utilisateur
- `lastName` : nom de l'utilisateur
- `email` : adresse e-mail optionnelle de l'utilisateur
- `password` : mot de passe haché de l'utilisateur
- `role` : rôle de l'utilisateur (ADMIN, MANAGER ou TEACHER)
- `enabled` : état de l'utilisateur (activé ou désactivé)
- `createdAt` : date de création de l'utilisateur pour un usage interne
- `updatedAt` : date de modification de l'utilisateur pour un usage interne
- `presences` : relation avec les présences de l'utilisateur
- `disciplinaryReports` : relation avec les rapports disciplinaires de l'utilisateur
- `courses` : relation avec les cours de l'utilisateur
- `classUsers` : relation avec les classes de l'utilisateur (enseignant ou administrateur)

### 7. `Class`

- `id` : identifiant unique de la classe
- `name` : nom de la classe
- `schoolLevel` : relation avec le niveau scolaire de la classe
- `schoolLevelId` : identifiant du niveau scolaire de la classe
- `createdAt` : date de création de la classe pour un usage interne
- `updatedAt` : date de modification de la classe pour un usage interne
- `students` : relation avec les élèves de la classe
- `classUsers` : relation avec les utilisateurs (enseignants ou administrateurs) de la classe

### 8. `Student`

- `id` : identifiant unique de l'élève
- `firstName` : prénom de l'élève
- `lastName` : nom de l'élève
- `dateOfBirth` : date de naissance de l'élève
- `class` : relation avec la classe de l'élève
- `classId` : identifiant de la classe de l'élève
- `contactEmail` : adresse e-mail de contact de l'élève
- `enabled` : état de l'élève (activé ou désactivé)
- `createdAt` : date de création de l'élève pour un usage interne
- `updatedAt` : date de modification de l'élève pour un usage interne
- `grades` : relation avec les notes de l'élève
- `disciplinaryReports` : relation avec les rapports disciplinaires de l'élève
- `presences` : relation avec les présences de l'élève

### 9. `Grade`

- `id` : identifiant unique de la note
- `value` : valeur de la note
- `student` : relation avec l'élève de la note
- `studentId` : identifiant de l'élève de la note
- `subject` : relation avec la matière de la note
- `subjectId` : identifiant de la matière de la note
- `gradePeriod` : relation avec la période de cotation de la note
- `gradePeriodId` : identifiant de la période de cotation de la note
- `createdAt` : date de création de la note pour un usage interne
- `updatedAt` : date de modification de la note pour un usage interne

### 10. `TimeSlot`

- `id` : identifiant unique de la tranche horaire
- `name` : nom optionnel de la tranche horaire
- `startTime` : heure de début de la tranche horaire (au format chaîne de caractères)
- `endTime` : heure de fin de la tranche horaire (au format chaîne de caractères)
- `createdAt` : date de création de la tranche horaire pour un usage interne
- `updatedAt` : date de modification de la tranche horaire pour un usage interne
- `schoolLevel` : relation avec le niveau scolaire de la tranche horaire (optionnel)
- `schoolLevelId` : identifiant du niveau scolaire de la tranche horaire (optionnel)
- `presences` : relation avec les présences de la tranche horaire

### 11. `ClassUser`

- `id` : identifiant unique de la relation utilisateur-classe
- `userId` : identifiant de l'utilisateur
- `classId` : identifiant de la classe
- `user` : relation avec l'utilisateur
- `class` : relation avec la classe

### 12. `Course`

- `id` : identifiant unique du cours
- `name` : nom du cours
- `description` : description du cours (optionnel)
- `subject` : relation avec la matière du cours
- `subjectId` : identifiant de la matière du cours
- `teacher` : relation avec l'enseignant responsable du cours
- `teacherId` : identifiant de l'enseignant responsable du cours
- `academicYear` : relation avec l'année scolaire du cours
- `academicYearId` : identifiant de l'année scolaire du cours
- `createdAt` : date de création du cours pour un usage interne
- `updatedAt` : date de modification du cours pour un usage interne

### 13. `GradePeriod`

- `id` : identifiant unique de la période de cotation
- `name` : nom de la période de cotation
- `startDate` : date de début de la période de cotation
- `endDate` : date de fin de la période de cotation
- `createdAt` : date de création de la période de cotation pour un usage interne
- `updatedAt` : date de modification de la période de cotation pour un usage interne
- `grades` : relation avec les notes de la période de cotation
- `academicYears` : relation avec les années scolaires associées à la période de cotation

### 14. `GradePeriodAcademicYear`

- `id` : identifiant unique de la relation période de cotation-année scolaire
- `gradePeriodId` : identifiant de la période de cotation
- `academicYearId` : identifiant de l'année scolaire
- `gradePeriod` : relation avec la période de cotation
- `academicYear` : relation avec l'année scolaire

### 15. `Presence`

- `id` : identifiant unique de la présence
- `student` : relation avec l'élève de la présence
- `studentId` : identifiant de l'élève de la présence
- `state` : état de la présence (présent, absent, etc.)
- `date` : date et heure de la présence
- `user` : relation avec l'utilisateur responsable de l'enregistrement de la présence
- `userId` : identifiant de l'utilisateur responsable de l'enregistrement de la présence
- `academicYear` : relation avec l'année scolaire de la présence
- `academicYearId` : identifiant de l'année scolaire de la présence
- `timeSlot` : relation avec la tranche horaire de la présence
- `timeSlotId` : identifiant de la tranche horaire de la présence
- `processed` : indique si la présence a été traitée

### 16. `DisciplinaryReport`

- `id` : identifiant unique du rapport disciplinaire
- `student` : relation avec l'élève concerné par le rapport disciplinaire
- `studentId` : identifiant de l'élève concerné par le rapport disciplinaire
- `createdById` : identifiant de l'utilisateur ayant créé le rapport disciplinaire
- `createdBy` : relation avec l'utilisateur ayant créé le rapport disciplinaire
- `date` : date du rapport disciplinaire
- `description` : description du rapport disciplinaire
- `createdAt` : date de création du rapport disciplinaire pour un usage interne
- `updatedAt` : date de modification du rapport disciplinaire pour un usage interne
