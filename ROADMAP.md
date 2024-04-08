# ScholarSuite Roadmap

## ScholarSuite 1.0

## Fonctionnalités

- [ ] Gestion des utilisateurs
      Il faut que l'application permette de gérer les utilisateurs. Un utilisateur peut être un enseignant ou un administrateur
      Voci les éléments d'un utilisateur:
  - Nom
  - Prénom
  - Email (optionnel)
  - Mot de passe (hashé)
  - Rôle (enseignant ou administrateur représenté par un entier)
  - Date de création (usage interne)
  - Date de modification (usage interne)
- [ ] Gestion des niveau scolaire
      Il faut que l'application permette de gérer les niveaux scolaires. Un niveau scolaire est un ensemble de classes. Un niveau scolaire est défini par:
  - Nom
  - Date de création (usage interne)
  - Date de modification (usage interne)
- [ ] gestion des classes
      Il faut que l'application permette de gérer les classes. Une classe est définie par:
  - Nom
  - Niveau scolaire
  - Date de création (usage interne)
  - Date de modification (usage interne)
- [ ] Gestion des élèves
      Il faut que l'application permette de gérer les élèves. Un élève est défini par:
  - Nom
  - Prénom
  - Date de naissance
  - Classe
  - Date de création (usage interne)
  - Date de modification (usage interne)
- [ ] Gestion des matières
      Il faut que l'application permette de gérer les matières. Une matière est définie par:
  - Nom
  - Date de création (usage interne)
  - Date de modification (usage interne)
- [ ] Gestion des notes
      Il faut que l'application permette de gérer les notes. Une note est définie par:
  - Elève
  - Matière
  - Valeur
  - Date de création (usage interne)
  - Date de modification (usage interne)

## Points techniques

- [ ] Authentification
      Il faut que l'application permette de s'authentifier. L'authentification se fait par email et mot de passe
- [ ] API REST pour pouvoir plugger l'application à d'autres services.
- [ ] Base de données
      Il faut que l'application utilise une base de données pour stocker les données. La base de données doit être relationnelle.
- [ ] Tests unitaires
      Il faut que l'application soit testée.
- [ ] Test visuel
      Il faut que l'application soit testée visuellement.
- [ ] Documentation
      Il faut que l'application soit documentée. La documentation doit être écrite en markdown.
- [ ] Internationalisation
      Il faut que l'application soit internationalisée. La langue par défaut est le français ou défini par un configuration.
- [ ] Docker (à discuter)

## Technologies

- [react](https://reactjs.org/) est une bibliothèque JavaScript pour construire des interfaces utilisateur.
- [tailwindcss](https://tailwindcss.com/) est un framework CSS pour construire des interfaces utilisateur.
- [typescript](https://www.typescriptlang.org/) est un langage de programmation qui ajoute des fonctionnalités à JavaScript.
- [nextjs](https://nextjs.org/) est un framework React pour construire des applications web. Il permet de générer des pages statiques ou dynamiques mais aussi de gérer le routage et encore les api
- [next-auth](https://next-auth.js.org/) est une bibliothèque pour gérer l'authentification dans une application Next.js
- [prisma](https://www.prisma.io/) est un ORM pour Node.js et TypeScript
- [nodejs](https://nodejs.org/) est un environnement d'exécution JavaScript côté serveur. Il permet d'exécuter du JavaScript côté serveur. Mais aussi de faire des tests unitaires.
- [storybook](https://storybook.js.org/) est un outil de développement pour les composants React. Il permet de visualiser les composants et de les tester.
