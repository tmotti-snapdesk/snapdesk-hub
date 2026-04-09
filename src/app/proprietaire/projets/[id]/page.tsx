import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusTimeline } from "@/components/StatusTimeline";

import { auth } from "@/auth";
import { getSpaceByIdForOwner } from "@/server/spaces";
import {
  SPACE_STATUS_LABELS,
  SPACE_STATUS_COLORS,
  SPACE_STATUS_ORDER,
} from "@/lib/space-status";
import { anonymizeClientName } from "@/lib/client-anonymize";

import {
  Building2,
  MapPin,
  Maximize2,
  Users,
  Euro,
  Calendar,
  ArrowLeft,
  TrendingUp,
  FileText,
  MessageSquare,
  ClipboardCheck,
} from "lucide-react";

export default async function ProjetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const space = await getSpaceByIdForOwner(id, session.user.id);
  if (!space) notFound();

  const timelineSteps = SPACE_STATUS_ORDER.map((key) => ({
    key,
    label: SPACE_STATUS_LABELS[key],
  }));

  // Affiche toujours RECEIVED pour la timeline si ARCHIVED
  const timelineCurrent =
    space.status === "ARCHIVED" ? "CONTRACT_SIGNED" : space.status;

  const monthlyRentEuros = Math.round(space.monthlyRent / 100);
  const monthlyChargesEuros = space.monthlyCharges
    ? Math.round(space.monthlyCharges / 100)
    : null;

  return (
    <div className="max-w-5xl space-y-6">
      {/* Back */}
      <Link
        href="/proprietaire/projets"
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#1C1F25] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux projets
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 bg-[#1C1F25]/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Building2 className="w-7 h-7 text-[#1C1F25]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1C1F25]">{space.name}</h1>
            <p className="text-slate-500 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {space.address}, {space.city}
            </p>
          </div>
        </div>
        <span
          className={`text-sm font-semibold px-4 py-2 rounded-full self-start border ${
            SPACE_STATUS_COLORS[space.status]
          }`}
        >
          {SPACE_STATUS_LABELS[space.status]}
        </span>
      </div>

      {/* Timeline */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#1C1F25] flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Avancement du projet
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-6 px-6">
          <StatusTimeline
            steps={timelineSteps}
            currentStep={timelineCurrent}
          />
        </CardContent>
      </Card>

      {/* Details grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold text-[#1C1F25] text-sm uppercase tracking-wider">
              Caractéristiques
            </h3>
            {[
              {
                icon: Maximize2,
                label: "Superficie",
                value: `${space.area} m²`,
              },
              {
                icon: Users,
                label: "Capacité",
                value: `${space.capacity} postes`,
              },
              { icon: Building2, label: "Type", value: space.spaceType },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#eef3f2] rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#1C1F25]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="text-sm font-medium text-[#1C1F25]">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5 space-y-3">
            <h3 className="font-semibold text-[#1C1F25] text-sm uppercase tracking-wider">
              Financier
            </h3>
            {[
              {
                icon: Euro,
                label: "Loyer mensuel",
                value: `${monthlyRentEuros.toLocaleString("fr-FR")} €/mois HT`,
              },
              ...(monthlyChargesEuros
                ? [
                    {
                      icon: Euro,
                      label: "Charges",
                      value: `${monthlyChargesEuros.toLocaleString("fr-FR")} €/mois`,
                    },
                  ]
                : []),
              {
                icon: Calendar,
                label: "Disponibilité",
                value: new Date(space.availabilityDate).toLocaleDateString(
                  "fr-FR",
                ),
              },
              {
                icon: Calendar,
                label: "Soumis le",
                value: new Date(space.createdAt).toLocaleDateString("fr-FR"),
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#eef3f2] rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#1C1F25]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="text-sm font-medium text-[#1C1F25]">
                      {item.value}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <h3 className="font-semibold text-[#1C1F25] text-sm uppercase tracking-wider mb-3">
              Description
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {space.description}
            </p>
            {space.internalNotes && (
              <div className="mt-3 p-3 bg-[#fdf0f3] rounded-lg border border-amber-100">
                <p className="text-xs font-semibold text-[#c4607a] mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  Note Snapdesk
                </p>
                <p className="text-xs text-[#E590A1]">{space.internalNotes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Comptes-rendus de visite (Phase 5 — affichage prêt, BizDev pas encore) */}
      {space.visits.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ClipboardCheck className="w-5 h-5 text-[#1C1F25]" />
            <h2 className="text-xl font-bold text-[#1C1F25]">
              Comptes-rendus de visite
            </h2>
          </div>
          <div className="space-y-4">
            {space.visits.map((visit) => (
              <Card
                key={visit.id}
                className="border border-slate-100 shadow-sm"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-[#1C1F25] flex items-center justify-between">
                    <span>
                      Visite du{" "}
                      {new Date(visit.visitDate).toLocaleDateString("fr-FR")}
                    </span>
                    {visit.prospectCompany && (
                      <span className="text-xs font-normal text-slate-500">
                        Prospect {anonymizeClientName(visit.prospectCompany)}
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {visit.formattedReport}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Rapports de commercialisation */}
      {space.commercializationReports.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-[#1C1F25]" />
            <h2 className="text-xl font-bold text-[#1C1F25]">
              Rapports de commercialisation
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {space.commercializationReports.map((report) => {
              const monthLabel = new Date(report.month).toLocaleDateString(
                "fr-FR",
                { month: "long", year: "numeric" },
              );
              const marketingEuros = Math.round(report.marketingSpend / 100);

              return (
                <Card
                  key={report.id}
                  className="border border-slate-100 shadow-sm"
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-[#1C1F25] capitalize">
                      {monthLabel}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div className="bg-[#eef3f2] rounded-lg p-3">
                        <p className="text-xl font-bold text-[#1C1F25]">
                          {report.visitsCount}
                        </p>
                        <p className="text-xs text-slate-500">Visites</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-3">
                        <p className="text-xl font-bold text-purple-600">
                          {report.inquiriesCount}
                        </p>
                        <p className="text-xs text-slate-500">Demandes</p>
                      </div>
                      <div className="bg-green-50 rounded-lg p-3">
                        <p className="text-xl font-bold text-green-600">
                          {report.occupancyRate ?? "—"}
                          {report.occupancyRate != null && "%"}
                        </p>
                        <p className="text-xs text-slate-500">Occupation</p>
                      </div>
                    </div>

                    {report.occupancyRate != null && (
                      <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span>Taux d&apos;occupation</span>
                          <span>{report.occupancyRate}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${report.occupancyRate}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {marketingEuros > 0 && (
                      <div className="flex justify-between text-sm text-slate-600 px-1">
                        <span>Investissement marketing</span>
                        <span className="font-semibold">
                          {marketingEuros.toLocaleString("fr-FR")} €
                        </span>
                      </div>
                    )}

                    {report.bizdevComment && (
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <p className="text-xs font-semibold text-slate-500 mb-1">
                          Commentaire Snapdesk
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {report.bizdevComment}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* État vide pour rapports */}
      {space.commercializationReports.length === 0 &&
        space.visits.length === 0 && (
          <Card className="border-0 shadow-sm bg-slate-50">
            <CardContent className="py-8 text-center">
              <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">
                Les comptes-rendus de visite et rapports de commercialisation
                apparaîtront ici dès que votre espace sera en commercialisation.
              </p>
            </CardContent>
          </Card>
        )}
    </div>
  );
}
