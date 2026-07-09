import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { PRODUCTS } from "@/lib/products";
import { createProductCheckout } from "@/app/actions";

export default async function ShopPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex flex-1 flex-col gap-8 p-8">
      <h1 className="text-2xl font-semibold">Boutique</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {PRODUCTS.map((product) => (
          <div
            key={product.id}
            className="flex flex-col gap-3 rounded border border-black/10 p-6"
          >
            <h2 className="font-semibold">{product.name}</h2>
            <p className="flex-1 text-sm text-zinc-500">
              {product.description}
            </p>
            <p className="font-medium">
              {(product.priceCents / 100).toFixed(2)} €
            </p>
            <form action={createProductCheckout}>
              <input type="hidden" name="productId" value={product.id} />
              <button
                type="submit"
                className="w-full rounded bg-foreground px-4 py-2 text-background"
              >
                Acheter
              </button>
            </form>
          </div>
        ))}
      </div>
    </main>
  );
}
