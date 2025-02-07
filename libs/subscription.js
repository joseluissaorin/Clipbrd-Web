import { createClient } from "@/libs/supabase/server";
import { generateLicense, revokeLicense } from "@/libs/licenses";

export async function getSubscriptionStatus(userId) {
  const supabase = createClient();

  try {
    // Get user's profile and active subscription
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(`
        subscription_id,
        subscription_status,
        current_period_end,
        cancel_at_period_end,
        customer_id
      `)
      .eq("id", userId)
      .single();

    if (profileError) throw profileError;

    // Try to get user's licenses from the new view first
    const { data: newLicenses, error: newLicensesError } = await supabase
      .from("user_licenses")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active");

    // If the new view doesn't exist, fall back to direct licenses query
    if (newLicensesError && newLicensesError.code === "42P01") { // relation does not exist
      const { data: oldLicenses, error: oldLicensesError } = await supabase
        .from("licenses")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "active");

      if (oldLicensesError) throw oldLicensesError;

      return {
        isActive: profile?.subscription_status === "active",
        subscription: {
          id: profile?.subscription_id,
          status: profile?.subscription_status,
          currentPeriodEnd: profile?.current_period_end,
          cancelAtPeriodEnd: profile?.cancel_at_period_end,
          customerId: profile?.customer_id,
        },
        licenses: oldLicenses || [],
      };
    }

    if (newLicensesError) throw newLicensesError;

    return {
      isActive: profile?.subscription_status === "active",
      subscription: {
        id: profile?.subscription_id,
        status: profile?.subscription_status,
        currentPeriodEnd: profile?.current_period_end,
        cancelAtPeriodEnd: profile?.cancel_at_period_end,
        customerId: profile?.customer_id,
      },
      licenses: newLicenses || [],
    };
  } catch (error) {
    console.error("Error getting subscription status:", error);
    throw error;
  }
}

async function updateOrCreateLicense(supabase, userId, subscription, subscriptionEndDate) {
  // Get existing active license and check expiration date
  const { data: existingLicense, error: licenseQueryError } = await supabase
    .from("licenses")
    .select("*")
    .eq("subscription_id", subscription.id)
    .eq("status", "active")
    .single();

  if (licenseQueryError && licenseQueryError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    throw licenseQueryError;
  }

  if (existingLicense) {
    const licenseExpiryDate = new Date(existingLicense.expires_at);
    
    // Compare dates (ignoring time)
    const shouldUpdateExpiration = 
      licenseExpiryDate.toISOString().split('T')[0] !== 
      subscriptionEndDate.toISOString().split('T')[0];

    if (shouldUpdateExpiration) {
      console.log('License expiration differs from subscription renewal date:', {
        licenseId: existingLicense.id,
        currentExpiration: licenseExpiryDate,
        newExpiration: subscriptionEndDate
      });

      // Update license expiration to match subscription renewal
      const { error: licenseUpdateError } = await supabase
        .from("licenses")
        .update({
          expires_at: subscriptionEndDate,
          status: "active",
        })
        .eq("id", existingLicense.id);

      if (licenseUpdateError) throw licenseUpdateError;
      
      console.log('Successfully updated license expiration date');
    } else {
      console.log('License expiration already matches subscription renewal date, no update needed');
    }
  } else {
    console.log('No active license found, generating new license');
    // Generate new license if none exists
    try {
      await supabase.rpc("create_license", {
        p_user_id: userId,
        p_subscription_id: subscription.id,
        p_expires_at: subscriptionEndDate,
      });
    } catch (rpcError) {
      console.log("Falling back to direct license creation");
      await generateLicense(
        userId,
        subscription.id,
        subscriptionEndDate
      );
    }
  }
}

export async function handleSubscriptionCreated(subscription, userId) {
  const supabase = createClient();

  try {
    const subscriptionEndDate = new Date(subscription.current_period_end * 1000);

    console.log('Handling subscription creation:', {
      userId,
      subscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: subscriptionEndDate
    });

    // Update profile with subscription info
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        subscription_id: subscription.id,
        subscription_status: subscription.status,
        current_period_end: subscriptionEndDate,
        cancel_at_period_end: subscription.cancel_at_period_end,
        customer_id: subscription.customer,
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    // Always check and update license on subscription creation
    if (subscription.status === "active") {
      await updateOrCreateLicense(supabase, userId, subscription, subscriptionEndDate);
    }
  } catch (error) {
    console.error("Error handling subscription created:", error);
    throw error;
  }
}

export async function handleSubscriptionUpdated(subscription) {
  const supabase = createClient();

  try {
    // Get the user ID from the subscription metadata
    const userId = subscription.metadata?.userId;
    if (!userId) throw new Error("No user ID in subscription metadata");

    const subscriptionEndDate = new Date(subscription.current_period_end * 1000);

    console.log('Handling subscription update:', {
      userId,
      subscriptionId: subscription.id,
      status: subscription.status,
      currentPeriodEnd: subscriptionEndDate
    });

    // Update profile with new subscription info
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        subscription_status: subscription.status,
        current_period_end: subscriptionEndDate,
        cancel_at_period_end: subscription.cancel_at_period_end,
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    // Handle license updates based on subscription status
    if (subscription.status === "active") {
      await updateOrCreateLicense(supabase, userId, subscription, subscriptionEndDate);
    } else if (subscription.status === "canceled" || subscription.status === "unpaid") {
      console.log('Revoking licenses for canceled/unpaid subscription');
      // Revoke all active licenses for this subscription
      const { error: revokeError } = await supabase
        .from("licenses")
        .update({ status: "revoked" })
        .eq("subscription_id", subscription.id)
        .eq("status", "active");

      if (revokeError) throw revokeError;
    }
  } catch (error) {
    console.error("Error handling subscription updated:", error);
    throw error;
  }
}

export async function handleSubscriptionDeleted(subscription) {
  const supabase = createClient();

  try {
    // Get the user ID from the subscription metadata
    const userId = subscription.metadata?.userId;
    if (!userId) throw new Error("No user ID in subscription metadata");

    // Update profile
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        subscription_status: "inactive",
        current_period_end: null,
        cancel_at_period_end: false,
        subscription_id: null,
      })
      .eq("id", userId);

    if (updateError) throw updateError;

    // Try to revoke using both methods
    try {
      // New way
      await supabase
        .from("licenses")
        .update({
          status: "revoked",
        })
        .eq("subscription_id", subscription.id);
    } catch (newError) {
      console.log("Falling back to old license revocation");
      // Old way
      const { data: license } = await supabase
        .from("licenses")
        .select("id")
        .eq("subscription_id", subscription.id)
        .eq("status", "active")
        .single();

      if (license) {
        await revokeLicense(license.id);
      }
    }
  } catch (error) {
    console.error("Error handling subscription deleted:", error);
    throw error;
  }
} 