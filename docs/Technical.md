# Technical Documentation

> [!NOTE]
> This documentation concerns the technical aspects of the project. It includes the architecture, design, implementation, and testing of the project. It is intended for developers and maintainers of the project.

## Technologies Used

- [React][]
- [Tailwind][]
- [Next.js][]
- [PostCSS][]
- [TypeScript][]
- [Storybook][]
- [prisma][] - for more information on our database and data models, see [Prisma documentation](./Prisma.md)

## Tools Used

- [prettier][]
- [eslint][]
- [stylelint][]
- [turbo][]

## Setting up the Development Environment

To set up a development environment, you can follow [these instructions](../CONTRIBUTING.md#how-to-contribute).

## Creating React Components

We use [React][] as the frontend library to develop the website. React allows us to create user interfaces with a modern approach to web development.

If you are not familiar with React or web development in general, we encourage you to read before tackling complex problems and tasks as this repository is **not for educational purposes** and we expect you to have a basic understanding of the technologies used. Except for mentoring by one of our team members.

We also recommend that you familiarize yourself with technologies such as [Next.js][], [PostCSS][] and concepts such as "CSS Modules" and "CSS-in-JS".

### Styling a Component

As mentioned, we write all component styles in separate `.module.css` files. This is like writing any CSS in a separate file (except that we use [PostCSS][]).

This concept of writing styles in dedicated `.module.css` files and importing them into JavaScript (or React) is a pattern called **[CSS Module](https://github.com/css-modules/css-modules)**.
These modules allow us to write PostCSS (or regular CSS, or any CSS variant if you have a way to interpret it) in a `.module.css` file and import the class names directly into our React components.
We recommend reading guides on "Styling React Components with CSS Modules", of which there are many examples on the web.

It is important to mention that we use [Tailwind][] as our CSS framework. Therefore, margins, paddings, font sizes, font weights, colors, and other types of styles are all provided with Tailwind.
We recommend reading the [Tailwind documentation](https://tailwindcss.com/docs/preflight) to familiarize yourself with Tailwind styles.
We also recommend reading [this guide to set up Tailwind in your IDE](https://tailwindcss.com/docs/editor-setup).

Finally, if you are not familiar with using Tailwind or using Tailwind with CSS modules, we recommend reading [this guide](https://tailwindcss.com/docs/using-with-preprocessors).

#### Example of a CSS Module

```css
.myComponent {
  @apply some
    tailwind
    classes;
}
```

#### Guidelines for Writing CSS

- We use camelCase to define CSS classes
- We use the `@apply` selector of Tailwind to apply Tailwind tokens
  - We discourage the use of simple CSS styles and tokens, if in doubt, ask for help
  - We ask you to define a Tailwind token per line, as shown in the example above, as this improves readability
- Write only CSS in the CSS modules, avoid writing CSS in the JavaScript files
- We recommend creating mixins for reusable animations, effects, and more
  - You can create mixins in the `styles/mixins` folder

> [!NOTE]
> Tailwind is already configured for this repository. You do not need to import a Tailwind module into your CSS module.
> You can apply the Tailwind tokens with the `@apply` CSS rule of Tailwind. [Learn more about applying Tailwind classes with `@apply`](https://tailwindcss.com/docs/functions-and-directives#apply).

### Best Practices for Creating a Component

- All React components should be placed in the `components` folder.
- Each component should be placed, when possible, in a subfolder, which we call the "Domain" of the component
  - The domain represents where these components belong or where they will be used.
  - For example, components used in article pages or that are part of the structure of an article or article layouts,
    should be placed in `components/Article`
- Each component should have its folder with the name of the component
- The structure of each component folder follows the following pattern:

```text
  - ComponentName
    - index.tsx // the component itself
    - index.module.css // all the styles of the component are placed here
    - index.stories.tsx // Storybook stories of the component
```

- React Hooks belonging to a single component should be placed in the component folder
  - If the Hook has a wider utility or can be used by other components, it should be placed in the root `hooks` folder.
- If the component has "subcomponents", they should follow the same philosophy as the component itself.
  - For example, if the component `ComponentName` has a subcomponent called `SubcomponentName`,
    then it should be placed in `ComponentName/SubcomponentName`

#### What a New Component Should Look Like When Freshly Created

```tsx
import styles from './index.module.css';
import type { FC } from 'react';

type PropsComponentName = {
  ...
};

const ComponentName: FC<PropsComponentName> = ({ ... }) => (
  // jsx code here
);

export default ComponentName;
```

### Best Practices for Component Development in General

- Propagate only the props `{ ... }` to the Component definition (Avoid having a variable named `props`)
- Avoid importing `React`, import only the React modules you need
- When importing types, use `import type { ImportName } from 'module'`
- When defining a Component, use the `FC` type of React to define the type of the Component
  - When using `children` as a prop, use the type `FC<PropsWithChildren<PropsComponentName>>` instead
  - Alternatively, you can define your type as `type PropsComponentName = PropsWithChildren<{ my other props }>` **(Recommended)**
- Each type of prop should be prefixed by the name of the component
- Components should always be the `default` export of a React component file
- Avoid using DOM/Web APIs/access to `document`/`window` APIs inside a React Component.
  Use utilities or Hooks when you need reactive state
- Avoid making your Component too big. Break it down into smaller Components/Hooks whenever possible
- Do not make internal REST API calls in a server component, prefer to make the query directly in the component. Because if not the app must calculate the component and the API.

## Testing React Components

We use [Storybook][] to document our components. Each component should have a Storybook story that documents the use of the component.

### General Guidelines for Storybooks

Storybooks are an essential part of our development process. They help us document our components and ensure that the components work as expected.

They also allow developers to preview components and test them manually/individually up to the smallest unit of the application (the individual component itself).

**Storybooks must be fully typed and follow the following pattern:**

```tsx
import ComponentName from '@components/PathTo/YourComponent';
import type { Meta as MetaObj, StoryObj } from '@storybook/react';

type Story = StoryObj<typeof ComponentName>;
type Meta = MetaObj<typeof ComponentName>;

// If the component has props that can be interacted with, they should be passed here
// We recommend reading the Storybook documentation for args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {};

// If the component has more than one state/layout/variant, there should be a story for each variant
export const AnotherStory: Story = {
  args: {},
};

export default { component: ComponentName } as Meta;
```

- Stories should have `args` whenever possible, we want to be able to test the different aspects of a component
- Please follow the above pattern to keep the Storybooks as consistent as possible
- We recommend reading previous Storybooks in the codebase for inspiration and code guidelines.
- If you need to decorate/wrap your component/story with a container/provider, please use [Storybook Decorators](https://storybook.js.org/docs/react/writing-stories/decorators)

## Managing REST APIs

We use [prisma][] to manage our database and data models. For more information on database management, see [Prisma documentation](./Prisma.md). And for the REST API part, we use Next.js with its [route handler](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) functionality.

### Some General Guidelines

- Route files should be placed in the `app/api` folder
- Functions in the file should be in the following order: `GET` -> `POST` -> `PUT` -> `PATCH` -> `DELETE` -> `HEAD` -> `OPTIONS`
- Functions should be exported at their definition:

```ts
export const POST = async (req: Request) => {
  // code here
};
```

- All routes should return [Response](https://developer.mozilla.org/fr/docs/Web/API/Response) objects.
- Routes should return JSONs. `data` for data and `message` for messages and `error` for errors.

## FAQ

### Infrastructure Choices

A brief explanation of why we chose the technologies we use.

### Why React?

React is a modern and trendy library for building user interfaces. It allows us to create reusable components and manage the state of our application in a more predictable way.

We chose React because it is a widely used library and has a large community. This means that we can find a lot of resources and help online and we can also find many people who are familiar with React.

Also, to generate PDFs, we will use the `react-pdf` library. Thus, we will have the same syntax for generating PDFs as we have for generating client-side and server-side HTML.

### Why use npm?

npm is the default package manager of Node.js. It allows us to install and manage the dependencies of our project. It also allows us to run scripts and publish our packages. We selected it because developers should not have to install another package manager.

### Why configure `.vscode`?

Visual Studio Code is a very popular code editor among developers. It is also very extensible and allows us to configure our development environment to be more productive.

For example, we recommend all sorts of plugins to improve developer productivity.

### Good to Know

- We have a `.nvmrc` file at the root of the project. This file is used by [`nvm`][] to define the correct version of Node.js for the project. If you have [`nvm`][] installed, you can run `nvm use` to set the correct version of Node.js for the project.
- We use [turbo][] to speed up the development process using caching and incremental builds.

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
