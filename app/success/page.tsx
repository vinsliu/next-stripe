import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <h1 className="text-2xl font-semibold">Paiement réussi</h1>
      <p className="text-zinc-500">
        Merci pour votre achat. La confirmation peut prendre quelques
        secondes à apparaître.
      </p>
      <Link href="/" className="underline">
        Retour à l&apos;accueil
      </Link>
    </main>
  );
}
