# ScholarSuite Roadmap

## ScholarSuite 1.0

ScholarSuite 1.0 est la première version de ScholarSuite. Elle est une application de gestion scolaire. Elle permet de gérer les utilisateurs, les niveaux scolaires, les classes, les élèves, les présences et les rapports disciplinaires.

## Fonctionnalités

- [ ] Gestion des utilisateurs
      Il faut que l'application permette de gérer les utilisateurs. Un utilisateur peut être un enseignant ou un administrateur. Un utilisateur peut avoir une photo de profil qui n'est pas stockée dans la base de données.
      Voci les éléments d'un utilisateur:
  - [x] Nom
  - [x] Prénom
  - [x] Email (optionnel)
  - [x] Mot de passe (hashé)
  - [x] Rôle (enseignant ou administrateur représenté par un entier)
  - [ ] Etat (activé ou désactivé)
  - [x] Date de création (usage interne)
  - [x] Date de modification (usage interne)
- [ ] Gestion des niveau scolaire
      Il faut que l'application permette de gérer les niveaux scolaires. Un niveau scolaire est un ensemble de classes. Un niveau scolaire est défini par:
  - [x] Nom
  - [ ] Ordre, premettant de donné un ordre aux niveaux scolaires
  - [x] Date de création (usage interne)
  - [x] Date de modification (usage interne)
- [x] gestion des classes
      Il faut que l'application permette de gérer les classes. Une classe est définie par:
  - [x] Nom
  - [x] Niveau scolaire
  - [x] Date de création (usage interne)
  - [x] Date de modification (usage interne)
- [ ] Gestion des élèves
      Il faut que l'application permette de gérer les élèves. Un élève est défini par:
  - [x] Nom
  - [x] Prénom
  - [x] Date de naissance
  - [x] Classe
  - [ ] Etat (activé ou désactivé)
  - [x] Date de création (usage interne)
  - [x] Date de modification (usage interne)
- [ ] Gestion des matières
      Il faut que l'application permette de gérer les matières. Une matière est définie par:
  - [ ] Nom
  - [ ] Date de création (usage interne)
  - [ ] Date de modification (usage interne)
- [ ] Gestion des notes :
      Les notes peuvent être introduites dans l'application grâce à une interface utilisateur. Ou bien, elles peuvent être importées depuis un fichier CSV dont le template peut être fourni.
  - [ ] Gestion du template de fichier CSV:
    - Nom prénom élève
    - Valeur note
  - [ ] Importation des notes depuis un fichier CSV
  - [ ] Interface utilisateur pour introduire les notes

  La note est définie par:
    - [ ] Un identifiant
    - [ ] Une valeur
    - [ ] Un élève
    - [ ] Une matière
- [ ] Gestion des présences
      Il faut que l'application permette de gérer les présences. Une présence est définie par:
  - [x] Elève
  - [x] Date/heure
  - [x] Utilisateur (enseignant, ou administrateur)
  - [ ] Date de création (usage interne ou pour verification de fraude)
  - [ ] Date de modification (usage interne)
- [x] Gestion des rapports disciplinaires
      Il faut que l'application permette de gérer les rapports disciplinaires. Un rapport disciplinaire est défini par:
  - [x] Elève
  - [x] Date
  - [x] Description
  - [x] Date de création (usage interne)
  - [x] Date de modification (usage interne)
- [x] Gestion des tranches horaires
      Il faut que l'application permette de gérer les tranches horaires. Une tranche horaire est définie par:
  - [x] Nom
  - [x] Heure de début
  - [x] Heure de fin
  - [x] Date de création (usage interne)
  - [x] Date de modification (usage interne)
- [ ] Période de cote
      Il faut que l'application permette de gérer les périodes de cote. Une période de cote est définie par:
  - [ ] Nom
  - [ ] Date de début
  - [ ] Date de fin
  - [ ] Date de création (usage interne)
  - [ ] Date de modification (usage interne)
- [ ] Gestion des bulletins
  Il faut que l'application permette de générer des bulletins. Ils peuvent être générés en format web ou pdf.
- [ ] Gestion des cours
      Il faut que l'application permette de gérer les cours.
      Un cours est défini par:
  - [ ] Matière
  - [ ] Enseignant(s)
  - [ ] Elève(s)
  - [ ] Date de création (usage interne)
  - [ ] Date de modification (usage interne)

## Points techniques

- [ ] Avoir un semblant de design system
- [ ] Faire des composant réutilisable
- [ ] Ne pas avoir de code dupliqué. Si un code est dupliqué, il faut le factoriser.
- [x] Authentification
      Il faut que l'application permette de s'authentifier. L'authentification se fait par email et mot de passe
- [ ] API REST pour pouvoir plugger l'application à d'autres services.
- [x] Base de données
      Il faut que l'application utilise une base de données pour stocker les données. La base de données doit être relationnelle.
- [ ] Tests unitaires
- [ ] Tests d'intégration (E2E)
- [ ] Test visuel
- [ ] Documentation
      Il faut que l'application soit documentée. La documentation doit être écrite en markdown.
- [x] Internationalisation
      Il faut que l'application soit internationalisée. La langue par défaut est le français ou défini par un configuration.
- [ ] Docker (à discuter)
- [ ] SSO avec

## Technologies

- [react](https://reactjs.org/) est une bibliothèque JavaScript pour construire des interfaces utilisateur.
- [tailwindcss](https://tailwindcss.com/) est un framework CSS pour construire des interfaces utilisateur.
- [typescript](https://www.typescriptlang.org/) est un langage de programmation qui ajoute des fonctionnalités à JavaScript.
- [nextjs](https://nextjs.org/) est un framework React pour construire des applications web. Il permet de générer des pages statiques ou dynamiques mais aussi de gérer le routage et encore les api
- [next-auth](https://next-auth.js.org/) est une bibliothèque pour gérer l'authentification dans une application Next.js
- [prisma](https://www.prisma.io/) est un ORM pour Node.js et TypeScript
- [nodejs](https://nodejs.org/) est un environnement d'exécution JavaScript côté serveur. Il permet d'exécuter du JavaScript côté serveur. Mais aussi de faire des tests unitaires.
- [storybook](https://storybook.js.org/) est un outil de développement pour les composants React. Il permet de visualiser les composants et de les tester.
- [react-pdf](https://react-pdf.org/) est une bibliothèque pour générer des fichiers PDF en React.
- [react-pdf-tailwind](https://www.npmjs.com/package/react-pdf-tailwind) est une bibliothèque pour générer des fichiers PDF en React avec TailwindCSS.
- [nodemailer](https://nodemailer.com/) est une bibliothèque pour envoyer des emails en Node.js. Elle est utilisée pour envoyer des emails de réinitialisation de mot de passe.
- [react-email](https://nodemailer.com) est une bibliothèque pour envoyer des emails en React. Elle est utilisée pour envoyer des emails de réinitialisation de mot de passe. Elle support tailwindcss sans problème.
