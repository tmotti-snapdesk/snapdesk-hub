"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { formatVisitReport } from "@/lib/gemini";
import { sendEmail } from "@/lib/resend";
import { renderVisitReportEmail } from "@/lib/emails/visit-report";

// ============================================================================
// Helpers
// ============================================================================

async function requireBizdev() {
  const session = await auth();
  if (!session?.user || session.user.role !== "BIZDEV") {
    throw new Error("Non autorisé — rôle BIZDEV requis.");
  }
  return session.user;
}

// ============================================================================
// LECTURES
// ============================================================================

export async function listVisitsForSpace(spaceId: string) {
  await requireBizdev();
  return prisma.visit.findMany({
    where: { spaceId },
    orderBy: { visitDate: "desc" },
    include: {
      createdBy: { select: { name: true } },
    },
  });
}

export async function getVisitById(visitId: string) {
  await requireBizdev();
  return prisma.visit.findUnique({
    where: { id: visitId },
    include: {
      space: {
        select: {
          id: true,
          name: true,
          owner: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });
}

// ============================================================================
// CRÉATION D'UNE VISITE (brouillon initial)
// ============================================================================

export type CreateVisitInput = {
  spaceId: string;
  visitDate: string; // YYYY-MM-DD
  prospectCompany?: string;
  prospectContact?: string;
  attendees?: string;
  rawNotes: string;
};

export type CreateVisitResult =
  | { ok: true; visitId: string }
  | { ok: false; error: string };

export async function createVisitAction(
  input: CreateVisitInput,
): Promise<CreateVisitResult> {
  let bizdev;
  try {
    bizdev = await requireBizdev();
  } catch {
    return { ok: false, error: "Non autorisé." };
  }

  if (!input.rawNotes.trim()) {
    return { ok: false, error: "Les notes brutes sont obligatoires." };
  }

  let visitDate: Date;
  try {
    visitDate = new Date(input.visitDate);
    if (isNaN(visitDate.getTime())) throw new Error("Invalid");
  } catch {
    return { ok: false, error: "Date de visite invalide." };
  }

  // Vérifie que l'espace existe bien
  const space = await prisma.space.findUnique({
    where: { id: input.spaceId },
    select: { id: true },
  });
  if (!space) {
    return { ok: false, error: "Espace introuvable." };
  }

  const visit = await prisma.visit.create({
    data: {
      spaceId: input.spaceId,
      visitDate,
      prospectCompany: input.prospectCompany?.trim() || null,
      prospectContact: input.prospectContact?.trim() || null,
      attendees: input.attendees?.trim() || null,
      rawNotes: input.rawNotes.trim(),
      status: "DRAFT",
      createdById: bizdev.id,
    },
  });

  revalidatePath(`/bizdev/espaces/${input.spaceId}`);
  return { ok: true, visitId: visit.id };
}

export async function createVisitAndRedirectAction(input: CreateVisitInput) {
  const result = await createVisitAction(input);
  if (!result.ok) return result;
  redirect(
    `/bizdev/espaces/${input.spaceId}/visites/${result.visitId}?justCreated=1`,
  );
}

// ============================================================================
// SAUVEGARDE DES NOTES BRUTES (pour permettre l'édition)
// ============================================================================

export async function updateRawNotesAction(
  visitId: string,
  rawNotes: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireBizdev();
  } catch {
    return { ok: false, error: "Non autorisé." };
  }

  if (!rawNotes.trim()) {
    return { ok: false, error: "Les notes brutes ne peuvent pas être vides." };
  }

  await prisma.visit.update({
    where: { id: visitId },
    data: { rawNotes: rawNotes.trim() },
  });

  revalidatePath(`/bizdev/espaces/[id]/visites/${visitId}`, "page");
  return { ok: true };
}

// ============================================================================
// REFORMULATION PAR GEMINI
// ============================================================================

export async function formatVisitReportAction(
  visitId: string,
): Promise<{ ok: true; formatted: string } | { ok: false; error: string }> {
  try {
    await requireBizdev();
  } catch {
    return { ok: false, error: "Non autorisé." };
  }

  const visit = await prisma.visit.findUnique({
    where: { id: visitId },
    include: { space: { select: { name: true } } },
  });
  if (!visit) {
    return { ok: false, error: "Visite introuvable." };
  }

  let formatted: string;
  try {
    formatted = await formatVisitReport({
      visitDate: visit.visitDate,
      prospectCompany: visit.prospectCompany,
      prospectContact: visit.prospectContact,
      attendees: visit.attendees,
      spaceName: visit.space.name,
      rawNotes: visit.rawNotes,
    });
  } catch (err) {
    console.error("Gemini formatVisitReport failed:", err);
    const message =
      err instanceof Error
        ? err.message
        : "Erreur inconnue lors de la reformulation.";
    return { ok: false, error: `Échec de la reformulation IA : ${message}` };
  }

  await prisma.visit.update({
    where: { id: visitId },
    data: {
      formattedReport: formatted,
      status: "FORMATTED",
    },
  });

  revalidatePath(`/bizdev/espaces/[id]/visites/${visitId}`, "page");
  return { ok: true, formatted };
}

// ============================================================================
// ÉDITION MANUELLE DU CR FORMATÉ (BizDev peut ajuster après le LLM)
// ============================================================================

export async function updateFormattedReportAction(
  visitId: string,
  formattedReport: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireBizdev();
  } catch {
    return { ok: false, error: "Non autorisé." };
  }

  if (!formattedReport.trim()) {
    return { ok: false, error: "Le compte-rendu ne peut pas être vide." };
  }

  await prisma.visit.update({
    where: { id: visitId },
    data: {
      formattedReport: formattedReport.trim(),
      status: "FORMATTED",
    },
  });

  revalidatePath(`/bizdev/espaces/[id]/visites/${visitId}`, "page");
  return { ok: true };
}

// ============================================================================
// PUBLICATION + EMAIL AU PROPRIÉTAIRE
// ============================================================================

export async function publishVisitReportAction(
  visitId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    await requireBizdev();
  } catch {
    return { ok: false, error: "Non autorisé." };
  }

  const visit = await prisma.visit.findUnique({
    where: { id: visitId },
    include: {
      space: {
        select: {
          id: true,
          name: true,
          owner: { select: { id: true, name: true, email: true } },
        },
      },
    },
  });
  if (!visit) {
    return { ok: false, error: "Visite introuvable." };
  }
  if (!visit.formattedReport || !visit.formattedReport.trim()) {
    return {
      ok: false,
      error: "Reformule le compte-rendu avant de le publier.",
    };
  }
  if (visit.status === "PUBLISHED") {
    return { ok: false, error: "Ce compte-rendu est déjà publié." };
  }

  // 1. Passe la visite en PUBLISHED
  await prisma.visit.update({
    where: { id: visitId },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  // 2. Crée une notification in-app
  const owner = visit.space.owner;
  const firstName = owner.name.split(" ")[0];
  const notification = await prisma.notification.create({
    data: {
      userId: owner.id,
      type: "VISIT_REPORT_PUBLISHED",
      title: `Nouveau CR de visite pour ${visit.space.name}`,
      body: `Un compte-rendu de visite est disponible dans votre espace propriétaire.`,
      relatedEntityType: "Visit",
      relatedEntityId: visit.id,
    },
  });

  // 3. Envoie l'email (en best-effort : on logge mais on ne casse pas si ça échoue)
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const reportUrl = `${baseUrl}/proprietaire/projets/${visit.space.id}`;
    const email = renderVisitReportEmail({
      ownerFirstName: firstName,
      spaceName: visit.space.name,
      visitDate: visit.visitDate,
      prospectCompany: visit.prospectCompany,
      reportUrl,
    });
    await sendEmail({
      to: owner.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
    });
    await prisma.notification.update({
      where: { id: notification.id },
      data: { emailSent: true, emailSentAt: new Date() },
    });
  } catch (err) {
    console.error("Resend email send failed:", err);
    // On ne remonte pas l'erreur à l'utilisateur — la visite est publiée
    // même si l'email a échoué. Le BizDev pourra relancer plus tard.
  }

  revalidatePath(`/bizdev/espaces/${visit.space.id}`);
  revalidatePath(`/proprietaire/projets/${visit.space.id}`);
  return { ok: true };
}
