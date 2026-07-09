"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getProductById, PREMIUM_SUBSCRIPTION } from "@/lib/products";

async function requireUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    redirect("/login");
  }

  return user;
}

async function getOrCreateStripeCustomerId(user: {
  id: string;
  email: string;
  stripeCustomerId: string | null;
}) {
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({ email: user.email });

  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}

export async function createProductCheckout(formData: FormData) {
  const productId = formData.get("productId");

  if (typeof productId !== "string") {
    throw new Error("Produit invalide.");
  }

  const product = getProductById(productId);

  if (!product) {
    throw new Error("Produit introuvable.");
  }

  const user = await requireUser();
  const customerId = await getOrCreateStripeCustomerId(user);
  const origin = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "payment",
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: product.priceCents,
          product_data: {
            name: product.name,
            description: product.description,
          },
        },
      },
    ],
    metadata: {
      userId: user.id,
      productId: product.id,
      productName: product.name,
    },
    success_url: `${origin}/success`,
    cancel_url: `${origin}/cancel`,
  });

  if (!checkoutSession.url) {
    throw new Error("Impossible de créer la session de paiement.");
  }

  redirect(checkoutSession.url);
}

export async function createSubscriptionCheckout() {
  const user = await requireUser();
  const customerId = await getOrCreateStripeCustomerId(user);
  const origin = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    payment_method_types: ["card"],
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "eur",
          unit_amount: PREMIUM_SUBSCRIPTION.priceCents,
          recurring: { interval: PREMIUM_SUBSCRIPTION.interval },
          product_data: {
            name: PREMIUM_SUBSCRIPTION.name,
          },
        },
      },
    ],
    metadata: {
      userId: user.id,
    },
    success_url: `${origin}/success`,
    cancel_url: `${origin}/cancel`,
  });

  if (!checkoutSession.url) {
    throw new Error("Impossible de créer la session d'abonnement.");
  }

  redirect(checkoutSession.url);
}
