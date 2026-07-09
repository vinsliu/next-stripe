import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSubscriptionCheckout } from "@/app/actions";
import { PREMIUM_SUBSCRIPTION } from "@/lib/products";

export default async function PremiumPage() {
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

  if (!user.isPremium) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
        <h1 className="text-2xl font-semibold">Espace Premium</h1>
        <p className="max-w-md text-zinc-500">
          Cette section est réservée aux abonnés. Souscrivez à l&apos;offre
          Premium pour y accéder.
        </p>
        <form action={createSubscriptionCheckout}>
          <button
            type="submit"
            className="rounded bg-foreground px-6 py-3 text-background"
          >
            S&apos;abonner — {(PREMIUM_SUBSCRIPTION.priceCents / 100).toFixed(2)}{" "}
            €/mois
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold">Bienvenue dans l&apos;espace Premium</h1>
      <p className="max-w-md text-zinc-500">
        Merci pour votre abonnement ! Voici votre contenu exclusif.
      </p>
    </main>
  );
}
