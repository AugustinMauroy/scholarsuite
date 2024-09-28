# Working with Vercel

Vercel is a cloud platform for serverless deployment. It's easy to use.

## Deploying ScholarSuite on Vercel

To deploy ScholarSuite on Vercel, you need to have a Vercel account. If you don't have one, you can sign up for free at [vercel.com](https://vercel.com/).

## 1. Setup Vercel Postgres

First, you need to create a Vercel Postgres database. You can do this by following the instructions in the [Vercel documentation](https://vercel.com/docs/storage/vercel-postgres/quickstart#quickstart).

## 2. update the `.env` file

Second, update the environment variables. You can do this by following theses docs [Vercel environment variables](https://vercel.com/docs/deployments/environments).

- `DATABASE_URL` - The connection string to the Vercel Postgres database.
- `DATABASE_URL_NON_POOLING` - The connection string to the Vercel Postgres database without pooling.
- and other environment variables descriped in the `.env.example` file.

## 3. Deploy the application

Finally, deploy the application to Vercel. You can do this by following the instructions in the [Vercel documentation](https://vercel.com/docs/platform/deployments).
