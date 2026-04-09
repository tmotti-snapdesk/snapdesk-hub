import { SpaceStatus } from "@prisma/client";

/**
 * Labels FR pour l'affichage des statuts d'espace côté propriétaire.
 */
export const SPACE_STATUS_LABELS: Record<SpaceStatus, string> = {
  RECEIVED: "Réceptionné",
  STUDY_IN_PROGRESS: "Étude en cours",
  STUDY_DELIVERED: "Étude remise",
  MARKETING: "En commercialisation",
  IN_DISCUSSION: "En discussion",
  CONTRACT_SIGNED: "Contrat signé",
  ARCHIVED: "Archivé",
};

/**
 * Ordre chronologique des statuts pour la timeline (hors ARCHIVED).
 */
export const SPACE_STATUS_ORDER: SpaceStatus[] = [
  "RECEIVED",
  "STUDY_IN_PROGRESS",
  "STUDY_DELIVERED",
  "MARKETING",
  "IN_DISCUSSION",
  "CONTRACT_SIGNED",
];

/**
 * Classes Tailwind pour colorier les badges de statut.
 */
export const SPACE_STATUS_COLORS: Record<SpaceStatus, string> = {
  RECEIVED: "bg-blue-100 text-[#1C1F25] border-[#A9BCB7]/40",
  STUDY_IN_PROGRESS: "bg-cyan-100 text-cyan-700 border-cyan-200",
  STUDY_DELIVERED: "bg-teal-100 text-teal-700 border-teal-200",
  MARKETING: "bg-orange-100 text-orange-700 border-orange-200",
  IN_DISCUSSION: "bg-purple-100 text-purple-700 border-purple-200",
  CONTRACT_SIGNED: "bg-green-100 text-green-700 border-green-200",
  ARCHIVED: "bg-slate-100 text-slate-500 border-slate-200",
};

/**
 * Types d'espaces proposés dans le wizard de soumission.
 */
export const SPACE_TYPES = [
  "Plateau open-space",
  "Bureaux cloisonnés",
  "Coworking privatisé",
  "Immeuble de bureaux",
  "Local commercial converti",
  "Autre",
] as const;

/**
 * Options d'aménagements disponibles dans le wizard.
 */
export const SPACE_AMENITIES = [
  "Salles de réunion",
  "Cuisine équipée",
  "Parking",
  "Fibre dédiée",
  "Conciergerie",
  "Terrasse / extérieur",
  "Salle de sport",
  "Restaurant d'entreprise",
  "Accès 24/7",
  "Réception / accueil",
] as const;
