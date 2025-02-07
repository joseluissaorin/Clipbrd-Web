import { createClient } from "@/libs/supabase/server";
import { redirect } from "next/navigation";
import AccountPage from "./page";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export default async function AccountPageServer() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Get profile with customer ID
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profileError) {
    console.error('Profile error:', profileError);
    return null;
  }

  let subscription = null;
  
  // If we have a customer ID, get subscription from Stripe
  if (profile?.customer_id) {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: profile.customer_id,
        limit: 1,
        status: 'active',
        expand: ['data.plan.product']
      });

      if (subscriptions.data.length > 0) {
        const stripeSubscription = subscriptions.data[0];
        
        // Update profile with latest subscription data
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            subscription_status: stripeSubscription.status,
            current_period_end: new Date(stripeSubscription.current_period_end * 1000),
            cancel_at_period_end: stripeSubscription.cancel_at_period_end,
            subscription_id: stripeSubscription.id,
          })
          .eq("id", user.id);

        if (updateError) {
          console.error('Error updating profile:', updateError);
        }

        subscription = {
          status: stripeSubscription.status,
          current_period_end: stripeSubscription.current_period_end,
          cancel_at_period_end: stripeSubscription.cancel_at_period_end,
          id: stripeSubscription.id,
          customer_id: profile.customer_id
        };
      }
    } catch (error) {
      console.error('Error fetching Stripe subscription:', error);
    }
  }

  // Get active license
  const { data: license, error: licenseError } = await supabase
    .from("licenses")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (licenseError && licenseError.code !== 'PGRST116') {
    console.error('License error:', licenseError);
  }

  // Format the data for the client
  const userData = {
    id: user.id,
    email: user.email,
    subscription: subscription || {
      status: profile?.subscription_status || 'inactive',
      current_period_end: profile?.current_period_end,
      cancel_at_period_end: profile?.cancel_at_period_end,
      id: profile?.subscription_id,
      customer_id: profile?.customer_id
    },
    license: license || null
  };

  return <AccountPage {...userData} />;
} 