import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-3xl font-semibold">Next.js & Stripe</h1>
      <p className="max-w-md text-zinc-500">
        Authentification, vente à l&apos;acte et abonnement Premium, propulsés
        par Stripe.
      </p>
      <div className="flex gap-4">
        <Link
          href="/shop"
          className="rounded bg-foreground px-5 py-3 text-background"
        >
          Voir la boutique
        </Link>
        <Link
          href="/premium"
          className="rounded border border-black/10 px-5 py-3"
        >
          Espace Premium
        </Link>
      </div>
    </main>
  );
}
