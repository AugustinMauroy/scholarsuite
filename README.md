# ScholarSuite

ScholarSuite is a grade management application for schools. It allows to manage students, classes, school levels, subjects and grades.

> [!IMPORTANT]
> This application is only at the design stage. It is not yet developed. But contributions are welcome 😁.
>
> **Current state:** we are working on the technical design of the application. And in parallel, we are working on the design of the application.

## Having your instance of ✨ ScholarSuite ✨

**Prerequisites:**

- Node.js (LTS) and npm *(provided with Node.js)*
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

## Customizing your instance of ScholarSuite

In the `.env` file, you can customize the main color of the application by adding the `CUSTOM_COLOR` variable with the name of the color [tailwindcss](https://tailwindcss.com/docs/customizing-colors#color-palette-reference). **Caution ⚠️:** the color must be a color of the tailwindcss palette and must be in lowercase.

Also, keep in mind that the color will be used for buttons, links and navigation bar elements... So don't put a color that could cause readability problems. But still, it is not recommended to put a color with a particular meaning (such as red for errors).

**Example:**
```makefile
CUSTOM_COLOR=blue
```

## Docs

- [Roadmap](./ROADMAP.md)
- [Technical documentation](./docs/Technical.md)
