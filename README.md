<p align="center">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./assets/logo-dark.svg">
      <img src="./assets/logo-light.svg" width="200px">
    </picture>
</p>
ScholarSuite is a grade management application for schools. It allows to manage students, classes, school levels, subjects and grades.

> [!IMPORTANT]
> This application is only at the design stage. It is not yet developed. But contributions are welcome 😁.
>
> **Current state:** we are working on the technical design of the application. And in parallel, we are working on the design of the application.

## Having your instance of ✨ ScholarSuite ✨

**Prerequisites:**

- Node.js (LTS) and npm _(provided with Node.js)_
- MySQL

1. Clone the repository
2. Install dependencies (without development dependencies)

```bash
npm ci
```

3. Create a `.env` file at the root of the project and add the environment variables. There is an `.env.example` file that can be used as a template.
4. Instantiate the database

```bash
npm run db:generate
npm run db:push
npm run db:seed-prod
```

5. Build the application. Using [Turbo](https://turbo.build) for caching.

```bash
turbo build
```

6. Start the application

```bash
npm start
```

## Docs

- [Roadmap](./ROADMAP.md)
- [Technical documentation](./docs/Technical.md)
