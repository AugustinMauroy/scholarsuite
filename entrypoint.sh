#!/bin/bash

# Debugging output
echo "Starting entry script..."

# Ensure we're in the right directory
echo "Current directory: $(pwd)"

# Check if npm scripts are available
echo "Available npm scripts:"
npm run || { echo "npm run failed"; exit 1; }

# Run database commands
echo "Running db:generate..."
npm run db:generate || { echo "db:generate failed"; exit 1; }

echo "Running db:push..."
npm run db:push || { echo "db:push failed"; exit 1; }

# Check NODE_ENV and run appropriate commands
if [ "$NODE_ENV" = "production" ]; then
    echo "Running in production mode..."
    npm run db:seed-prod || { echo "db:seed-prod failed"; exit 1; }
    npm run build || { echo "build failed"; exit 1; }
    npm start || { echo "npm start failed"; exit 1; }
else
    echo "Running in development mode..."
    npm run db:seed-dev || { echo "db:seed-dev failed"; exit 1; }
    npm run dev || { echo "npm run dev failed"; exit 1; }
fi

echo "Script execution completed."
