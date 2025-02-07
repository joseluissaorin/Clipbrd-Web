import { createClient } from "@/libs/supabase/server";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

export async function POST(req) {
  try {
    const supabase = createClient();
    const { userId } = await req.json();

    // Verify user is authenticated
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.id !== userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get user's profile with customer ID
    const { data: profile } = await supabase
      .from("profiles")
      .select("customer_id")
      .eq("id", userId)
      .single();

    if (!profile?.customer_id) {
      return NextResponse.json(
        { error: "No customer ID found" },
        { status: 404 }
      );
    }

    // Get customer's subscriptions from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.customer_id,
      limit: 1,
      status: 'active',
    });

    // Get the active subscription
    const subscription = subscriptions.data[0];

    if (!subscription) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    // Update profile with latest subscription data
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        subscription_status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000),
        cancel_at_period_end: subscription.cancel_at_period_end,
        subscription_id: subscription.id,
      })
      .eq("id", userId);

    if (updateError) {
      console.error('Error updating profile:', updateError);
    }

    return NextResponse.json({
      subscription: {
        status: subscription.status,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end,
        id: subscription.id
      }
    });
  } catch (error) {
    console.error("Error in customer portal:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
} 