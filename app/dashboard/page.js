import { createClient } from "@/libs/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./client";
import Stripe from "stripe";
import { generateLicense } from "@/libs/licenses";

// This will log during server-side rendering
console.log('=================== DASHBOARD PAGE RENDER START ===================');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function checkAndUpdateLicenseExpiration(supabase, license, subscription) {
  if (!license || !subscription || subscription.status !== 'active') {
    return license;
  }

  const subscriptionEndDate = new Date(subscription.current_period_end * 1000);
  const licenseExpiryDate = new Date(license.expires_at);

  // Compare dates (ignoring time)
  const shouldUpdateExpiration = 
    licenseExpiryDate.toISOString().split('T')[0] !== 
    subscriptionEndDate.toISOString().split('T')[0];

  if (shouldUpdateExpiration) {
    console.log('License expiration differs from subscription renewal date:', {
      licenseId: license.id,
      currentExpiration: licenseExpiryDate,
      newExpiration: subscriptionEndDate
    });

    // Update license expiration to match subscription renewal
    const { data: updatedLicense, error: licenseUpdateError } = await supabase
      .from("licenses")
      .update({
        expires_at: subscriptionEndDate,
        status: "active",
      })
      .eq("id", license.id)
      .select()
      .single();

    if (licenseUpdateError) {
      console.error('Error updating license expiration:', licenseUpdateError);
      return license;
    }

    console.log('Successfully updated license expiration date');
    return updatedLicense;
  }

  return license;
}

async function createLicenseForUser(supabase, userId, subscriptionId, expiresAt) {
  console.log('Creating new license for user:', {
    userId,
    subscriptionId,
    expiresAt: new Date(expiresAt * 1000)
  });

  try {
    const license = await generateLicense(
      userId,
      subscriptionId,
      new Date(expiresAt * 1000)
    );

    console.log('License created successfully:', license);
    return license;
  } catch (error) {
    console.error('Error generating license:', error);
    return null;
  }
}

export default async function DashboardPage() {
  try {
    const supabase = createClient();
    console.log('Supabase client created');

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      console.log('No user found, redirecting to login');
      redirect("/login");
    }

    console.log('User found:', { id: user.id, email: user.email });

    // Get profile with customer ID
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      throw profileError;
    }

    console.log('Profile data:', profile);

    // Get active license
    const { data: initialLicense, error: licenseError } = await supabase
      .from("licenses")
      .select("id, key, display_key, status, expires_at, user_id, subscription_id")
      .eq("user_id", user.id)
      .eq("status", "active")
      .single();

    if (licenseError && licenseError.code !== 'PGRST116') {
      console.error('License error:', licenseError);
    }

    console.log('Initial license data:', {
      id: initialLicense?.id,
      key: initialLicense?.key,
      display_key: initialLicense?.display_key,
      status: initialLicense?.status,
      expires_at: initialLicense?.expires_at,
      user_id: initialLicense?.user_id,
      subscription_id: initialLicense?.subscription_id
    });

    let subscription = null;
    let customer_id = profile?.customer_id;
    let license = initialLicense;

    // If no customer_id in profile, try to find it in Stripe
    if (!customer_id) {
      console.log('Searching for customer in Stripe by email:', user.email);
      try {
        const customers = await stripe.customers.list({
          email: user.email,
          limit: 1
        });

        if (customers.data.length > 0) {
          customer_id = customers.data[0].id;
          console.log('Found customer in Stripe:', customer_id);

          // Update profile with customer_id
          await supabase
            .from("profiles")
            .update({ customer_id })
            .eq("id", user.id);
        }
      } catch (error) {
        console.error('Stripe customer search error:', error);
      }
    }

    // Get subscription data from Stripe
    if (customer_id) {
      console.log('Fetching subscription for customer:', customer_id);
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: customer_id,
          limit: 1,
          expand: ['data.plan.product']
        });

        console.log('Stripe subscriptions:', subscriptions.data);

        if (subscriptions.data.length > 0) {
          const stripeSubscription = subscriptions.data[0];
          subscription = {
            status: stripeSubscription.status,
            current_period_end: stripeSubscription.current_period_end,
            cancel_at_period_end: stripeSubscription.cancel_at_period_end,
            id: stripeSubscription.id,
            customer_id
          };

          // Update profile with subscription data
          await supabase
            .from("profiles")
            .update({
              subscription_status: stripeSubscription.status,
              current_period_end: new Date(stripeSubscription.current_period_end * 1000),
              cancel_at_period_end: stripeSubscription.cancel_at_period_end,
              subscription_id: stripeSubscription.id,
            })
            .eq("id", user.id);

          // Check and update license expiration if needed
          if (license && stripeSubscription.status === 'active') {
            license = await checkAndUpdateLicenseExpiration(supabase, license, subscription);
          }
          // If no license exists but subscription is active, create one
          else if (!license && stripeSubscription.status === 'active') {
            console.log('Active subscription found but no license exists. Generating license...');
            const newLicense = await createLicenseForUser(
              supabase,
              user.id,
              stripeSubscription.id,
              stripeSubscription.current_period_end
            );

            if (newLicense) {
              console.log('New license generated successfully:', newLicense);
              license = newLicense;
            }
          }
        }
      } catch (error) {
        console.error('Stripe subscription error:', error);
      }
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

    console.log('=================== FINAL USER DATA ===================');
    console.log(JSON.stringify(userData, null, 2));
    console.log('=====================================================');

    return <DashboardClient {...userData} />;
  } catch (error) {
    console.error('Dashboard error:', error);
    throw error;
  }
}
