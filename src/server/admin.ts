"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Non autorisé — rôle ADMIN requis.");
  }
  return session.user;
}

// ============================================================================
// LECTURES
// ============================================================================

export async function listOwners() {
  await requireAdmin();
  return prisma.user.findMany({
    where: { role: "OWNER" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { spaces: true } },
      spaces: {
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          city: true,
          status: true,
          area: true,
          monthlyRent: true,
        },
      },
    },
  });
}

export async function listAllSpacesForAdmin() {
  await requireAdmin();
  return prisma.space.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      owner: { select: { id: true, name: true, company: true, email: true } },
    },
  });
}

export async function getAdminStats() {
  await requireAdmin();
  const [owners, spaces, bizdevs, imports] = await Promise.all([
    prisma.user.count({ where: { role: "OWNER" } }),
    prisma.space.count(),
    prisma.user.count({ where: { role: "BIZDEV" } }),
    prisma.sheetVisitImport.count({ where: { status: "PENDING_REVIEW" } }),
  ]);
  return { owners, spaces, bizdevs, pendingImports: imports };
}

// ============================================================================
// CRÉATION D'UN PROPRIÉTAIRE
// ============================================================================

export type CreateOwnerInput = {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  password: string;
};

export type CreateOwnerResult =
  | { ok: true; ownerId: string }
  | { ok: false; error: string };

export async function createOwnerAction(
  input: CreateOwnerInput,
): Promise<CreateOwnerResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Non autorisé." };
  }

  const name = input.name.trim();
  const email = input.email.trim().toLowerCase();
  const company = input.company?.trim() || null;
  const phone = input.phone?.trim() || null;
  const password = input.password;

  if (!name || !email || !password) {
    return { ok: false, error: "Nom, email et mot de passe sont obligatoires." };
  }
  if (password.length < 8) {
    return {
      ok: false,
      error: "Le mot de passe doit faire au moins 8 caractères.",
    };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { ok: false, error: "Un utilisateur existe déjà avec cet email." };
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const owner = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      company,
      phone,
      role: "OWNER",
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/proprietaires");

  return { ok: true, ownerId: owner.id };
}

// ============================================================================
// CRÉATION D'UN ESPACE POUR UN PROPRIÉTAIRE
// ============================================================================

export type AdminCreateSpaceInput = {
  ownerId: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  floor?: string;
  area: number;
  capacity: number;
  spaceType: string;
  amenities: string[];
  monthlyRent: number; // euros
  monthlyCharges?: number;
  availabilityDate: string; // YYYY-MM-DD
  description: string;
  worksStatus?: string;
};

export type AdminCreateSpaceResult =
  | { ok: true; spaceId: string }
  | { ok: false; error: string };

export async function adminCreateSpaceAction(
  input: AdminCreateSpaceInput,
): Promise<AdminCreateSpaceResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, error: "Non autorisé." };
  }

  if (!input.name.trim() || !input.address.trim() || !input.city.trim()) {
    return { ok: false, error: "Les champs localisation sont obligatoires." };
  }
  if (input.area <= 0 || input.capacity <= 0) {
    return { ok: false, error: "Superficie et capacité doivent être > 0." };
  }
  if (input.monthlyRent <= 0) {
    return { ok: false, error: "Le loyer doit être > 0." };
  }
  if (!input.spaceType) {
    return { ok: false, error: "Le type d'espace est obligatoire." };
  }
  if (!input.description.trim()) {
    return { ok: false, error: "La description est obligatoire." };
  }

  const owner = await prisma.user.findUnique({
    where: { id: input.ownerId },
    select: { id: true, role: true },
  });
  if (!owner || owner.role !== "OWNER") {
    return { ok: false, error: "Propriétaire introuvable." };
  }

  let availabilityDate: Date;
  try {
    availabilityDate = new Date(input.availabilityDate);
    if (isNaN(availabilityDate.getTime())) throw new Error();
  } catch {
    return { ok: false, error: "Date de disponibilité invalide." };
  }

  const space = await prisma.space.create({
    data: {
      ownerId: owner.id,
      name: input.name.trim(),
      address: input.address.trim(),
      postalCode: input.postalCode.trim(),
      city: input.city.trim(),
      floor: input.floor?.trim() || null,
      area: Math.round(input.area),
      capacity: Math.round(input.capacity),
      spaceType: input.spaceType,
      amenities: input.amenities,
      monthlyRent: Math.round(input.monthlyRent * 100),
      monthlyCharges: input.monthlyCharges
        ? Math.round(input.monthlyCharges * 100)
        : null,
      availabilityDate,
      description: input.description.trim(),
      worksStatus: input.worksStatus?.trim() || null,
      status: "MARKETING", // un admin qui crée un espace a déjà fait l'étude
    },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/proprietaires");
  return { ok: true, spaceId: space.id };
}

export async function adminCreateSpaceAndRedirectAction(
  input: AdminCreateSpaceInput,
) {
  const result = await adminCreateSpaceAction(input);
  if (!result.ok) return result;
  redirect(`/admin/proprietaires`);
}
