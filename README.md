# ScholarSuite

ScholarSuite est une application de gestion de notes pour les écoles. Elle permet de gérer les élèves, les classes, les niveaux scolaires, les matières et les notes.

> [!IMPORTANT]
> Cette application n'est qu'au stade de la conception. Elle n'est pas encore développée. Mais les contributions sont les bienvenues 😁.
>
> **Etat actuel :** nous somme en train de travailez sur la conception technique de l'application. Et en parallèle, nous travaillons sur le design de l'application.

## Avoir son instance de ✨ ScholarSuite ✨

**Prérequis :**

- Node.js (LTS) et npm _(fournis avec Node.js)_
- MySQL

1. Cloner le dépôt
2. Installer les dépendances (sans les dépendances de développement)

```bash
npm ci
```

3. Créer un fichier `.env` à la racine du projet et y ajouter les variables d'environnement. Il existe un fichier `.env.example` qui peut être utilisé comme modèle.
4. Instancifier la base de données

```bash
npm run db:generate
npm run db:push
npm run db:seed-prod
```

4. Build l'application. En utilisant [Turbo](https://turbo.build) pour le caching.

```bash
turbo build
```

5. Lancer l'application

```bash
npm start
```

## Customiser son instance de ScholarSuite

dans le fichier `.env`, vous pouvez customiser la couleur principale de l'application en ajoutant la variable `CUSTOM_COLOR` avec le nom de la couleur [tailwindcss](https://tailwindcss.com/docs/customizing-colors#color-palette-reference). **Attention ⚠️:** la couleur doit être une couleur de la palette de tailwindcss et doit être en minuscule.

Aussi vous devez prendre en compte que la couleur sera utilisée pour les boutons, les liens et les éléments de la barre de navigation... Donc ne mettez pas un couleur qui pourrais poser des problèmes de lisibilité. Mais encore il n'est pas recommandé de mettre une couleur avec un signification particulière (comme le rouge pour les erreurs).

**Exemple :**

```text
CUSTOM_COLOR=blue
```

## Docs

- [Roadmap](./ROADMAP.md)
- [Documentation technique](./docs/Technical.md)
