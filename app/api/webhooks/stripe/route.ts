import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Webhook signature verification failed: ${message}` },
      { status: 400 }
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;

      if (!userId) break;

      if (session.mode === "payment") {
        await prisma.order.create({
          data: {
            userId,
            product: session.metadata?.productName ?? "Produit",
            amount: session.amount_total ?? 0,
          },
        });
      }

      if (session.mode === "subscription") {
        await prisma.user.update({
          where: { id: userId },
          data: { isPremium: true },
        });
      }

      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      const isActive = ["active", "trialing"].includes(subscription.status);

      await prisma.user.updateMany({
        where: { stripeCustomerId: customerId },
        data: { isPremium: isActive },
      });

      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
