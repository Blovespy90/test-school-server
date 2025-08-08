// @ts-check

import { randomBytes } from 'crypto';

/** 
 * * Generates a random secret key for use in the application (e.g. jwt secrets).
 * * Run `node secret.mjs` in the terminal opened in the project directory.
 */

const secret = randomBytes(64).toString('hex');

console.info(secret);
