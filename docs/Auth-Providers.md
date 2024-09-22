# Authentication Providers in ScholarSuite

ScholarSuite supports multiple authentication providers to allow users to sign in using their preferred method. The following providers are currently available:

## GitHub, GitLab, Google, and Apple

These providers allow users to sign in using their existing account on the respective platform. When using these providers, ScholarSuite checks that the email associated with the account matches the email of a user in the application's database. This ensures that only authorized users can sign in.

> [!NOTE]
> Before using these providers, an administrator must have created the user in the application's database. This is because ScholarSuite checks that the email associated with the account matches the email of a user in the database.

## Credentials

ScholarSuite also supports email and password authentication. This allows users to sign in using their email address and password, which are stored in the application's database.

> [!NOTE]
> Before using this provider, an administrator must have created the user in the application's database. This is because ScholarSuite checks that the email and password provided match the email and password of a user in the database.

## Github

To enable Github authentication, you need to add theses environment variables to your `.env` file:

```bash
AUTH_GITHUB_CLIENT_ID=your-github-client-id
AUTH_GITHUB_CLIENT_SECRET=your-github
```

## GitLab

To enable GitLab authentication, you need to add theses environment variables to your `.env` file:

```bash
AUTH_GITLAB_CLIENT_ID=your-gitlab-client-id
AUTH_GITLAB_CLIENT_SECRET=your-gitlab
```

## Google

To enable Google authentication, you need to add theses environment variables to your `.env` file:

```bash
AUTH_GOOGLE_CLIENT_ID=your-google-client-id
AUTH_GOOGLE_CLIENT_SECRET=your-google
```

## Apple

To enable Apple authentication, you need to add theses environment variables to your `.env` file:

```bash
AUTH_APPLE_CLIENT_ID=your-apple-client-id
AUTH_APPLE_CLIENT_SECRET=your-apple
```
