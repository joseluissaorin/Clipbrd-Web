-- Create analytics_events table
CREATE TABLE analytics_events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_type TEXT NOT NULL,
    event_data JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES auth.users(id),
    license_id UUID REFERENCES licenses(id),
    ip_address TEXT,
    user_agent TEXT
);

-- Create indexes for common queries
CREATE INDEX idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_license_id ON analytics_events(license_id);

-- Create a view for daily event aggregates
CREATE VIEW analytics_daily_events AS
SELECT
    DATE_TRUNC('day', created_at) AS date,
    event_type,
    COUNT(*) as event_count
FROM analytics_events
GROUP BY 1, 2
ORDER BY 1 DESC, 2;

-- Create a view for license usage statistics
CREATE VIEW analytics_license_usage AS
SELECT
    l.id AS license_id,
    l.user_id,
    l.key,
    l.status,
    COUNT(ae.id) as total_verifications,
    COUNT(CASE WHEN ae.event_type = 'license_verify_success' THEN 1 END) as successful_verifications,
    COUNT(CASE WHEN ae.event_type = 'license_verify_failed' THEN 1 END) as failed_verifications,
    MAX(ae.created_at) as last_verification_at
FROM licenses l
LEFT JOIN analytics_events ae ON ae.license_id = l.id
GROUP BY l.id, l.user_id, l.key, l.status;

-- Create a view for user activity
CREATE VIEW analytics_user_activity AS
SELECT
    u.id AS user_id,
    p.email,
    COUNT(DISTINCT l.id) as total_licenses,
    COUNT(ae.id) as total_events,
    MAX(ae.created_at) as last_activity_at
FROM auth.users u
JOIN profiles p ON p.id = u.id
LEFT JOIN licenses l ON l.user_id = u.id
LEFT JOIN analytics_events ae ON ae.user_id = u.id
GROUP BY u.id, p.email;

-- Create RLS policies
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

-- Allow insert for all authenticated users
CREATE POLICY "Allow insert for authenticated users"
ON analytics_events FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow select for admin users only
CREATE POLICY "Allow select for admin users only"
ON analytics_events FOR SELECT
TO authenticated
USING (auth.jwt() ->> 'email' IN (
    SELECT email FROM profiles WHERE role = 'admin'
)); 