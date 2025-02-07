import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { 
  handleSubscriptionCreated, 
  handleSubscriptionUpdated, 
  handleSubscriptionDeleted 
} from "@/libs/subscription";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(req) {
  try {
    const body = await req.text();
    const signature = headers().get("Stripe-Signature");

    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const session = event.data.object;

    switch (event.type) {
      case "checkout.session.completed": {
        const subscription = await stripe.subscriptions.retrieve(
          session.subscription
        );
        await handleSubscriptionCreated(subscription, session.client_reference_id);
        break;
      }

      case "customer.subscription.updated": {
        await handleSubscriptionUpdated(session);
        break;
      }

      case "customer.subscription.deleted": {
        await handleSubscriptionDeleted(session);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error in Stripe webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export const runtime = "edge";
