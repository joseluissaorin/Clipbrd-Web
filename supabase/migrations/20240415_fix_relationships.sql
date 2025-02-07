-- Drop existing trigger and function
DROP TRIGGER IF EXISTS update_profile_license_status_trigger ON licenses;
DROP FUNCTION IF EXISTS update_profile_license_status();

-- Drop existing columns from profiles
ALTER TABLE profiles
DROP COLUMN IF EXISTS active_license_id,
DROP COLUMN IF EXISTS license_status;

-- Create license_usage table if it doesn't exist
CREATE TABLE IF NOT EXISTS license_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    license_id UUID REFERENCES licenses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    requests INTEGER DEFAULT 1,
    last_request_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS license_usage_license_id_idx ON license_usage(license_id);
CREATE INDEX IF NOT EXISTS license_usage_user_id_idx ON license_usage(user_id);
CREATE INDEX IF NOT EXISTS license_usage_created_at_idx ON license_usage(created_at);

-- Add RLS policies for license_usage
ALTER TABLE license_usage ENABLE ROW LEVEL SECURITY;

-- Users can view their own usage
CREATE POLICY "Users can view own license usage"
    ON license_usage FOR SELECT
    USING (auth.uid() = user_id);

-- Only service role can insert/update usage
CREATE POLICY "Service role can manage license usage"
    ON license_usage FOR ALL
    USING (auth.jwt()->>'role' = 'service_role')
    WITH CHECK (auth.jwt()->>'role' = 'service_role');

-- Create view for user licenses with usage
CREATE OR REPLACE VIEW user_licenses AS
SELECT 
    l.*,
    COALESCE(SUM(lu.requests), 0) as total_requests,
    MAX(lu.last_request_at) as last_used_at
FROM licenses l
LEFT JOIN license_usage lu ON l.id = lu.license_id
GROUP BY l.id;

-- Grant access to the view
GRANT SELECT ON user_licenses TO authenticated; 