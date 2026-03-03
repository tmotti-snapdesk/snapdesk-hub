export type UserRole = "proprietaire" | "entreprise";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  company?: string;
}

export type ProjetStatutProprietaire =
  | "receptionne"
  | "visite_planifiee"
  | "visite_effectuee"
  | "en_discussion"
  | "contrat_signe"
  | "archive";

export interface RapportCommercialisation {
  mois: string;
  visites: number;
  demandes: number;
  tauxOccupation: number;
  commentaire: string;
}

export interface EspaceProprietaire {
  id: string;
  proprietaireId: string;
  nom: string;
  adresse: string;
  ville: string;
  superficie: number;
  capacite: number;
  typeEspace: string;
  description: string;
  loyer: number;
  disponibilite: string;
  photos: string[];
  statut: ProjetStatutProprietaire;
  dateCreation: string;
  rapports: RapportCommercialisation[];
  notes?: string;
}

export type ProjetStatutEntreprise =
  | "en_attente"
  | "espaces_proposes"
  | "selection_faite"
  | "visite_planifiee"
  | "visite_effectuee"
  | "loi_envoyee"
  | "projet_contrat"
  | "contrat_signe";

export interface EspaceDisponible {
  id: string;
  nom: string;
  adresse: string;
  ville: string;
  superficie: number;
  capacite: number;
  typeEspace: string;
  loyer: number;
  disponibilite: string;
  description: string;
  amenagements: string[];
  photo: string;
  score?: number;
}

export interface CahierDesCharges {
  ville: string;
  superficie: number;
  capacite: number;
  budget: number;
  typeEspace: string;
  disponibilite: string;
  amenagements: string[];
  commentaires: string;
}

export interface ProjetEntreprise {
  id: string;
  entrepriseId: string;
  nom: string;
  cahierDesCharges: CahierDesCharges;
  espacesProposes: EspaceDisponible[];
  espacesSelectionnes: string[];
  statut: ProjetStatutEntreprise;
  dateCreation: string;
  dateRendezVous?: string;
  commentaireSelection?: string;
}

// ---- MOCK USERS ----
export const MOCK_USERS: User[] = [
  {
    id: "u1",
    name: "Jean-Marc Dupont",
    email: "proprietaire@demo.com",
    role: "proprietaire",
    company: "Immobilier Dupont SAS",
  },
  {
    id: "u2",
    name: "Sophie Martin",
    email: "entreprise@demo.com",
    role: "entreprise",
    company: "TechFlow Solutions",
  },
];

// ---- MOCK ESPACES PROPRIETAIRE ----
export const MOCK_ESPACES_PROPRIETAIRE: EspaceProprietaire[] = [
  {
    id: "ep1",
    proprietaireId: "u1",
    nom: "Tour Alpha – Plateau 12",
    adresse: "1 Place de la Défense",
    ville: "Paris La Défense",
    superficie: 850,
    capacite: 60,
    typeEspace: "Plateau open-space",
    description:
      "Beau plateau lumineux au 12ème étage de la Tour Alpha, vue panoramique sur La Défense. Livraison clé en main possible.",
    loyer: 42000,
    disponibilite: "2024-07-01",
    photos: [],
    statut: "contrat_signe",
    dateCreation: "2024-01-15",
    rapports: [
      {
        mois: "Janvier 2025",
        visites: 8,
        demandes: 12,
        tauxOccupation: 92,
        commentaire:
          "Très fort démarrage, l'espace est très demandé. Deux nouvelles entreprises intéressées pour Q2.",
      },
      {
        mois: "Février 2025",
        visites: 6,
        demandes: 9,
        tauxOccupation: 95,
        commentaire:
          "Taux d'occupation excellent. Un renouvellement de bail en cours de négociation.",
      },
    ],
    notes: "Contrat signé le 15 mars 2024 pour 3 ans ferme.",
  },
  {
    id: "ep2",
    proprietaireId: "u1",
    nom: "Espace Rivoli",
    adresse: "45 Rue de Rivoli",
    ville: "Paris 1er",
    superficie: 320,
    capacite: 25,
    typeEspace: "Bureaux cloisonnés",
    description:
      "Ensemble de bureaux cloisonnés dans un immeuble haussmannien entièrement rénové. Quartier premium.",
    loyer: 18500,
    disponibilite: "2024-09-01",
    photos: [],
    statut: "en_discussion",
    dateCreation: "2024-03-10",
    rapports: [],
    notes: "",
  },
];

