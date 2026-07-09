"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="flex items-center justify-between border-b border-black/10 px-6 py-4">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-semibold">
          next-stripe
        </Link>
        <Link href="/shop" className="text-sm">
          Boutique
        </Link>
        <Link href="/premium" className="text-sm">
          Premium
        </Link>
        {session && (
          <Link href="/orders" className="text-sm">
            Mes commandes
          </Link>
        )}
      </div>
      <div className="flex items-center gap-4 text-sm">
        {status === "loading" ? null : session ? (
          <>
            <span className="text-zinc-500">{session.user?.email}</span>
            <button onClick={() => signOut({ callbackUrl: "/" })}>
              Se déconnecter
            </button>
          </>
        ) : (
          <>
            <Link href="/login">Se connecter</Link>
            <Link href="/register">S&apos;inscrire</Link>
          </>
        )}
      </div>
    </nav>
  );
}
