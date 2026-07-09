import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="flex flex-1 flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">Mes commandes</h1>
      {orders.length === 0 ? (
        <p className="text-zinc-500">Aucune commande pour le moment.</p>
      ) : (
        <table className="w-full max-w-2xl text-left text-sm">
          <thead>
            <tr className="border-b border-black/10">
              <th className="py-2">Produit</th>
              <th className="py-2">Montant</th>
              <th className="py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-black/5"
              >
                <td className="py-2">{order.product}</td>
                <td className="py-2">{(order.amount / 100).toFixed(2)} €</td>
                <td className="py-2">
                  {order.createdAt.toLocaleDateString("fr-FR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
