import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

import { getVisitById } from "@/server/visits";
import { VisitEditor } from "./VisitEditor";

export default async function VisitDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string; visitId: string }>;
  searchParams: Promise<{ justCreated?: string }>;
}) {
  const { id: spaceId, visitId } = await params;
  const { justCreated } = await searchParams;

  const visit = await getVisitById(visitId);
  if (!visit || visit.spaceId !== spaceId) notFound();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        href={`/bizdev/espaces/${spaceId}`}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#1C1F25] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour à l&apos;espace
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-[#1C1F25]">
          Visite du{" "}
          {new Date(visit.visitDate).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </h1>
        <p className="text-slate-500 mt-1">
          {visit.space.name} · Propriétaire : {visit.space.owner.name}
        </p>
      </div>

      {justCreated === "1" && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-200">
          <CheckCircle2 className="w-4 h-4" />
          Brouillon enregistré. Tu peux maintenant le reformuler avec
          l&apos;IA.
        </div>
      )}

      <VisitEditor
        visitId={visit.id}
        initialRawNotes={visit.rawNotes}
        initialFormattedReport={visit.formattedReport}
        initialStatus={visit.status}
        prospectCompany={visit.prospectCompany}
        prospectContact={visit.prospectContact}
        attendees={visit.attendees}
        ownerEmail={visit.space.owner.email}
      />
    </div>
  );
}
