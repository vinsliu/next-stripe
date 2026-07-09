"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { PasswordInput } from "@/components/PasswordInput";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main className="flex flex-1 items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-sm flex-col gap-4 p-8"
      >
        <h1 className="text-2xl font-semibold">Se connecter</h1>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="rounded border border-black/10 px-3 py-2"
        />
        <PasswordInput
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="rounded border border-black/10 px-3 py-2"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-foreground px-4 py-2 text-background disabled:opacity-50"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
        <p className="text-sm text-zinc-500">
          Pas encore de compte ?{" "}
          <Link href="/register" className="underline">
            S&apos;inscrire
          </Link>
        </p>
      </form>
    </main>
  );
}
