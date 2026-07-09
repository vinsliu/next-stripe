export type Product = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
};

export const PRODUCTS: Product[] = [
  {
    id: "ebook-nextjs",
    name: "E-book — Next.js en profondeur",
    description: "Un guide complet pour maîtriser l'App Router.",
    priceCents: 1500,
  },
  {
    id: "video-course-stripe",
    name: "Cours vidéo — Intégrer Stripe",
    description: "3h de vidéo pour intégrer les paiements dans une app.",
    priceCents: 3000,
  },
  {
    id: "template-dashboard",
    name: "Template — Dashboard Admin",
    description: "Un template prêt à l'emploi pour vos back-offices.",
    priceCents: 4500,
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((product) => product.id === id);
}

export const PREMIUM_SUBSCRIPTION = {
  name: "Abonnement Premium",
  priceCents: 999,
  interval: "month" as const,
};
