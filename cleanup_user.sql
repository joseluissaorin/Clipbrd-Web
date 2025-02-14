-- Cleanup script for user data
-- Replace USER_ID with the actual user ID: 2a409faf-8402-4e1d-a84f-76c9939a2338

-- First, delete any active licenses
DELETE FROM licenses WHERE user_id = '2a409faf-8402-4e1d-a84f-76c9939a2338';

-- Delete profile data
DELETE FROM profiles WHERE id = '2a409faf-8402-4e1d-a84f-76c9939a2338';

-- Delete auth user (must be done through Supabase auth API)
-- This will be handled through the dashboard 