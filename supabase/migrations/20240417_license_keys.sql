-- Add display_key column to licenses table
ALTER TABLE licenses ADD COLUMN display_key TEXT;

-- Create a function to generate a license key format
CREATE OR REPLACE FUNCTION generate_license_key() RETURNS TEXT AS $$
DECLARE
    timestamp_part TEXT;
    random_part TEXT;
BEGIN
    -- Convert current timestamp to base 36
    timestamp_part := LOWER(TO_HEX(EXTRACT(EPOCH FROM NOW())::BIGINT));
    -- Generate 16 random bytes and convert to hex
    random_part := encode(gen_random_bytes(16), 'hex');
    RETURN 'CLPB-' || timestamp_part || '-' || random_part;
END;
$$ LANGUAGE plpgsql;

-- Update existing licenses:
-- 1. For broken licenses (those with hashed keys), generate new display keys
-- 2. For normal licenses, use their current key as display_key
UPDATE licenses 
SET display_key = 
    CASE 
        WHEN key ~ '^[a-f0-9]{128}:[a-f0-9]{64}$' THEN generate_license_key()
        ELSE key 
    END
WHERE display_key IS NULL;

-- Add a trigger to ensure display_key is never null and is preserved
CREATE OR REPLACE FUNCTION ensure_display_key()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.display_key IS NULL THEN
    -- Only set display_key on INSERT if it's NULL
    NEW.display_key := CASE 
      WHEN NEW.key ~ '^[a-f0-9]{128}:[a-f0-9]{64}$' THEN generate_license_key()
      ELSE NEW.key 
    END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ensure_display_key_trigger
BEFORE INSERT ON licenses
FOR EACH ROW
EXECUTE FUNCTION ensure_display_key();

-- Add policy to allow authenticated users to read their own license display keys
CREATE POLICY "Users can read their own license display keys"
ON licenses FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Drop the function as it's only needed for the migration
DROP FUNCTION generate_license_key();