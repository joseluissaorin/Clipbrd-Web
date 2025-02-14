// Using Web Crypto API for Edge Runtime compatibility
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const SALT_LENGTH = 64;
const KEY_ITERATIONS = 100000;
const KEY_LENGTH = 32;
const ALGORITHM = 'AES-GCM';

// Convert hex string to Uint8Array
function hexToUint8Array(hex) {
  return new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}

// Convert Uint8Array to hex string
function uint8ArrayToHex(uint8Array) {
  return Array.from(uint8Array)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// Generate a secure random string for tokens and keys
export async function generateSecureToken(length = 32) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return uint8ArrayToHex(array);
}

// Hash a string (like license key) for secure storage
export async function hashString(str) {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  
  const key = await crypto.subtle.importKey(
    'raw',
    data,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  const hash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: KEY_ITERATIONS,
      hash: 'SHA-512'
    },
    key,
    KEY_LENGTH * 8
  );
  
  return `${uint8ArrayToHex(salt)}:${uint8ArrayToHex(new Uint8Array(hash))}`;
}

// Verify a string against its hash
export async function verifyHash(str, hashWithSalt) {
  const [saltHex, hashHex] = hashWithSalt.split(':');
  const salt = hexToUint8Array(saltHex);
  const hash = hexToUint8Array(hashHex);
  
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  
  const key = await crypto.subtle.importKey(
    'raw',
    data,
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  const verifyHash = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt,
      iterations: KEY_ITERATIONS,
      hash: 'SHA-512'
    },
    key,
    KEY_LENGTH * 8
  );
  
  return uint8ArrayToHex(new Uint8Array(verifyHash)) === uint8ArrayToHex(hash);
}

// Encrypt data for secure storage or transmission
export async function encrypt(text) {
  if (!ENCRYPTION_KEY) throw new Error('Encryption key not set');
  
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(ENCRYPTION_KEY),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode('salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  
  const key = await crypto.subtle.importKey(
    'raw',
    derivedKey,
    { name: ALGORITHM },
    false,
    ['encrypt']
  );
  
  const encrypted = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    data
  );
  
  return {
    iv: uint8ArrayToHex(iv),
    encrypted: uint8ArrayToHex(new Uint8Array(encrypted))
  };
}

// Decrypt previously encrypted data
export async function decrypt(encryptedHex, ivHex) {
  if (!ENCRYPTION_KEY) throw new Error('Encryption key not set');
  
  const encoder = new TextEncoder();
  const iv = hexToUint8Array(ivHex);
  const encrypted = hexToUint8Array(encryptedHex);
  
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(ENCRYPTION_KEY),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: encoder.encode('salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    256
  );
  
  const key = await crypto.subtle.importKey(
    'raw',
    derivedKey,
    { name: ALGORITHM },
    false,
    ['decrypt']
  );
  
  const decrypted = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv },
    key,
    encrypted
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decrypted);
}

// Generate a secure license key
export async function generateLicenseKey() {
  let licenseKey;
  do {
    const timestamp = Date.now().toString(36);
    const random = await generateSecureToken(16);
    licenseKey = `CLPB-${timestamp}-${random}`.toUpperCase();
  } while (licenseKey.length < 10);
  return licenseKey;
}

// Sign data for license verification
export async function signData(data) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.generateKey(
    {
      name: 'HMAC',
      hash: { name: 'SHA-256' }
    },
    true,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(JSON.stringify(data))
  );
  
  return uint8ArrayToHex(new Uint8Array(signature));
}

// Verify signed data
export async function verifySignature(data, signature) {
  const expectedSignature = await signData(data);
  return signature === expectedSignature;
}

// Generate a secure API key for the client
export async function generateApiKey(userId) {
  const prefix = 'clpb';
  const timestamp = Date.now().toString(36);
  const random = await generateSecureToken(16);
  const data = `${userId}-${timestamp}-${random}`;
  const signature = await signData(data);
  return `${prefix}_${btoa(data)}_${signature.slice(0, 32)}`;
}

// Verify an API key
export async function verifyApiKey(apiKey) {
  try {
    const [prefix, data, signature] = apiKey.split('_');
    
    if (prefix !== 'clpb') {
      return false;
    }

    const decodedData = atob(data);
    return await verifySignature(decodedData, signature + signature.slice(0, 32));
  } catch (error) {
    return false;
  }
} 