import { createClient } from "@/libs/supabase/server";
import { 
  generateLicenseKey, 
  hashString, 
  verifyHash,
  encrypt,
  decrypt,
  signData
} from "@/libs/security";

// Function to check if a string looks like a hashed license key
function isHashedLicenseKey(key) {
  // Hashed keys are long hex strings with a colon in the middle
  return /^[a-f0-9]{128}:[a-f0-9]{64}$/.test(key);
}

export async function regenerateLicenseKey(userId, subscriptionId, expiresAt) {
  const supabase = createClient();
  
  try {
    // Generate a new proper format license key
    const newLicenseKey = generateLicenseKey();
    const hashedKey = hashString(newLicenseKey);
    
    // Update the license in the database
    const { data, error } = await supabase
      .from('licenses')
      .update({ key: hashedKey })
      .eq('user_id', userId)
      .eq('status', 'active')
      .select()
      .single();

    if (error) throw error;

    // Return the data with the new unencrypted key
    return {
      ...data,
      key: newLicenseKey
    };
  } catch (error) {
    console.error("Error regenerating license key:", error);
    throw error;
  }
}

export async function generateLicense(userId, subscriptionId, expiresAt = null) {
  const supabase = createClient();
  
  try {
    // Generate a secure license key and ensure it's long enough
    let licenseKey;
    do {
      licenseKey = await generateLicenseKey();
    } while (licenseKey.length < 10);
    
    // Hash the license key for storage
    const hashedKey = await hashString(licenseKey);
    
    // Encrypt user-specific data
    const userData = await encrypt(JSON.stringify({
      userId,
      subscriptionId,
      createdAt: new Date().toISOString()
    }));

    // Create signature for the license
    const signature = await signData({
      key: licenseKey,
      userId,
      subscriptionId,
      expiresAt
    });

    // Store the license
    const { data, error } = await supabase
      .from('licenses')
      .insert({
        user_id: userId,
        subscription_id: subscriptionId,
        key: hashedKey,
        display_key: licenseKey,
        encrypted_data: userData.encrypted,
        iv: userData.iv,
        auth_tag: userData.authTag,
        signature,
        expires_at: expiresAt,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;

    // Verify the generated license key length
    if (data.display_key.length < 10) {
      console.log('Generated license key too short, regenerating...');
      return generateLicense(userId, subscriptionId, expiresAt);
    }

    // Return the data with the display key
    return {
      ...data,
      key: data.display_key
    };
  } catch (error) {
    console.error("Error generating license:", error);
    throw error;
  }
}

export async function verifyLicense(licenseKey) {
  const supabase = createClient();
  
  try {
    // Get all active licenses
    const { data: licenses, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('status', 'active');

    if (error) throw error;

    // Find the matching license by verifying against the hashed key
    const license = licenses.find(lic => verifyHash(licenseKey, lic.key));
    
    if (!license) {
      return {
        is_valid: false,
        message: "Invalid license key"
      };
    }

    // Check expiration
    if (license.expires_at && new Date(license.expires_at) < new Date()) {
      return {
        is_valid: false,
        message: "License has expired"
      };
    }

    // Decrypt user data
    const userData = JSON.parse(
      decrypt(
        license.encrypted_data,
        license.iv,
        license.auth_tag
      )
    );

    // Verify signature
    const isSignatureValid = signData({
      key: licenseKey,
      userId: userData.userId,
      subscriptionId: license.subscription_id,
      expiresAt: license.expires_at
    }) === license.signature;

    if (!isSignatureValid) {
      return {
        is_valid: false,
        message: "License signature is invalid"
      };
    }

    // Record license usage
    await supabase
      .from('license_usage')
      .insert({
        license_id: license.id,
        user_id: license.user_id,
        requests: 1,
        last_request_at: new Date().toISOString()
      });

    return {
      is_valid: true,
      expires_at: license.expires_at,
      message: "License is valid"
    };
  } catch (error) {
    console.error("Error verifying license:", error);
    throw error;
  }
}

export async function getUserLicenses(userId) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error getting user licenses:", error);
    throw error;
  }
}

export async function revokeLicense(licenseId) {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('licenses')
      .update({ 
        status: 'revoked',
        revoked_at: new Date().toISOString()
      })
      .eq('id', licenseId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error revoking license:", error);
    throw error;
  }
}

export async function getLicenseData(userId) {
  const supabase = createClient();
  
  try {
    const { data: license, error } = await supabase
      .from("licenses")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    // Return the license with the display key as the key
    return {
      ...license,
      key: license.display_key
    };
  } catch (error) {
    console.error("Error getting license data:", error);
    throw error;
  }
}

export async function fixInvalidLicense(userId, subscriptionId, expiresAt) {
  const supabase = createClient();
  
  try {
    console.log('Fixing invalid license for user:', { userId, subscriptionId });
    
    // Generate a new proper license key
    let licenseKey;
    do {
      licenseKey = await generateLicenseKey();
      console.log('Generated new license key:', licenseKey);
    } while (licenseKey.length < 10);
    
    // Hash the license key for storage
    const hashedKey = await hashString(licenseKey);
    console.log('Generated hashed key');
    
    // Encrypt user-specific data
    const userData = await encrypt(JSON.stringify({
      userId,
      subscriptionId,
      createdAt: new Date().toISOString()
    }));
    console.log('Encrypted user data');

    // Create signature for the license
    const signature = await signData({
      key: licenseKey,
      userId,
      subscriptionId,
      expiresAt
    });
    console.log('Created signature');

    // Update the existing license
    const { data, error } = await supabase
      .from('licenses')
      .update({
        key: hashedKey,
        display_key: licenseKey,
        encrypted_data: userData.encrypted,
        iv: userData.iv,
        auth_tag: userData.authTag,
        signature,
        expires_at: expiresAt
      })
      .eq('user_id', userId)
      .eq('status', 'active')
      .select()
      .single();

    if (error) throw error;

    console.log('Successfully fixed license:', {
      id: data.id,
      key: licenseKey,
      display_key: licenseKey
    });

    // Return the data with the new key
    return {
      ...data,
      key: licenseKey,
      display_key: licenseKey
    };
  } catch (error) {
    console.error("Error fixing license:", error);
    throw error;
  }
}

export async function checkAndFixLicense(userId, subscriptionId, expiresAt) {
  const supabase = createClient();
  
  try {
    console.log('Checking license for user:', { userId, subscriptionId });
    
    // Get current license
    const { data: license, error } = await supabase
      .from('licenses')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No license exists, create new one
        console.log('No license found, generating new one');
        return generateLicense(userId, subscriptionId, expiresAt);
      }
      throw error;
    }

    // Check if license key is invalid
    if (!license.key || license.key === '{}' || license.display_key === '{}' || license.key.length < 10) {
      console.log('Found invalid license, regenerating...', license);
      return fixInvalidLicense(userId, subscriptionId, expiresAt);
    }

    console.log('License is valid:', {
      id: license.id,
      key: license.display_key,
      display_key: license.display_key
    });

    return {
      ...license,
      key: license.display_key
    };
  } catch (error) {
    console.error("Error checking license:", error);
    throw error;
  }
} 