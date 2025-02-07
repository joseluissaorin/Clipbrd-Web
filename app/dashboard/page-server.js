import { createClient } from "@/libs/supabase/server";
import { redirect } from "next/navigation";
import Dashboard from "./page";
import Stripe from "stripe";
import { getLicenseData } from "@/libs/licenses";

// Module level logging
console.log('Loading dashboard server component...');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

// Log when stripe is initialized
console.log('Stripe initialized with API version:', "2023-08-16");

async function getProfileData(supabase, userId) {
  console.log('Fetching profile data for user:', userId);
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (profileError) {
    console.error('Profile error:', profileError);
    return null;
  }

  console.log('Profile data fetched:', profile);
  return profile;
}

async function getLicenseData(supabase, userId) {
  console.log('Fetching license data for user:', userId);
  const { data: license, error: licenseError } = await supabase
    .from("licenses")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (licenseError && licenseError.code !== 'PGRST116') {
    console.error('License error:', licenseError);
  }

  console.log('License data fetched:', license);
  return license;
}

async function getStripeData(email, customerId) {
  console.log('Fetching Stripe data for customer:', customerId || email);
  
  let customer_id = customerId;
  let subscription = null;

  if (!customer_id) {
    try {
      const customers = await stripe.customers.list({
        email: email,
        limit: 1
      });
      
      if (customers.data.length > 0) {
        customer_id = customers.data[0].id;
        console.log('Found customer in Stripe:', customer_id);
      }
    } catch (error) {
      console.error('Error finding Stripe customer:', error);
    }
  }

  if (customer_id) {
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customer_id,
        limit: 1,
        expand: ['data.plan.product']
      });

      if (subscriptions.data.length > 0) {
        subscription = {
          status: subscriptions.data[0].status,
          current_period_end: subscriptions.data[0].current_period_end,
          cancel_at_period_end: subscriptions.data[0].cancel_at_period_end,
          id: subscriptions.data[0].id,
          customer_id: customer_id
        };
        console.log('Found subscription:', subscription);
      }
    } catch (error) {
      console.error('Error fetching Stripe subscription:', error);
    }
  }

  return { customer_id, subscription };
}

export default async function DashboardPage() {
  console.log('DashboardPage function called');
  
  const supabase = createClient();
  console.log('Supabase client created');

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.log('No user found, redirecting to login');
    redirect("/login");
  }

  console.log('User authenticated:', user.email);

  // Get all necessary data
  const profile = await getProfileData(supabase, user.id);
  const license = await getLicenseData(user.id);
  const { customer_id, subscription } = await getStripeData(user.email, profile?.customer_id);

  // Update profile if customer_id was found
  if (customer_id && !profile.customer_id) {
    console.log('Updating profile with customer_id:', customer_id);
    await supabase
      .from("profiles")
      .update({ customer_id })
      .eq("id", user.id);
  }

  // Update profile if subscription was found
  if (subscription) {
    console.log('Updating profile with subscription data');
    await supabase
      .from("profiles")
      .update({
        subscription_status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000),
        cancel_at_period_end: subscription.cancel_at_period_end,
        subscription_id: subscription.id,
      })
      .eq("id", user.id);
  }

  const userData = {
    id: user.id,
    email: user.email,
    subscription: subscription || {
      status: profile?.subscription_status || 'inactive',
      current_period_end: profile?.current_period_end,
      cancel_at_period_end: profile?.cancel_at_period_end,
      id: profile?.subscription_id,
      customer_id
    },
    activeLicense: license
  };

  console.log('Final user data:', userData);

  return <Dashboard {...userData} />;
} 