import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Users,
  UserPlus,
  Inbox,
  Plus,
  ArrowRight,
  Briefcase,
} from "lucide-react";

import { getAdminStats, listOwners } from "@/server/admin";
import {
  SPACE_STATUS_LABELS,
  SPACE_STATUS_COLORS,
} from "@/lib/space-status";

export default async function AdminDashboard() {
  const [stats, owners] = await Promise.all([getAdminStats(), listOwners()]);

  const statCards = [
    {
      label: "Propriétaires",
      value: stats.owners,
      icon: Users,
      color: "text-[#1C1F25]",
      bg: "bg-[#eef3f2]",
    },
    {
      label: "Espaces",
      value: stats.spaces,
      icon: Building2,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "BizDevs",
      value: stats.bizdevs,
      icon: Briefcase,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Imports en attente",
      value: stats.pendingImports,
      icon: Inbox,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1F25]">
            Back-office administrateur
          </h1>
          <p className="text-slate-500 mt-1">
            Gestion des propriétaires, espaces et équipe Snapdesk.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/proprietaires/nouveau">
            <Button
              variant="outline"
              className="gap-2 border-[#1C1F25] text-[#1C1F25] hover:bg-[#eef3f2]"
            >
              <UserPlus className="w-4 h-4" />
              Nouveau propriétaire
            </Button>
          </Link>
          <Link href="/admin/espaces/nouveau">
            <Button className="bg-[#1C1F25] hover:bg-[#111318] text-white gap-2">
              <Plus className="w-4 h-4" />
              Nouvel espace
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => {
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

      {/* Owners list */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold text-[#1C1F25]">
            Propriétaires ({owners.length})
          </CardTitle>
          <Link href="/admin/proprietaires">
            <Button variant="ghost" size="sm" className="text-[#1C1F25] gap-1">
              Voir tout <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {owners.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-sm text-slate-500 mb-4">
                Aucun propriétaire enregistré.
              </p>
              <Link href="/admin/proprietaires/nouveau">
                <Button className="bg-[#1C1F25] hover:bg-[#111318] text-white gap-2">
                  <UserPlus className="w-4 h-4" />
                  Créer le premier propriétaire
                </Button>
              </Link>
            </div>
          ) : (
            owners.slice(0, 8).map((owner) => (
              <div
                key={owner.id}
                className="flex items-start justify-between p-4 rounded-xl border border-slate-100"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 bg-[#1C1F25]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-[#1C1F25]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-[#1C1F25] text-sm">
                      {owner.name}
                      {owner.company && (
                        <span className="text-slate-500 font-normal">
                          {" "}— {owner.company}
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500">{owner.email}</p>
                    {owner.spaces.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {owner.spaces.map((s) => (
                          <span
                            key={s.id}
                            className={`text-[10px] px-2 py-0.5 rounded-full border ${
                              SPACE_STATUS_COLORS[s.status]
                            }`}
                          >
                            {s.name} · {SPACE_STATUS_LABELS[s.status]}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap ml-4">
                  {owner._count.spaces} espace
                  {owner._count.spaces > 1 ? "s" : ""}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
