import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Building2,
  Euro,
  MapPin,
  Plus,
  ClipboardCheck,
  CheckCircle2,
  Clock,
  Edit3,
} from "lucide-react";

import { getSpaceForBizdev } from "@/server/bizdev-spaces";
import {
  SPACE_STATUS_LABELS,
  SPACE_STATUS_COLORS,
} from "@/lib/space-status";

const VISIT_STATUS_BADGE: Record<
  "DRAFT" | "FORMATTED" | "PUBLISHED",
  { label: string; className: string; icon: React.ElementType }
> = {
  DRAFT: {
    label: "Brouillon",
    className: "bg-slate-100 text-slate-600 border-slate-200",
    icon: Edit3,
  },
  FORMATTED: {
    label: "Reformulé — à publier",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
  },
  PUBLISHED: {
    label: "Publié",
    className: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle2,
  },
};

export default async function BizdevSpaceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const space = await getSpaceForBizdev(id);
  if (!space) notFound();

  const monthlyRentEuros = Math.round(space.monthlyRent / 100);

  return (
    <div className="max-w-5xl space-y-6">
      {/* Back */}
      <Link
        href="/bizdev"
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#1C1F25] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour au back-office
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
            <p className="text-sm text-slate-400 mt-0.5">
              Propriétaire : {space.owner.name}
              {space.owner.company && ` — ${space.owner.company}`} (
              {space.owner.email})
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

      {/* Quick facts */}
      <Card className="border-0 shadow-sm">
        <CardContent className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              Superficie
            </p>
            <p className="text-lg font-semibold text-[#1C1F25] mt-1">
              {space.area} m²
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              Capacité
            </p>
            <p className="text-lg font-semibold text-[#1C1F25] mt-1">
              {space.capacity} postes
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              Type
            </p>
            <p className="text-lg font-semibold text-[#1C1F25] mt-1">
              {space.spaceType}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Euro className="w-3 h-3" /> Loyer
            </p>
            <p className="text-lg font-semibold text-[#1C1F25] mt-1">
              {monthlyRentEuros.toLocaleString("fr-FR")} €/mois
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Visites */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold text-[#1C1F25] flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5" />
            Visites ({space.visits.length})
          </CardTitle>
          <Link href={`/bizdev/espaces/${space.id}/visites/nouvelle`}>
            <Button className="bg-[#1C1F25] hover:bg-[#111318] text-white gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle visite
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {space.visits.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">
              Aucune visite enregistrée pour cet espace.
            </p>
          ) : (
            <div className="space-y-3">
              {space.visits.map((visit) => {
                const badge = VISIT_STATUS_BADGE[visit.status];
                const BadgeIcon = badge.icon;
                return (
                  <Link
                    key={visit.id}
                    href={`/bizdev/espaces/${space.id}/visites/${visit.id}`}
                  >
                    <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#1C1F25]/30 hover:bg-[#eef3f2]/40 transition-all cursor-pointer">
                      <div>
                        <p className="font-semibold text-[#1C1F25] text-sm">
                          Visite du{" "}
                          {new Date(visit.visitDate).toLocaleDateString(
                            "fr-FR",
                            { day: "numeric", month: "long", year: "numeric" },
                          )}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {visit.prospectCompany ?? "Prospect non renseigné"}{" "}
                          · saisi par {visit.createdBy.name}
                        </p>
                      </div>
                      <span
                        className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${badge.className}`}
                      >
                        <BadgeIcon className="w-3 h-3" />
                        {badge.label}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Placeholder pour Phase 6 */}
      <Card className="border-0 shadow-sm bg-slate-50">
        <CardContent className="p-5 text-sm text-slate-500">
          <p>
            📊 Investissements marketing et rapports mensuels : bientôt
            disponibles dans ce back-office (Phase 6).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
