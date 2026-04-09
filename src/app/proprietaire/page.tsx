import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { auth } from "@/auth";
import { getSpacesForOwner } from "@/server/spaces";
import {
  SPACE_STATUS_LABELS,
  SPACE_STATUS_COLORS,
} from "@/lib/space-status";
import { EmptyState } from "./_components/EmptyState";

import {
  Building2,
  Plus,
  TrendingUp,
  FileText,
  Eye,
  ArrowRight,
} from "lucide-react";

export default async function ProprietaireDashboard() {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const spaces = await getSpacesForOwner(session.user.id);
  const firstName = session.user.name?.split(" ")[0] ?? "";

  // Scénario 1 : pas encore d'espace → onboarding
  if (spaces.length === 0) {
    return <EmptyState firstName={firstName} />;
  }

  // Scénario 2 : au moins un espace → dashboard classique
  const stats = [
    {
      label: "Espaces soumis",
      value: spaces.length,
      icon: Building2,
      color: "text-[#1C1F25]",
      bg: "bg-[#eef3f2]",
    },
    {
      label: "Contrats signés",
      value: spaces.filter((s) => s.status === "CONTRACT_SIGNED").length,
      icon: FileText,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "En commercialisation",
      value: spaces.filter((s) =>
        ["MARKETING", "IN_DISCUSSION"].includes(s.status),
      ).length,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Rapports disponibles",
      value: spaces.reduce(
        (sum, s) => sum + s._count.commercializationReports,
        0,
      ),
      icon: Eye,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1F25]">
            Bonjour, {firstName} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Bienvenue dans votre espace propriétaire Snapdesk
          </p>
        </div>
        <Link href="/proprietaire/nouvel-espace">
          <Button className="bg-[#1C1F25] hover:bg-[#111318] text-white gap-2">
            <Plus className="w-4 h-4" />
            Soumettre un espace
          </Button>
        </Link>
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

      {/* Liste espaces */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold text-[#1C1F25]">
            Mes espaces & projets
          </CardTitle>
          <Link href="/proprietaire/projets">
            <Button
              variant="ghost"
              size="sm"
              className="text-[#1C1F25] gap-1"
            >
              Voir tout <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {spaces.slice(0, 5).map((space) => (
            <Link
              key={space.id}
              href={`/proprietaire/projets/${space.id}`}
            >
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
                      {space.city} — {space.area} m² — {space.capacity} postes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
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

      {/* CTA Présentation */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-[#1C1F25] to-[#A9BCB7] text-white">
        <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-lg">
              Découvrez notre modèle de gestion
            </p>
            <p className="text-white/60 text-sm mt-1">
              Comment Snapdesk valorise vos espaces et maximise vos revenus
              locatifs.
            </p>
          </div>
          <Link href="/proprietaire/presentation">
            <Button
              variant="secondary"
              className="whitespace-nowrap bg-white text-[#1C1F25] hover:bg-[#eef3f2]"
            >
              En savoir plus →
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
