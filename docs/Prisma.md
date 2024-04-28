# ScholarSuite Prisma Documentation

## Modèles

ScholarSuite utilise Prisma pour gérer la couche d'accès aux données. Voici les modèles de données utilisés dans ScholarSuite :

### 1. `User`

La gestion des utilisateurs est une fonctionnalité clé de ScholarSuite. Un utilisateur peut être un enseignant ou un administrateur.

- Identifiant unique (`id`)
- Prénom (`firstName`)
- Nom (`lastName`)
- Adresse e-mail optionnelle (`email`)
- Mot de passe haché (`password`)
- Rôle (`role`) : entier représentant le rôle de l'utilisateur (enseignant ou administrateur)
- Dates de création et de mise à jour (`createdAt`, `updatedAt`) pour un usage interne

### 2. `SchoolLevel`

ScholarSuite permet de gérer les niveaux scolaires, qui sont des ensembles de classes.

- Identifiant unique (`id`)
- Nom (`name`)
- Dates de création et de mise à jour (`createdAt`, `updatedAt`) pour un usage interne
- Relation avec les classes (`classes`)

### 3. `Class`

La gestion des classes fait partie des fonctionnalités de ScholarSuite.

- Identifiant unique (`id`)
- Nom (`name`)
- Relation avec le niveau scolaire (`schoolLevel`) et son identifiant (`schoolLevelId`)
- Dates de création et de mise à jour (`createdAt`, `updatedAt`) pour un usage interne
- Relation avec les étudiants (`students`)

### 4. `Student`

ScholarSuite permet de gérer les élèves.

- Identifiant unique (`id`)
- Prénom (`firstName`)
- Nom (`lastName`)
- Date de naissance (`dateOfBirth`)
- Relation avec la classe (`class`) et son identifiant (`classId`)
- Dates de création et de mise à jour (`createdAt`, `updatedAt`) pour un usage interne
- Relation avec les notes (`grades`), les enregistrements de présence (`presences`) et les rapports disciplinaires (`disciplinaryReports`)

### 5. `Subject`

La gestion des matières est une fonctionnalité de ScholarSuite.

- Identifiant unique (`id`)
- Nom (`name`)
- Dates de création et de mise à jour (`createdAt`, `updatedAt`) pour un usage interne
- Relation avec les notes (`grades`) et les enregistrements de présence (`presences`)

### 6. `Grade`

ScholarSuite permet de gérer les notes des élèves.

- Identifiant unique (`id`)
- Valeur de la note (`value`)
- Relation avec l'élève (`student`) et son identifiant (`studentId`)
- Relation avec la matière (`subject`) et son identifiant (`subjectId`)
- Dates de création et de mise à jour (`createdAt`, `updatedAt`) pour un usage interne

### 7. Presence

La gestion des présences est une fonctionnalité clé de ScholarSuite.

- Identifiant unique (id)
- Relation avec l'élève (student) et son identifiant (studentId)
- Date et heure (datetime)
- Relation avec l'utilisateur responsable de l'enregistrement (user) et son identifiant (userId)
- Relation avec la matière (subject) et son identifiant (subjectId)
- Relation avec la tranche horaire (timeSlot) et son identifiant (timeSlotId)

### 8. `DisciplinaryReport`

ScholarSuite permet de gérer les rapports disciplinaires des élèves.

- Identifiant unique (`id`)
- Relation avec l'élève concerné (`student`) et son identifiant (`studentId`)
- Date du rapport (`date`)
- Description du rapport (`description`)
- Dates de création et de mise à jour (`createdAt`, `updatedAt`) pour un usage interne

### 9. TimeSlot

La gestion des tranches horaires est une fonctionnalité ajoutée à ScholarSuite.

- Identifiant unique (id)
- Heure de début (startTime)
- Heure de fin (endTime)
- Relation avec le niveau scolaire (schoolLevel) et son identifiant (schoolLevelId)
- Dates de création et de mise à jour (createdAt, updatedAt) pour un usage interne
- Relation avec les enregistrements de présence (Presence)
