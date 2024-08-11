#!/bin/bash

# Wait for the database to be available
# You might want to use a script to check if the DB is ready
# Example: ./wait-for-db.sh

npm run db:generate

npm run db:push

if [ "$NODE_ENV" = "production" ]; then
    npm run db:seed-prod
    npm run build
    npm start
else
    npm run db:seed-dev
    npm run dev
fi

# Start your application


