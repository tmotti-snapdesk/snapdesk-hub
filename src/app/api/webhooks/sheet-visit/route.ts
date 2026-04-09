import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { formatVisitReport } from "@/lib/gemini";
import { emailFromInitials } from "@/lib/bizdev-mapping";

/**
 * POST /api/webhooks/sheet-visit
 *
 * Endpoint appelé par le script Apps Script du Google Sheet de suivi des
 * visites, quand la case "Envoi CR Visite ?" est cochée sur une ligne.
 *
 * Authentification : header `X-Snapdesk-Webhook-Secret` doit matcher la var
 * d'env SHEET_WEBHOOK_SECRET (partagée avec Apps Script).
 *
 * Body attendu (JSON) :
 * {
 *   rowNumber: number,
 *   visitDate: string (ISO 8601 ou "DD/MM/YYYY"),
 *   spaceName: string,            // Col E "Espaces"
 *   arrondissement?: string,      // Col F
 *   client?: string,              // Col G "Client"
 *   salesCode: string,            // Col H "Sales" (initiales)
 *   broker?: string,              // Col I "Broker"
 *   visitType?: string,           // Col J "Nombre de visite"
 *   feedback: string,             // Col L "Feedbacks" (raw notes)
 * }
 *
 * Comportement :
 * 1. Valide le secret.
 * 2. Parse et valide les champs obligatoires.
 * 3. Résout le BizDev via ses initiales (best-effort).
 * 4. Crée un SheetVisitImport en PENDING_REVIEW.
 * 5. Appelle Gemini pour reformater (best-effort, ne bloque pas si échec).
 * 6. Renvoie { ok, importId } au Apps Script pour qu'il marque la ligne.
 */
export async function POST(request: Request) {
  // 1. Auth par header
  const secret = request.headers.get("x-snapdesk-webhook-secret");
  const expected = process.env.SHEET_WEBHOOK_SECRET;

  if (!expected) {
    console.error("SHEET_WEBHOOK_SECRET not configured on server");
    return NextResponse.json(
      { ok: false, error: "Server misconfiguration" },
      { status: 500 },
    );
  }
  if (secret !== expected) {
    return NextResponse.json(
      { ok: false, error: "Invalid webhook secret" },
      { status: 401 },
    );
  }

  // 2. Parse body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const payload = body as Record<string, unknown>;

  const spaceName = asString(payload.spaceName);
  const salesCode = asString(payload.salesCode);
  const feedback = asString(payload.feedback);
  const rawVisitDate = payload.visitDate;

  if (!spaceName || !salesCode || !feedback || !rawVisitDate) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Champs obligatoires manquants : spaceName, salesCode, feedback, visitDate.",
      },
      { status: 400 },
    );
  }

  // 3. Parse de la date (accepte ISO, JS Date serialisée, ou DD/MM/YYYY)
  let visitDate: Date;
  try {
    visitDate = parseVisitDate(rawVisitDate);
  } catch (err) {
    return NextResponse.json(
      {
        ok: false,
        error: `Date de visite invalide : ${err instanceof Error ? err.message : "format non reconnu"}`,
      },
      { status: 400 },
    );
  }

  // 4. Résolution du BizDev via ses initiales
  let createdById: string | null = null;
  const bizdevEmail = emailFromInitials(salesCode);
  if (bizdevEmail) {
    const user = await prisma.user.findUnique({
      where: { email: bizdevEmail },
      select: { id: true },
    });
    if (user) {
      createdById = user.id;
    }
  }

  // 5. Création de l'import en PENDING_REVIEW
  const imp = await prisma.sheetVisitImport.create({
    data: {
      status: "PENDING_REVIEW",
      visitDate,
      sheetSpaceName: spaceName.trim(),
      sheetArrondissement: asOptionalString(payload.arrondissement),
      sheetClient: asOptionalString(payload.client),
      sheetSalesCode: salesCode.trim().toUpperCase(),
      sheetBroker: asOptionalString(payload.broker),
      sheetVisitType: asOptionalString(payload.visitType),
      sheetRowNumber: asOptionalNumber(payload.rowNumber),
      rawNotes: feedback.trim(),
      createdById,
    },
  });

  // 6. Appel Gemini pour pré-formater (best-effort : si Gemini échoue,
  //    on renvoie quand même succès au Apps Script, le BizDev pourra
  //    cliquer "Reformuler" depuis l'UI)
  let geminiOk = false;
  let geminiError: string | null = null;
  try {
    const formatted = await formatVisitReport({
      visitDate,
      prospectCompany: imp.sheetClient,
      prospectContact: null,
      attendees: null,
      spaceName: imp.sheetSpaceName,
      rawNotes: imp.rawNotes,
    });
    await prisma.sheetVisitImport.update({
      where: { id: imp.id },
      data: { formattedReport: formatted },
    });
    geminiOk = true;
  } catch (err) {
    geminiError = err instanceof Error ? err.message : "unknown";
    console.error(
      `[sheet-visit webhook] Gemini failed for import ${imp.id}:`,
      geminiError,
    );
  }

  return NextResponse.json({
    ok: true,
    importId: imp.id,
    geminiOk,
    geminiError,
  });
}

// ============================================================================
// Utilities
// ============================================================================

function asString(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return "";
}

function asOptionalString(value: unknown): string | null {
  const s = asString(value);
  return s.trim() ? s.trim() : null;
}

function asOptionalNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const n = Number(value);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/**
 * Parse une date qui peut arriver sous plusieurs formats depuis Apps Script :
 *   - "2026-04-09" ou "2026-04-09T10:00:00.000Z" (ISO)
 *   - "09/04/2026" (format Sheet français)
 *   - number (timestamp millis)
 */
function parseVisitDate(raw: unknown): Date {
  if (raw instanceof Date) return raw;
  if (typeof raw === "number") return new Date(raw);

  if (typeof raw === "string") {
    // ISO
    const iso = new Date(raw);
    if (!isNaN(iso.getTime()) && raw.includes("-")) return iso;

    // DD/MM/YYYY
    const match = raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (match) {
      const [, d, m, y] = match;
      const date = new Date(Number(y), Number(m) - 1, Number(d));
      if (!isNaN(date.getTime())) return date;
    }

    // Dernier recours : Date()
    const fallback = new Date(raw);
    if (!isNaN(fallback.getTime())) return fallback;
  }

  throw new Error(`Format de date non reconnu : ${String(raw)}`);
}
