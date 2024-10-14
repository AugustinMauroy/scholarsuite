import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

register('nodejs-loaders/dev/alias', pathToFileURL('./'));
register('nodejs-loaders/dev/tsx', pathToFileURL('./'));
