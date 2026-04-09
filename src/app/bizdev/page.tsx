import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  ArrowRight,
  ClipboardCheck,
  FileText,
  TrendingUp,
} from "lucide-react";

import { listAllSpacesForBizdev } from "@/server/bizdev-spaces";
import {
  SPACE_STATUS_LABELS,
  SPACE_STATUS_COLORS,
} from "@/lib/space-status";

export default async function BizdevDashboard() {
  const spaces = await listAllSpacesForBizdev();

  const totalVisits = spaces.reduce((sum, s) => sum + s._count.visits, 0);
  const totalReports = spaces.reduce(
    (sum, s) => sum + s._count.commercializationReports,
    0,
  );
  const inMarketing = spaces.filter((s) =>
    ["MARKETING", "IN_DISCUSSION"].includes(s.status),
  ).length;

  const stats = [
    {
      label: "Espaces au portefeuille",
      value: spaces.length,
      icon: Building2,
      color: "text-[#1C1F25]",
      bg: "bg-[#eef3f2]",
    },
    {
      label: "En commercialisation",
      value: inMarketing,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Visites réalisées",
      value: totalVisits,
      icon: ClipboardCheck,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Rapports publiés",
      value: totalReports,
      icon: FileText,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1C1F25]">
          Back-office commercial
        </h1>
        <p className="text-slate-500 mt-1">
          Gérez les visites, investissements marketing et rapports de vos
          espaces en commercialisation.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="border-0 shadow-sm">
              <CardContent className="p-5">
                <div
                  className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}
                >
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-[#1C1F25]">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Spaces list */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#1C1F25]">
            Espaces ({spaces.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {spaces.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-8">
              Aucun espace soumis pour le moment.
            </p>
          )}
          {spaces.map((space) => (
            <Link key={space.id} href={`/bizdev/espaces/${space.id}`}>
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#1C1F25]/30 hover:bg-[#eef3f2]/40 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#1C1F25]/10 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-[#1C1F25]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1C1F25] text-sm">
                      {space.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {space.city} — {space.area} m² — Propriétaire :{" "}
                      {space.owner.name}
                      {space.owner.company && ` (${space.owner.company})`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {space._count.visits > 0 && (
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {space._count.visits} visite
                      {space._count.visits > 1 ? "s" : ""}
                    </span>
                  )}
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                      SPACE_STATUS_COLORS[space.status]
                    }`}
                  >
                    {SPACE_STATUS_LABELS[space.status]}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
