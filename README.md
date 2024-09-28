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

- [Node.js](https://nodejs.org/) (LTS version)
- [PostgreSQL](https://www.postgresql.org/) (version 15 or higher)

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

Sure, here's an improved version of the Docker documentation section:

### Running ScholarSuite using Docker

To run ScholarSuite using Docker, you can use the provided `docker-compose.yaml` file along with a specific environment file. This will start the application and its dependencies in separate containers.

#### Prerequisites

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

To start the production environment, run the following command:

```bash
docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up
```

This will start the application and its dependencies in detached mode, meaning that the terminal will be free to use for other tasks.

#### Building Docker Images

If you make any changes to the application code or its dependencies, you may need to rebuild the Docker images. To do this, append the `--build` flag to the `docker-compose up` command:

```bash
docker-compose -f docker-compose.yaml -f docker-compose.prod.yaml up --build
```

### Stopping the Containers

To stop the containers, run the following command:

```bash
docker-compose down
```

This will stop and remove the containers, networks, and volumes created by `docker-compose up`.

## Docs

- [Roadmap](./ROADMAP.md)
- [Technical documentation](./docs/Technical.md)
- interested in deploying your app on Vercel? Check out the [Vercel documentation](./docs/Vercel.md).
