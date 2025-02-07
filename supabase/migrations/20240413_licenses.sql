-- Create enum for license status
CREATE TYPE license_status AS ENUM ('active', 'revoked', 'expired');

-- Create licenses table
CREATE TABLE licenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    key TEXT UNIQUE NOT NULL,
    status license_status DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ,
    subscription_id TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    last_verified_at TIMESTAMPTZ
);

-- Create index for faster lookups
CREATE INDEX licenses_user_id_idx ON licenses(user_id);
CREATE INDEX licenses_key_idx ON licenses(key);
CREATE INDEX licenses_status_idx ON licenses(status);
CREATE INDEX licenses_subscription_id_idx ON licenses(subscription_id);

-- Add RLS policies
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- Users can only read their own licenses
CREATE POLICY "Users can view own licenses"
    ON licenses FOR SELECT
    USING (auth.uid() = user_id);

-- Only service role can insert/update/delete licenses
CREATE POLICY "Service role can manage licenses"
    ON licenses FOR ALL
    USING (auth.jwt()->>'role' = 'service_role')
    WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- Create function to generate secure license keys
CREATE OR REPLACE FUNCTION generate_license_key()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    key TEXT;
    key_exists BOOLEAN;
BEGIN
    LOOP
        -- Generate a random key (format: XXXX-XXXX-XXXX-XXXX)
        key := UPPER(
            SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 4) || '-' ||
            SUBSTRING(MD5(RANDOM()::TEXT) FROM 5 FOR 4) || '-' ||
            SUBSTRING(MD5(RANDOM()::TEXT) FROM 9 FOR 4) || '-' ||
            SUBSTRING(MD5(RANDOM()::TEXT) FROM 13 FOR 4)
        );
        
        -- Check if key already exists
        SELECT EXISTS (
            SELECT 1 FROM licenses WHERE licenses.key = key
        ) INTO key_exists;
        
        -- Exit loop if key is unique
        EXIT WHEN NOT key_exists;
    END LOOP;
    
    RETURN key;
END;
$$;

-- Create function to create a new license
CREATE OR REPLACE FUNCTION create_license(
    p_user_id UUID,
    p_subscription_id TEXT,
    p_expires_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS licenses
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    new_license licenses;
BEGIN
    INSERT INTO licenses (
        user_id,
        key,
        subscription_id,
        expires_at
    )
    VALUES (
        p_user_id,
        generate_license_key(),
        p_subscription_id,
        p_expires_at
    )
    RETURNING * INTO new_license;
    
    RETURN new_license;
END;
$$;

-- Create function to verify and update license
CREATE OR REPLACE FUNCTION verify_license(
    p_license_key TEXT
)
RETURNS TABLE (
    is_valid BOOLEAN,
    message TEXT,
    user_id UUID,
    expires_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH license_check AS (
        UPDATE licenses
        SET last_verified_at = NOW()
        WHERE key = p_license_key
        RETURNING *
    )
    SELECT
        CASE
            WHEN NOT EXISTS (SELECT 1 FROM license_check) THEN
                FALSE
            WHEN license_check.status != 'active' THEN
                FALSE
            WHEN license_check.expires_at IS NOT NULL AND license_check.expires_at < NOW() THEN
                FALSE
            ELSE
                TRUE
        END,
        CASE
            WHEN NOT EXISTS (SELECT 1 FROM license_check) THEN
                'License key not found'
            WHEN license_check.status != 'active' THEN
                'License is ' || license_check.status::TEXT
            WHEN license_check.expires_at IS NOT NULL AND license_check.expires_at < NOW() THEN
                'License has expired'
            ELSE
                'License is valid'
        END,
        license_check.user_id,
        license_check.expires_at
    FROM license_check;
END;
$$;

-- Add license columns to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS active_license_id UUID REFERENCES licenses(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS license_status license_status;

-- Create function to update profile license status
CREATE OR REPLACE FUNCTION update_profile_license_status()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE profiles
    SET 
        active_license_id = NEW.id,
        license_status = NEW.status
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$;

-- Create trigger to update profile when license changes
CREATE TRIGGER update_profile_license_status_trigger
    AFTER INSERT OR UPDATE ON licenses
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_license_status(); 