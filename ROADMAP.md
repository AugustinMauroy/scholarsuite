# ScholarSuite Roadmap

## Introduction

ScholarSuite 1.0 est la première version de ScholarSuite, une application de gestion scolaire. Elle permet de gérer les utilisateurs, les niveaux scolaires, les classes, les élèves, les présences, les rapports disciplinaires et bien plus encore.

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

## Fonctionnalités

- [x] **Gestion des utilisateurs**

  - [x] Nom
  - [x] Prénom
  - [x] Email (optionnel)
  - [x] Mot de passe (hashé)
  - [x] Rôle (enseignant ou administrateur représenté par un entier)
  - [x] Etat (activé ou désactivé)
  - [x] Date de création (usage interne)
  - [x] Date de modification (usage interne)

- [x] **Gestion des niveaux scolaires**
      Représente les niveaux scolaires (primaire, secondaire, etc.)

  - [x] Nom
  - [x] Ordre, permettant de donner un ordre aux niveaux scolaires
  - [x] Date de création (usage interne)
  - [x] Date de modification (usage interne)

- [x] **Gestion des classes**
      Représente les classes (1a, 1b, 2a, 2b, etc...) d'un niveau scolaire.

  - [x] Nom
  - [x] Niveau scolaire
  - [x] Date de création (usage interne)
  - [x] Date de modification (usage interne)

- [x] **Gestion des élèves**

  - [x] Nom
  - [x] Prénom
  - [x] Date de naissance
  - [x] Classe
  - [x] Etat (activé ou désactivé)
  - [x] Date de création (usage interne)
  - [x] Date de modification (usage interne)

- [ ] **Gestion des matières**
      Représente les matières enseignées dans une classe (Ex: Mathématiques, Français, etc...).

  - [ ] Nom
  - [ ] Date de création (usage interne)
  - [ ] Date de modification (usage interne)

- [ ] **Gestion des notes**

  - [ ] Une valeur
  - [ ] Un élève
  - [ ] Une matière
  - [ ] Gestion du template de fichier CSV
  - [ ] Importation des notes depuis un fichier CSV
  - [ ] Interface utilisateur pour introduire les notes

- [x] **Gestion des présences**

  - [x] Elève
  - [x] Date (`date` date db type), seul le jour est pris en compte car l'heure dépend de la tranche horaire
  - [x] Utilisateur (enseignant, ou administrateur)
  - [x] Tranche horaire
  - [x] Traité (pour les éducateurs qui peuvent traiter les absences)
  - [x] Année scolaire
  - [x] Date de création (usage interne ou pour vérification de fraude)
  - [x] Date de modification (usage interne)

- [x] **Gestion des rapports disciplinaires**

  - [x] Elève
  - [x] Date (Représente la date de l'incident)
  - [x] Description
  - [x] Date de création (usage interne, ou pour vérification de fraude)
  - [x] Date de modification (usage interne)

- [x] **Gestion des tranches horaires**
      Représente les tranches horaires (h1, h2, h3, h4, etc...) d'une journée scolaire. Les tranches horaires sont utilisées pour les présences.

  - [x] Nom
  - [x] Heure de début
  - [x] Heure de fin
  - [x] Date de création (usage interne)
  - [x] Date de modification (usage interne)

- [ ] **Période de cote**
      Représente une période de cotation (trimestre, semestre, etc...).

  - [ ] Nom
  - [ ] Date de début
  - [ ] Date de fin
  - [ ] Date de création (usage interne)
  - [ ] Date de modification (usage interne)

- [ ] **Gestion des bulletins**

  - [ ] Génération de bulletins en format web ou pdf

- [ ] **Gestion des cours**
  <!--
  **Note**:
  Reste beaucoup de question sur sont utilité. Ca à été pensé pour évité par exemple qu'un enseignant ai à chercher dans plusieurs classes pour voir les élèves si il donne cours à plusieurs classes (cours de langue par exemple). Mais comment le gérer dans l'interface utilisateur, car accutellement l'enseignant peut naviguer entre les classes.

  Donc ne pas implémenter temps qu'on a pas une idée claire de son utilité.
  -->

  Représente les cours donnés par un ou plusieurs enseignants à un groupe d'élèves qui peuvent être dans une ou plusieurs classes.

  - [ ] Matière
  - [ ] Enseignant(s)
  - [ ] Elève(s)
  - [ ] Date de création (usage interne)
  - [ ] Date de modification (usage interne)

- [x] ** Gestion des années scolaires**
      Représente les années scolaires (2021-2022, 2022-2023, etc...).

  - [x] Nom
  - [x] Date de début
  - [x] Date de fin
  - [x] Date de création (usage interne)
  - [x] Date de modification (usage interne)

## Points techniques

- [x] Authentification
- [x] Base de données relationnelle
- [x] Internationalisation
- [ ] Design system et composants réutilisables
- [ ] Pas de code dupliqué
- [ ] API REST, qui peuvent être utilisées par des services tiers
- [x] Tests unitaires
- [ ] Tests d'intégration (E2E)
- [ ] Test visuel (Storybook)
- [ ] Documentation en markdown, pour les mainteneurs, les contributeurs et les utilisateurs
- [ ] Docker (à discuter)
- [ ] SSO (à discuter)

## Autres

- [x] L'application doit supporter le thème clair et sombre
- [ ] Gestion des emplois du temps (S'il y a une demande ou quelqu'un qui sait le développer)
- [ ] Utilisation d'envoi de mail pour la réinitialisation de mot de passe ou pour notifier d'événements telle qu'une absence non justifiée.
- [ ] Gestion des absences justifiées et non justifiées
