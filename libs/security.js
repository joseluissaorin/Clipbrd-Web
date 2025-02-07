import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;
const KEY_ITERATIONS = 100000;
const KEY_LENGTH = 32;
const ALGORITHM = 'aes-256-gcm';

// Generate a secure random string for tokens and keys
export function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

// Hash a string (like license key) for secure storage
export function hashString(str) {
  const salt = crypto.randomBytes(SALT_LENGTH);
  const hash = crypto.pbkdf2Sync(str, salt, KEY_ITERATIONS, KEY_LENGTH, 'sha512');
  return `${salt.toString('hex')}:${hash.toString('hex')}`;
}

// Verify a string against its hash
export function verifyHash(str, hashWithSalt) {
  const [saltHex, hashHex] = hashWithSalt.split(':');
  const salt = Buffer.from(saltHex, 'hex');
  const hash = Buffer.from(hashHex, 'hex');
  const verifyHash = crypto.pbkdf2Sync(str, salt, KEY_ITERATIONS, KEY_LENGTH, 'sha512');
  return crypto.timingSafeEqual(hash, verifyHash);
}

// Encrypt data for secure storage or transmission
export function encrypt(text) {
  if (!ENCRYPTION_KEY) throw new Error('Encryption key not set');

  const iv = crypto.randomBytes(IV_LENGTH);
  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag();

  return {
    iv: iv.toString('hex'),
    encrypted: encrypted,
    authTag: authTag.toString('hex')
  };
}

// Decrypt previously encrypted data
export function decrypt(encrypted, iv, authTag) {
  if (!ENCRYPTION_KEY) throw new Error('Encryption key not set');

  const key = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);
  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    key,
    Buffer.from(iv, 'hex')
  );
  
  decipher.setAuthTag(Buffer.from(authTag, 'hex'));
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}

// Generate a secure license key
export function generateLicenseKey() {
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(16).toString('hex');
  return `CLPB-${timestamp}-${random}`.toUpperCase();
}

// Sign data to prevent tampering
export function signData(data) {
  if (!ENCRYPTION_KEY) throw new Error('Encryption key not set');
  
  const hmac = crypto.createHmac('sha256', ENCRYPTION_KEY);
  hmac.update(JSON.stringify(data));
  return hmac.digest('hex');
}

// Verify signed data
export function verifySignature(data, signature) {
  const expectedSignature = signData(data);
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

// Generate a secure API key for the client
export function generateApiKey(userId) {
  const prefix = 'clpb';
  const timestamp = Date.now().toString(36);
  const random = crypto.randomBytes(16).toString('hex');
  const data = `${userId}-${timestamp}-${random}`;
  const signature = signData(data);
  return `${prefix}_${Buffer.from(data).toString('base64')}_${signature.slice(0, 32)}`;
}

// Verify an API key
export function verifyApiKey(apiKey) {
  try {
    const [prefix, data, signature] = apiKey.split('_');
    
    if (prefix !== 'clpb') {
      return false;
    }

    const decodedData = Buffer.from(data, 'base64').toString();
    return verifySignature(decodedData, signature + signature.slice(0, 32));
  } catch (error) {
    return false;
  }
} 