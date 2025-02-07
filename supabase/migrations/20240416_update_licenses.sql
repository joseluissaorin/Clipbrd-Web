-- Add encryption-related columns to licenses table
ALTER TABLE licenses
ADD COLUMN IF NOT EXISTS encrypted_data TEXT,
ADD COLUMN IF NOT EXISTS iv TEXT,
ADD COLUMN IF NOT EXISTS auth_tag TEXT,
ADD COLUMN IF NOT EXISTS signature TEXT;

-- Enable RLS
ALTER TABLE licenses ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own licenses"
ON licenses FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage all licenses"
ON licenses FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Users can create their own licenses"
ON licenses FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own licenses"
ON licenses FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id); 