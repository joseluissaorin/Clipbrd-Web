// scripts/fix-licenses.js
const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// Environment variables (paste from your .env file)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // You'll need this
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

// Constants
const IV_LENGTH = 16;
const AUTH_TAG_LENGTH = 16;
const ALGORITHM = 'aes-256-gcm';

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Helper functions
function generateSecureToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function encrypt(text) {
  if (!ENCRYPTION_KEY) throw new Error('Encryption key not set');
  
  const iv = crypto.randomBytes(IV_LENGTH);
  const key = crypto.pbkdf2Sync(ENCRYPTION_KEY, 'salt', 100000, 32, 'sha256');
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');
  
  return {
    iv: iv.toString('hex'),
    encrypted: encrypted,
    authTag: authTag
  };
}

function signData(data) {
  const hmac = crypto.createHmac('sha256', ENCRYPTION_KEY);
  hmac.update(JSON.stringify(data));
  return hmac.digest('hex');
}

async function fixLicensesWithMissingAuthTag() {
  console.log("Starting license repair process...");
  
  try {
    // Get all licenses with missing auth_tag
    const { data: brokenLicenses, error: fetchError } = await supabase
      .from('licenses')
      .select('*')
      .is('auth_tag', null);
    
    if (fetchError) throw fetchError;
    
    console.log(`Found ${brokenLicenses.length} licenses with missing auth_tag`);
    
    // Process each broken license
    for (const license of brokenLicenses) {
      console.log(`Processing license: ${license.id}`);
      
      try {
        // Re-encrypt the user data to generate proper cryptographic values
        const userData = encrypt(JSON.stringify({
          userId: license.user_id,
          subscriptionId: license.subscription_id,
          createdAt: license.created_at
        }));
        
        // Generate a proper signature
        const signature = signData({
          key: license.display_key,
          userId: license.user_id,
          subscriptionId: license.subscription_id,
          expiresAt: license.expires_at
        });
        
        // Update the license with proper cryptographic values
        const { error: updateError } = await supabase
          .from('licenses')
          .update({
            encrypted_data: userData.encrypted,
            iv: userData.iv,
            auth_tag: userData.authTag,
            signature: signature
          })
          .eq('id', license.id);
        
        if (updateError) {
          console.error(`Error updating license ${license.id}:`, updateError);
          continue;
        }
        
        console.log(`Successfully fixed license: ${license.id}`);
      } catch (err) {
        console.error(`Error processing license ${license.id}:`, err);
      }
    }
    
    console.log("License repair process completed");
  } catch (error) {
    console.error("Error in license repair process:", error);
  }
}

// Execute the function
fixLicensesWithMissingAuthTag();