import { createClient } from "@/libs/supabase/server";
import { getSubscriptionStatus } from "@/libs/subscription";

export async function getUserProfile(userId) {
  const supabase = createClient();

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select(`
        id,
        email,
        full_name,
        customer_id,
        created_at,
        updated_at
      `)
      .eq("id", userId)
      .single();

    if (error) throw error;

    // Get subscription status
    const subscriptionData = await getSubscriptionStatus(userId);

    return {
      ...profile,
      subscription: subscriptionData
    };
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw error;
  }
}

export async function updateUserProfile(userId, updates) {
  const supabase = createClient();

  try {
    const { data: profile, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;
    return profile;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
}

export async function getUserUsage(userId) {
  const supabase = createClient();

  try {
    const { data: usage, error } = await supabase
      .from("license_usage")
      .select(`
        id,
        license_id,
        requests,
        last_request_at,
        created_at
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30); // Last 30 days

    if (error) throw error;

    // Calculate daily usage statistics
    const dailyStats = usage.reduce((acc, day) => {
      const date = new Date(day.created_at).toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          requests: 0
        };
      }
      acc[date].requests += day.requests;
      return acc;
    }, {});

    return Object.values(dailyStats);
  } catch (error) {
    console.error("Error getting user usage:", error);
    throw error;
  }
}

export async function deactivateAccount(userId) {
  const supabase = createClient();

  try {
    // Get user's active licenses
    const { data: licenses } = await supabase
      .from("licenses")
      .select("id")
      .eq("user_id", userId)
      .eq("status", "active");

    // Revoke all active licenses
    if (licenses?.length > 0) {
      const { error: revokeError } = await supabase
        .from("licenses")
        .update({ status: "revoked" })
        .in("id", licenses.map(l => l.id));

      if (revokeError) throw revokeError;
    }

    // Update profile status
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        status: "inactive",
        deactivated_at: new Date().toISOString()
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    return true;
  } catch (error) {
    console.error("Error deactivating account:", error);
    throw error;
  }
} 