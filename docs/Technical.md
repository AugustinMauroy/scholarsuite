# Documentation Technique

Cette documentation concerne les aspects techniques du projet. Elle inclut l'architecture, la conception, la mise en œuvre et les tests du projet.

## Technologies Utilisées

- [React][]
- [Tailwind][]
- [Next.js][]
- [PostCSS][]
- [TypeScript][]
- [Storybook][]
- [prisma][], pour en savoir plus sur notre base de données et nos modèles de données, consultez [la documentation Prisma](./Prisma.md)

## Outils Utilisés

- [prettier][]
- [eslint][]
- [stylelint][]
- [turbo][]

## Configuration de l'environnement de développement

Pour configurer un environnement de développement, vous pouvez suivre [ces instructions](../CONTRIBUTING.md#comment-contribuer).

## Création de Composants React

Nous utilisons [React][] comme bibliothèque frontend pour développer le site Web. React nous permet de créer des interfaces utilisateur avec une approche moderne du développement Web.

Si vous n'êtes pas familier avec React ou le développement Web en général, nous vous encourageons à lire avant d'aborder des problèmes et des tâches complexes car ce référentiel n'est **pas à des fins éducatives** et nous attendons de vous que vous ayez une compréhension de base des technologies utilisées. Sauf encadrement par l'un de nos membres d'équipe.

Nous vous recommandons également de vous familiariser avec des technologies telles que [Next.js][], [PostCSS][] et des "concepts" tels que les "Modules CSS" et "CSS-in-JS".

### Stylisation d'un Composant

Comme mentionné, nous écrivons tous les styles de composants dans des fichiers `.module.css` séparés. C'est comme écrire n'importe quel CSS dans un fichier séparé (à part le fait que nous utilisons [PostCSS][]).

Ce concept d'écriture de styles dans des fichiers `.module.css` dédiés et de les importer dans JavaScript (ou React) est un modèle appelé **[CSS Module](https://github.com/css-modules/css-modules)**.
Ces modules nous permettent d'écrire du PostCSS (ou du CSS régulier, ou n'importe quelle variante de CSS si vous avez un moyen de l'interpréter) dans un fichier `.module.css` et d'importer les noms de classes directement dans nos composants React.
Nous vous recommandons de lire des guides sur "Styliser les composants React avec des modules CSS", dont il existe de nombreux exemples sur le web.

Il est important de mentionner que nous utilisons [Tailwind][] comme framework CSS. Par conséquent, les marges, les rembourrages, les tailles de police, les poids de police, les couleurs et d'autres types de styles sont tous fournis avec Tailwind.
Nous vous recommandons de lire la [documentation de Tailwind](https://tailwindcss.com/docs/preflight) pour vous familiariser avec les styles de Tailwind.
Nous vous recommandons également de lire [ce guide pour configurer Tailwind dans votre IDE](https://tailwindcss.com/docs/editor-setup).

Enfin, si vous n'êtes pas familier avec l'utilisation de Tailwind ou l'utilisation de Tailwind avec des modules CSS, nous vous recommandons de lire [ce guide](https://tailwindcss.com/docs/using-with-preprocessors).

#### Exemple d'un Module CSS

```css
.myComponent {
  @apply some
    tailwind
    classes;
}
```

#### Directives lors de l'écriture du CSS

- Nous utilisons camelCase pour définir les classes CSS
- Nous utilisons le sélecteur `@apply` de Tailwind pour appliquer les tokens Tailwind
  - Nous déconseillons l'utilisation de styles et de tokens CSS simples, en cas de doute, demandez de l'aide
  - Nous vous demandons de définir un token Tailwind par ligne, comme indiqué dans l'exemple ci-dessus, car cela améliore la lisibilité
- Écrivez uniquement du CSS dans les modules CSS, évitez d'écrire du CSS dans les fichiers JavaScript
- Nous recommandons de créer des mixins pour les animations réutilisables, les effets et plus encore
  - Vous pouvez créer des mixins dans le dossier `styles/mixins`

> \[!NOTE]\
> Tailwind est déjà configuré pour ce référentiel. Vous n'avez pas besoin d'importer de module Tailwind dans votre module CSS.\
> Vous pouvez appliquer les tokens Tailwind avec la règle CSS `@apply` de Tailwind. [En savoir plus sur l'application des classes Tailwind avec `@apply`](https://tailwindcss.com/docs/functions-and-directives#apply).

### Meilleures pratiques lors de la création d'un Composant

- Tous les composants React doivent être placés dans le dossier `components`.
- Chaque composant devrait être placé, lorsque possible, dans un sous-dossier, que nous appelons le "Domaine" du composant
  - Le domaine représente où ces composants appartiennent ou où ils seront utilisés.
  - Par exemple, les composants utilisés dans les pages d'articles ou faisant partie de la structure d'un article ou des mises en page d'article,
    devraient être placés dans `components/Article`
- Chaque composant devrait avoir son dossier avec le nom du composant
- La structure de chaque dossier de composant suit le modèle suivant :
  ```text
  - NomDuComposant
    - index.tsx // le composant lui-même
    - index.module.css // tous les styles du composant sont placés là
    - index.stories.tsx // stories Storybook du composant
  ```
- Les Hooks React appartenant à un seul composant doivent être placés dans le dossier du composant
  - Si le Hook a une utilité plus large ou peut être utilisé par d'autres composants, il doit être placé dans le dossier racine `hooks`.
- Si le composant a des "sous-composants", ils doivent suivre la même philosophie que le composant lui-même.
  - Par exemple, si le composant `NomDuComposant` a un sous-composant appelé `SousComposantNom`,
    alors il devrait être placé dans `NomDuComposant/SousComposantNom`

#### À quoi devrait ressembler un nouveau Composant lorsqu'il est créé fraîchement

```tsx
import styles from './index.module.css';
import type { FC } from 'react';

type PropsNameOfComponent = {
  ...
};

const NameOfComponent: FC<PropsNameOfComponent> = ({ ... }) => (
  // code jsx here
);

export default NameOfComponent;
```

### Meilleures pratiques pour le développement de Composants en général

- Propagez uniquement les props `{ ... }` à la définition du Composant (Évitez d'avoir une variable nommée `props`)
- Évitez d'importer `React`, importez uniquement les modules de React dont vous avez besoin
- Lors de l'importation de types, utilisez `import type { NomDeLImport } from 'module'`
- Lors de la définition d'un Composant, utilisez le type `FC` de React pour définir le type du Composant
  - Lorsque vous utilisez `children` comme une prop, utilisez le type `FC<PropsWithChildren<PropsNomDuComposant>>` à la place
  - Alternativement, vous pouvez définir votre type comme `type PropsNomDuComposant = PropsWithChildren<{ mes autres props }>` **(Recommandé)**
- Chaque type de prop devrait être préfixé par le nom du composant
- Les composants doivent toujours être l'exportation `default` d'un fichier de composant React
- Évitez d'utiliser les API DOM/Web/accès à `document`/API `window` à l'intérieur d'un Composant React.
  Utilisez des utilitaires ou des Hooks lorsque vous avez besoin d'un état réactif
- Évitez de rendre votre Composant trop gros. Décomposez-le en plus petits Composants/Hooks chaque fois que possible

## Test des Composants React

Nous utilisons [Storybook][] pour documenter nos composants. Chaque composant devrait avoir une histoire Storybook qui documente l'utilisation du composant.

### Directives Générales pour Storybooks

Les Storybooks sont une partie essentielle de notre processus de développement. Ils nous aident à documenter nos composants et à nous assurer que les composants fonctionnent comme prévu.

Ils permettent également aux développeurs de prévisualiser les composants et de les tester manuellement/individuellement jusqu'à l'unité la plus petite de l'application (l'individu du composant lui-même).

**Les Storybooks doivent être entièrement typés et suivre le modèle suivant :**

```tsx
import NomDuComposant from '@components/CheminVers/VotreComposant';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof NomDuComposant>;
type Meta = MetaObj<typeof NomDuComposant>;

// Si le composant a des props avec lesquelles on peut interagir, elles doivent être passées ici
// Nous recommandons de lire la documentation de Storybook pour args : https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {};

// Si le composant a plus d'un état/disposition/variante, il devrait y avoir une histoire pour chaque variante
export const AnotherStory: Story = {
  args: {},
};

export default { component: NomDuComposant } as Meta;
```

- Les histoires devraient avoir des `args` chaque fois que possible, nous voulons être en mesure de tester les différents aspects d'un composant
- Veuillez suivre le modèle ci-dessus pour maintenir les Storybooks aussi cohérents que possible
- Nous recommandons de lire les Storybooks précédents du codebase pour inspiration et directives de code.
- Si vous avez besoin de décorer/envelopper votre composant/histoire avec un conteneur/fournisseur, veuillez utiliser les [Décorateurs Storybook](https://storybook.js.org/docs/react/writing-stories/decorators)

## Choix d'Infrastructure

Une brève explication de pourquoi nous avons choisi les technologies que nous utilisons.

## Pourquoi React?

React est une bibliothèque moderne et à la mode pour construire des interfaces utilisateur. Elle nous permet de créer des composants réutilisables et de gérer l'état de notre application de manière plus prévisible.

Nous avons choisi React car c'est une bibliothèque largement utilisée et a une grande communauté. Cela signifie que nous pouvons trouver beaucoup de ressources et d'aide en ligne et nous pouvons également trouver beaucoup de personnes qui sont familières avec React.

Aussi pour générer des PDF, nous utiliserons la bibliothèque `react-pdf`. Ainsi, nous aurons la même syntaxe pour générer des PDF que nous avons pour générer du HTML côté client et côté serveur.

## Pourquoi utiliser npm?

npm est le gestionnaire de paquets par défaut de Node.js. Il nous permet d'installer et de gérer les dépendances de notre projet. Il nous permet également d'exécuter des scripts et de publier nos packages. Nous l'avons sélectionné car les développeurs ne devraient pas avoir à installer un autre gestionnaire de paquets.

## Bon à savoir

- Nous avons un fichier `.nvmrc` à la racine du projet. Ce fichier est utilisé par [`nvm`][] pour définir la version correcte de Node.js pour le projet. Si vous avez [`nvm`][] installé, vous pouvez exécuter `nvm use` pour définir la bonne version de Node.js pour le projet.
- Nous utilisons [turbo][] pour accélérer le processus de développement en utilisant la mise en cache et les constructions incrémentales.

[React]: https://reactjs.org/
[Tailwind]: https://tailwindcss.com/
[Next.js]: https://nextjs.org/
[PostCSS]: https://postcss.org/
[TypeScript]: https://www.typescriptlang.org/
[Storybook]: https://storybook.js.org/
[prisma]: https://www.prisma.io/
[prettier]: https://prettier.io/
[eslint]: https://eslint.org/
[stylelint]: https://stylelint.io/
[turbo]: https://turbo.build/
