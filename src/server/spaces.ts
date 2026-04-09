"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Prisma, Space, SpacePhoto, CommercializationReport, Visit } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

// ============================================================================
// LECTURES
// ============================================================================

/**
 * Liste les espaces d'un propriétaire, du plus récent au plus ancien.
 */
export async function getSpacesForOwner(ownerId: string) {
  return prisma.space.findMany({
    where: { ownerId },
    orderBy: { createdAt: "desc" },
    include: {
      photos: { orderBy: { order: "asc" } },
      _count: {
        select: {
          commercializationReports: { where: { status: "PUBLISHED" } },
          visits: { where: { status: "PUBLISHED" } },
        },
      },
    },
  });
}

export type SpaceWithCounts = Awaited<ReturnType<typeof getSpacesForOwner>>[number];

/**
 * Détail d'un espace avec ses rapports publiés + visites publiées.
 * Vérifie que l'espace appartient bien au propriétaire connecté.
 */
export async function getSpaceByIdForOwner(spaceId: string, ownerId: string) {
  const space = await prisma.space.findFirst({
    where: { id: spaceId, ownerId },
    include: {
      photos: { orderBy: { order: "asc" } },
      profitabilityStudy: true,
      commercializationReports: {
        where: { status: "PUBLISHED" },
        orderBy: { month: "desc" },
      },
      visits: {
        where: { status: "PUBLISHED" },
        orderBy: { visitDate: "desc" },
      },
    },
  });
  return space;
}

export type SpaceDetail = NonNullable<
  Awaited<ReturnType<typeof getSpaceByIdForOwner>>
> & {
  photos: SpacePhoto[];
  commercializationReports: CommercializationReport[];
  visits: Visit[];
};

// ============================================================================
// SOUMISSION D'UN NOUVEL ESPACE
// ============================================================================

export type CreateSpaceInput = {
  name: string;
  address: string;
  postalCode: string;
  city: string;
  floor?: string;
  area: number;
  capacity: number;
  spaceType: string;
  amenities: string[];
  monthlyRent: number; // en euros entiers, converti en centimes côté serveur
  monthlyCharges?: number; // en euros entiers, idem
  availabilityDate: string; // YYYY-MM-DD
  description: string;
  worksStatus?: string;
};

export type CreateSpaceResult =
  | { ok: true; spaceId: string }
  | { ok: false; error: string };

/**
 * Crée un nouvel espace dans la BDD pour le propriétaire connecté.
 * Appelé depuis le wizard /proprietaire/nouvel-espace.
 */
export async function createSpaceAction(
  input: CreateSpaceInput,
): Promise<CreateSpaceResult> {
  const session = await auth();
  if (!session?.user || session.user.role !== "OWNER") {
    return { ok: false, error: "Non autorisé." };
  }

  // Validations serveur (safety net en plus du client)
  if (!input.name.trim() || !input.address.trim() || !input.city.trim()) {
    return { ok: false, error: "Les champs localisation sont obligatoires." };
  }
  if (input.area <= 0 || input.capacity <= 0) {
    return { ok: false, error: "Superficie et capacité doivent être > 0." };
  }
  if (input.monthlyRent <= 0) {
    return { ok: false, error: "Le loyer doit être supérieur à 0." };
  }
  if (!input.spaceType) {
    return { ok: false, error: "Le type d'espace est obligatoire." };
  }

  let availabilityDate: Date;
  try {
    availabilityDate = new Date(input.availabilityDate);
    if (isNaN(availabilityDate.getTime())) throw new Error("Invalid date");
  } catch {
    return { ok: false, error: "Date de disponibilité invalide." };
  }

  const data: Prisma.SpaceCreateInput = {
    owner: { connect: { id: session.user.id } },
    name: input.name.trim(),
    address: input.address.trim(),
    postalCode: input.postalCode.trim(),
    city: input.city.trim(),
    floor: input.floor?.trim() || null,
    area: Math.round(input.area),
    capacity: Math.round(input.capacity),
    spaceType: input.spaceType,
    amenities: input.amenities,
    monthlyRent: Math.round(input.monthlyRent * 100), // euros → centimes
    monthlyCharges: input.monthlyCharges
      ? Math.round(input.monthlyCharges * 100)
      : null,
    availabilityDate,
    description: input.description.trim(),
    worksStatus: input.worksStatus?.trim() || null,
    status: "RECEIVED",
  };

  const space: Space = await prisma.space.create({ data });

  // Invalide les pages qui affichent la liste
  revalidatePath("/proprietaire");
  revalidatePath("/proprietaire/projets");

  return { ok: true, spaceId: space.id };
}

/**
 * Variante qui redirige directement après création. Utilisée par le wizard.
 */
export async function createSpaceAndRedirectAction(input: CreateSpaceInput) {
  const result = await createSpaceAction(input);
  if (!result.ok) return result;
  redirect(`/proprietaire/projets/${result.spaceId}?justCreated=1`);
}
