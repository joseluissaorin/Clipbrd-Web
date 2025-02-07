import { createClient } from "@/libs/supabase/server";
import { generateSecureToken } from "@/libs/security";

// Create a test user with a subscription
export async function createTestUser() {
  const supabase = createClient();
  const email = `test-${generateSecureToken(8)}@example.com`;
  const password = generateSecureToken(16);

  // Create user
  const { data: auth, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;

  // Create profile
  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      email,
      full_name: "Test User",
      customer_id: `cus_test_${generateSecureToken(16)}`,
    })
    .eq("id", auth.user.id);

  if (profileError) throw profileError;

  return {
    user: auth.user,
    email,
    password,
  };
}

// Create a test subscription
export async function createTestSubscription(userId) {
  const supabase = createClient();
  
  const subscriptionId = `sub_test_${generateSecureToken(16)}`;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

  // Update profile with subscription
  const { error: updateError } = await supabase
    .from("profiles")
    .update({
      subscription_id: subscriptionId,
      subscription_status: "active",
      current_period_end: expiresAt,
    })
    .eq("id", userId);

  if (updateError) throw updateError;

  return {
    subscriptionId,
    expiresAt,
  };
}

// Clean up test data
export async function cleanupTestData(userId) {
  const supabase = createClient();

  // Delete licenses
  await supabase
    .from("licenses")
    .delete()
    .eq("user_id", userId);

  // Delete analytics events
  await supabase
    .from("analytics_events")
    .delete()
    .eq("user_id", userId);

  // Delete profile
  await supabase
    .from("profiles")
    .delete()
    .eq("id", userId);

  // Delete user
  await supabase.auth.admin.deleteUser(userId);
}

// Mock API response
export function mockResponse() {
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
    headers: new Map(),
    setHeader: function(name, value) {
      this.headers.set(name, value);
      return this;
    },
    getHeader: function(name) {
      return this.headers.get(name);
    }
  };
  return res;
}

// Create test license
export async function createTestLicense(userId, subscriptionId) {
  const supabase = createClient();
  
  const licenseKey = `CLPB-TEST-${generateSecureToken(16)}`;
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  const { data, error } = await supabase
    .from("licenses")
    .insert({
      user_id: userId,
      subscription_id: subscriptionId,
      key: licenseKey,
      status: "active",
      expires_at: expiresAt,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    license: data,
    licenseKey,
  };
}

// Mock rate limiter
export const mockRateLimiter = {
  checkRateLimit: jest.fn().mockResolvedValue({ success: true }),
  recordFailedAttempt: jest.fn().mockResolvedValue({ success: true }),
};

// Mock analytics
export const mockAnalytics = {
  trackEvent: jest.fn(),
  trackError: jest.fn(),
  trackConversion: jest.fn(),
}; 