import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { getImportById } from "@/server/sheet-imports";
import { ImportReviewer } from "./ImportReviewer";

export default async function ImportDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [imp, spaces] = await Promise.all([
    getImportById(id),
    prisma.space.findMany({
      orderBy: [{ city: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        city: true,
        owner: { select: { name: true, company: true } },
      },
    }),
  ]);

  if (!imp) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href="/bizdev/imports"
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#1C1F25] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux imports
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-[#1C1F25]">
          Import — Visite du{" "}
          {new Date(imp.visitDate).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </h1>
        <p className="text-slate-500 mt-1">
          Reçu depuis le Google Sheet le{" "}
          {new Date(imp.importedAt).toLocaleString("fr-FR")}
        </p>
      </div>

      <ImportReviewer
        importId={imp.id}
        status={imp.status}
        sheetSpaceName={imp.sheetSpaceName}
        sheetArrondissement={imp.sheetArrondissement}
        sheetClient={imp.sheetClient}
        sheetSalesCode={imp.sheetSalesCode}
        sheetBroker={imp.sheetBroker}
        sheetVisitType={imp.sheetVisitType}
        createdByName={imp.createdBy?.name ?? null}
        rawNotes={imp.rawNotes}
        initialFormattedReport={imp.formattedReport}
        spaces={spaces.map((s) => ({
          id: s.id,
          label: `${s.name} — ${s.city} (${s.owner.company ?? s.owner.name})`,
        }))}
      />
    </div>
  );
}
