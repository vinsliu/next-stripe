import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold">Paiement annulé</h1>
      <p className="text-zinc-500">Vous pouvez réessayer à tout moment.</p>
      <Link href="/shop" className="underline">
        Retour à la boutique
      </Link>
    </main>
  );
}