// ---- MOCK ESPACES DISPONIBLES ----
export const MOCK_ESPACES_DISPONIBLES: EspaceDisponible[] = [
  {
    id: "ed1",
    nom: "Coeur Défense – Suite B",
    adresse: "110 Esplanade du Général de Gaulle",
    ville: "Paris La Défense",
    superficie: 450,
    capacite: 30,
    typeEspace: "Open-space modulable",
    loyer: 22500,
    disponibilite: "2024-06-01",
    description:
      "Suite lumineuse dans l'une des tours emblématiques de La Défense. Salles de réunion incluses.",
    amenagements: [
      "Salles de réunion",
      "Cuisine équipée",
      "Parking",
      "Conciergerie",
      "Fibre dédiée",
    ],
    photo: "",
    score: 95,
  },
  {
    id: "ed2",
    nom: "Sentier Tech Hub",
    adresse: "12 Rue du Sentier",
    ville: "Paris 2ème",
    superficie: 280,
    capacite: 20,
    typeEspace: "Coworking privatisé",
    loyer: 14000,
    disponibilite: "2024-05-15",
    description:
      "Au cœur du Silicon Sentier, espace tech avec infrastructure premium. Idéal startups / scale-ups.",
    amenagements: [
      "Fibre dédiée",
      "Salle serveur",
      "Cuisine",
      "Terrasse",
      "Accès 24/7",
    ],
    photo: "",
    score: 88,
  },
  {
    id: "ed3",
    nom: "Opéra Business Center",
    adresse: "8 Boulevard des Capucines",
    ville: "Paris 9ème",
    superficie: 520,
    capacite: 38,
    typeEspace: "Plateau open-space",
    loyer: 26000,
    disponibilite: "2024-07-01",
    description:
      "Grand plateau modulable dans un immeuble premium face à l'Opéra. Prestations haut de gamme.",
    amenagements: [
      "Salles de réunion",
      "Réception",
      "Parking",
      "Restaurant d'entreprise",
      "Terrasse",
    ],
    photo: "",
    score: 82,
  },
];

// ---- MOCK PROJETS ENTREPRISE ----
export const MOCK_PROJETS_ENTREPRISE: ProjetEntreprise[] = [
  {
    id: "pe1",
    entrepriseId: "u2",
    nom: "Recherche Siège Social 2024",
    cahierDesCharges: {
      ville: "Paris",
      superficie: 400,
      capacite: 30,
      budget: 25000,
      typeEspace: "Open-space modulable",
      disponibilite: "2024-06-01",
      amenagements: ["Salles de réunion", "Cuisine", "Parking"],
      commentaires:
        "Idéalement secteur 2ème ou 9ème, accès RER A souhaité.",
    },
    espacesProposes: MOCK_ESPACES_DISPONIBLES,
    espacesSelectionnes: ["ed1", "ed2"],
    statut: "visite_planifiee",
    dateCreation: "2024-04-01",
    dateRendezVous: "2024-05-20",
    commentaireSelection:
      "Nous préférons Coeur Défense pour son accessibilité, et Sentier Tech Hub pour le budget. Prêts pour les visites.",
  },
];

// ---- STATUT LABELS ----
export const STATUT_PROPRIETAIRE_LABELS: Record<
  ProjetStatutProprietaire,
  string
> = {
  receptionne: "Réceptionné",
  visite_planifiee: "Visite planifiée",
  visite_effectuee: "Visite effectuée",
  en_discussion: "En discussion",
  contrat_signe: "Contrat signé",
  archive: "Archivé",
};

export const STATUT_ENTREPRISE_LABELS: Record<ProjetStatutEntreprise, string> =
  {
    en_attente: "En attente",
    espaces_proposes: "Espaces proposés",
    selection_faite: "Sélection transmise",
    visite_planifiee: "Visite planifiée",
    visite_effectuee: "Visite effectuée",
    loi_envoyee: "LOI envoyée",
    projet_contrat: "Projet de contrat",
    contrat_signe: "Contrat signé",
  };

export const STATUT_PROPRIETAIRE_ORDER: ProjetStatutProprietaire[] = [
  "receptionne",
  "visite_planifiee",
  "visite_effectuee",
  "en_discussion",
  "contrat_signe",
];

export const STATUT_ENTREPRISE_ORDER: ProjetStatutEntreprise[] = [
  "en_attente",
  "espaces_proposes",
  "selection_faite",
  "visite_planifiee",
  "visite_effectuee",
  "loi_envoyee",
  "projet_contrat",
  "contrat_signe",
];
