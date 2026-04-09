"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { formatVisitReport } from "@/lib/gemini";

// ============================================================================
// Helpers d'autorisation
// ============================================================================

async function requireBizdevOrAdmin() {
  const session = await auth();
  if (
    !session?.user ||
    (session.user.role !== "BIZDEV" && session.user.role !== "ADMIN")
  ) {
    throw new Error("Non autorisé — rôle BIZDEV ou ADMIN requis.");
  }
  return session.user;
}

// ============================================================================
// LECTURES (pour l'UI back-office)
// ============================================================================

export async function listPendingImports() {
  await requireBizdevOrAdmin();
  return prisma.sheetVisitImport.findMany({
    where: { status: "PENDING_REVIEW" },
    orderBy: { importedAt: "desc" },
    include: {
      createdBy: { select: { name: true, email: true } },
    },
  });
}

export async function listProcessedImports(limit = 30) {
  await requireBizdevOrAdmin();
  return prisma.sheetVisitImport.findMany({
    where: { status: { in: ["CONVERTED", "DISCARDED"] } },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      createdBy: { select: { name: true } },
      convertedVisit: {
        select: {
          id: true,
          space: { select: { id: true, name: true } },
        },
      },
    },
  });
}

export async function getImportById(importId: string) {
  await requireBizdevOrAdmin();
  return prisma.sheetVisitImport.findUnique({
    where: { id: importId },
    include: {
      createdBy: { select: { id: true, name: true, email: true } },
      convertedVisit: { select: { id: true, spaceId: true } },
    },
  });
}

// ============================================================================
// REFORMULATION (re-run Gemini si besoin)
// ============================================================================

export async function reformatImportAction(
  importId: string,
): Promise<{ ok: true; formatted: string } | { ok: false; error: string }> {
  try {
    await requireBizdevOrAdmin();
  } catch {
    return { ok: false, error: "Non autorisé." };
  }

  const imp = await prisma.sheetVisitImport.findUnique({
    where: { id: importId },
  });
  if (!imp) return { ok: false, error: "Import introuvable." };
  if (imp.status !== "PENDING_REVIEW") {
    return { ok: false, error: "Cet import n'est plus modifiable." };
  }

  let formatted: string;
  try {
    formatted = await formatVisitReport({
      visitDate: imp.visitDate,
      prospectCompany: imp.sheetClient,
      prospectContact: null,
      attendees: null,
      spaceName: imp.sheetSpaceName,
      rawNotes: imp.rawNotes,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue.";
    return { ok: false, error: `Échec de la reformulation IA : ${message}` };
  }

  await prisma.sheetVisitImport.update({
    where: { id: importId },
    data: { formattedReport: formatted },
  });

  revalidatePath(`/bizdev/imports/${importId}`);
  return { ok: true, formatted };
}

// ============================================================================
// MISE À JOUR MANUELLE DU CR FORMATÉ
// ============================================================================

export async function updateImportFormattedReportAction(
  importId: string,
  formattedReport: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireBizdevOrAdmin();
  } catch {
    return { ok: false, error: "Non autorisé." };
  }

  if (!formattedReport.trim()) {
    return { ok: false, error: "Le compte-rendu ne peut pas être vide." };
  }

  const imp = await prisma.sheetVisitImport.findUnique({
    where: { id: importId },
    select: { status: true },
  });
  if (!imp) return { ok: false, error: "Import introuvable." };
  if (imp.status !== "PENDING_REVIEW") {
    return { ok: false, error: "Cet import n'est plus modifiable." };
  }

  await prisma.sheetVisitImport.update({
    where: { id: importId },
    data: { formattedReport: formattedReport.trim() },
  });

  revalidatePath(`/bizdev/imports/${importId}`);
  return { ok: true };
}

// ============================================================================
// CONVERSION EN VISIT (étape clé : le BizDev choisit l'espace)
// ============================================================================

export type ConvertImportInput = {
  importId: string;
  spaceId: string;
};

export async function convertImportToVisitAction(
  input: ConvertImportInput,
): Promise<
  | { ok: true; visitId: string; spaceId: string }
  | { ok: false; error: string }
> {
  let user;
  try {
    user = await requireBizdevOrAdmin();
  } catch {
    return { ok: false, error: "Non autorisé." };
  }

  const imp = await prisma.sheetVisitImport.findUnique({
    where: { id: input.importId },
  });
  if (!imp) return { ok: false, error: "Import introuvable." };
  if (imp.status !== "PENDING_REVIEW") {
    return { ok: false, error: "Cet import a déjà été traité." };
  }
  if (!imp.formattedReport || !imp.formattedReport.trim()) {
    return {
      ok: false,
      error: "Reformule le compte-rendu avant de le convertir.",
    };
  }

  const space = await prisma.space.findUnique({
    where: { id: input.spaceId },
    select: { id: true, ownerId: true },
  });
  if (!space) {
    return { ok: false, error: "Espace introuvable." };
  }

  // Qui sera le createdBy de la Visit ? On prend le BizDev issu du mapping
  // si possible, sinon l'utilisateur connecté.
  const creatorId = imp.createdById ?? user.id;

  // Crée la Visit en FORMATTED (prête à publier, le BizDev relira et publiera
  // depuis la page visite standard)
  const visit = await prisma.visit.create({
    data: {
      spaceId: space.id,
      visitDate: imp.visitDate,
      prospectCompany: imp.sheetClient,
      prospectContact: null,
      attendees: null,
      rawNotes: imp.rawNotes,
      formattedReport: imp.formattedReport,
      status: "FORMATTED",
      createdById: creatorId,
    },
  });

  // Marque l'import comme converti et trace le lien
  await prisma.sheetVisitImport.update({
    where: { id: imp.id },
    data: {
      status: "CONVERTED",
      convertedVisitId: visit.id,
      convertedAt: new Date(),
    },
  });

  revalidatePath(`/bizdev/imports`);
  revalidatePath(`/bizdev/espaces/${space.id}`);
  return { ok: true, visitId: visit.id, spaceId: space.id };
}

/**
 * Convertit l'import ET redirige vers la page visite standard pour
 * permettre au BizDev de publier immédiatement.
 */
export async function convertImportAndRedirectAction(input: ConvertImportInput) {
  const result = await convertImportToVisitAction(input);
  if (!result.ok) return result;
  redirect(`/bizdev/espaces/${result.spaceId}/visites/${result.visitId}`);
}

// ============================================================================
// REJET D'UN IMPORT
// ============================================================================

export async function discardImportAction(
  importId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireBizdevOrAdmin();
  } catch {
    return { ok: false, error: "Non autorisé." };
  }

  const imp = await prisma.sheetVisitImport.findUnique({
    where: { id: importId },
    select: { status: true },
  });
  if (!imp) return { ok: false, error: "Import introuvable." };
  if (imp.status !== "PENDING_REVIEW") {
    return { ok: false, error: "Cet import a déjà été traité." };
  }

  await prisma.sheetVisitImport.update({
    where: { id: importId },
    data: { status: "DISCARDED" },
  });

  revalidatePath(`/bizdev/imports`);
  return { ok: true };
}
