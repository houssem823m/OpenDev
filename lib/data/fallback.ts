import { Project, Service } from "@/types";

const now = new Date();

export const fallbackServices: Service[] = [
  {
    _id: "static-service-web",
    title: "Développement Web Sur Mesure",
    description:
      "Sites vitrines, applications métiers et portails clients construits avec Next.js, Tailwind et une architecture cloud moderne.",
    slug: "developpement-web-sur-mesure",
    isArchived: false,
    createdAt: new Date(now.getFullYear(), 0, 15),
  },
  {
    _id: "static-service-mobile",
    title: "Applications Mobiles & PWA",
    description:
      "Expériences mobiles rapides, accessibles et installables avec React Native et les Progressive Web Apps.",
    slug: "applications-mobiles",
    isArchived: false,
    createdAt: new Date(now.getFullYear(), 1, 10),
  },
  {
    _id: "static-service-ecommerce",
    title: "E-commerce & Marketplaces",
    description:
      "Catalogue, paiement sécurisé et automatisation des commandes pour booster vos ventes en ligne.",
    slug: "ecommerce-marketplaces",
    isArchived: false,
    createdAt: new Date(now.getFullYear(), 2, 5),
  },
];

export const fallbackProjects: Project[] = [
  {
    _id: "static-project-aurora",
    title: "Aurora Commerce",
    category: "E-commerce",
    description:
      "Migration d'une boutique vers une stack headless performante avec optimisation Lighthouse 95+.",
    mainImage: "",
    externalLink: "https://example.com/aurora",
    isArchived: false,
    createdAt: new Date(now.getFullYear(), 0, 28),
  },
  {
    _id: "static-project-pulse",
    title: "Pulse Santé",
    category: "Application mobile",
    description:
      "Application mobile de télésuivi patient avec synchronisation temps réel et dashboards admin.",
    mainImage: "",
    externalLink: "https://example.com/pulse",
    isArchived: false,
    createdAt: new Date(now.getFullYear(), 1, 18),
  },
  {
    _id: "static-project-studio",
    title: "Studio Créatif",
    category: "Site vitrine",
    description:
      "Refonte d'un site créatif avec animations fluides, vidéo optimisée et CMS headless.",
    mainImage: "",
    externalLink: "https://example.com/studio",
    isArchived: false,
    createdAt: new Date(now.getFullYear(), 2, 2),
  },
];

export const FALLBACK_NOTICE =
  "Données statiques affichées : configurez MONGODB_URI et exécutez `npm run seed` pour activer la base réelle.";


