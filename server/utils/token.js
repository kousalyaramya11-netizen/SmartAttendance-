import crypto from 'crypto';

function generateSessionToken() {
  return crypto.randomBytes(24).toString('hex');
}

export { generateSessionToken };
