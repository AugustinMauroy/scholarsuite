#!/usr/bin/env node
/**
 * Entrypoint script for the Dockerfile.
 * This script is responsible for running the necessary commands to start the application.
 */

import { execSync } from 'node:child_process';
import { styleText } from 'node:util';

console.log(styleText('bold', 'Starting entry script...'));

console.log('Current directory:', styleText('yellow', process.cwd()));

console.log('Available npm scripts:');
try {
  execSync('node --run', { stdio: 'inherit' });
} catch (error) {
  console.error('node --run failed');
  process.exit(1);
}

console.log('Running db:generate...');
try {
  execSync('node --run db:generate', { stdio: 'inherit' });
} catch {
  console.error(styleText('red', '⨯') + ' db:generate failed');
  process.exit(1);
}

console.log('Running db:push...');
try {
  execSync('node --run db:push', { stdio: 'inherit' });
} catch {
  console.error(styleText('red', '⨯') + ' db:push failed');
  process.exit(1);
}

if (process.env.NODE_ENV === 'production') {
  console.log('Running in production mode...');
  try {
    execSync('node --run db:seed-prod', { stdio: 'inherit' });
    execSync('node --run build', { stdio: 'inherit' });
    execSync('npm start', { stdio: 'inherit' });
  } catch {
    console.error(styleText('red', '⨯') + ' Production commands failed');
    process.exit(1);
  }
} else {
  console.log('Running in development mode...');
  try {
    execSync('node --run db:seed-dev', { stdio: 'inherit' });
    execSync('node --run dev', { stdio: 'inherit' });
  } catch {
    console.error(styleText('red', '⨯') + ' Development commands failed');
    process.exit(1);
  }
}

console.log(styleText('green', '✓') + ' Script execution completed.');
