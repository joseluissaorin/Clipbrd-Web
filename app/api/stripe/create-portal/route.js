import { NextResponse } from "next/server";
import { createClient } from "@/libs/supabase/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export async function POST(req) {
  try {
    const supabase = createClient();

    // Get user from Supabase
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be logged in to view billing information." },
        { status: 401 }
      );
    }

    // Get user's profile with customer ID
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return NextResponse.json(
        { error: "Error fetching user profile" },
        { status: 500 }
      );
    }

    console.log('Profile data:', profile);

    // If no customer_id in profile, try to find it in Stripe
    if (!profile?.customer_id) {
      try {
        // Search for customer in Stripe by email
        const customers = await stripe.customers.list({
          email: user.email,
          limit: 1
        });

        if (customers.data.length > 0) {
          const customer = customers.data[0];
          
          // Update profile with found customer_id
          const { error: updateError } = await supabase
            .from("profiles")
            .update({ customer_id: customer.id })
            .eq("id", user.id);

          if (updateError) {
            console.error("Error updating profile with customer_id:", updateError);
          }

          profile.customer_id = customer.id;
        }
      } catch (stripeError) {
        console.error("Error searching Stripe customer:", stripeError);
      }
    }

    if (!profile?.customer_id) {
      return NextResponse.json(
        {
          error: "You don't have a billing account yet. Make a purchase first.",
        },
        { status: 400 }
      );
    }

    // Get the base URL with proper scheme
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.clipbrdapp.com';
    const returnUrl = new URL('/dashboard', baseUrl).toString();

    // Create Stripe billing portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.customer_id,
      return_url: returnUrl,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Error creating portal session:", error);
    return NextResponse.json(
      { error: "Error creating billing portal session" },
      { status: 500 }
    );
  }
}
