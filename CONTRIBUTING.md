# ScholarSuite

Thank you for wanting to contribute to ScholarSuite. We are thrilled to welcome you to our community. Before you start, please read this document to understand how you can contribute to this project.

## How to Contribute

1. Fork the ScholarSuite repository.
2. Clone the ScholarSuite repository to your local machine.

```bash
git clone git@github.com:<YOUR_GITHUB_USERNAME>/scholarsuite.git # SSH
git clone https://github.com/<YOUR_GITHUB_USERNAME>/scholarsuite.git # HTTPS
gh repo clone <YOUR_GITHUB_USERNAME>/scholarsuite # GitHub CLI
```

3. Change directory to the cloned repository.

```bash
cd scholarsuite
```

4. Create a branch for your contribution.

```bash
git checkout -b <BRANCH_NAME>
```

5. Start the development environment.

```bash
npm install
cp .env.example .env
npm run db:generate
npm run db:seed-dev
npx turbo dev # or turbo dev if you have Turbo installed globally
```

Above, we start by installing the project dependencies, then we copy the `.env.example` file to `.env` to set the environment variables _(remember to update it according to your environment)_. Then, we generate the migrations and run them to create the database tables. Finally, we start the development environment.

6. Make your changes.

7. Format your code.

```bash
turbo format # or npx turbo format
```

10. Once you're done, commit your changes.

```bash
git add .
git commit -m "Your commit message"
```

> [!NOTE]
> Please follow the commit guidelines described below.

## Commit Guidelines

This project follows the [Conventional Commits][] specification.

Commits must be signed. You can learn more about [Commit Signing][] here.

### Commit Message Guidelines

- Commit messages must include a "type" as described in Conventional Commits
- Commit messages **must** start with a capital letter
- Commit messages **must not** end with a period `.`
- Commit messages **must** be in English _sorry for the constraint_

[Conventional Commits]: https://www.conventionalcommits.org/
[Commit Signing]: https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits
