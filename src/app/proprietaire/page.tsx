"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MOCK_ESPACES_PROPRIETAIRE,
  STATUT_PROPRIETAIRE_LABELS,
  type User,
  type EspaceProprietaire,
} from "@/lib/mock-data";
import { Building2, Plus, TrendingUp, FileText, Eye, ArrowRight } from "lucide-react";

const STATUT_COLORS: Record<string, string> = {
  receptionne: "bg-blue-100 text-blue-700",
  visite_planifiee: "bg-yellow-100 text-yellow-700",
  visite_effectuee: "bg-orange-100 text-orange-700",
  en_discussion: "bg-purple-100 text-purple-700",
  contrat_signe: "bg-green-100 text-green-700",
  archive: "bg-slate-100 text-slate-500",
};

export default function ProprietaireDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const espaces: EspaceProprietaire[] = MOCK_ESPACES_PROPRIETAIRE;

  useEffect(() => {
    const raw = sessionStorage.getItem("snapdesk_user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const stats = [
    {
      label: "Espaces soumis",
      value: espaces.length,
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Contrats signés",
      value: espaces.filter((e) => e.statut === "contrat_signe").length,
      icon: FileText,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "En cours",
      value: espaces.filter((e) =>
        ["visite_planifiee", "visite_effectuee", "en_discussion"].includes(e.statut)
      ).length,
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
    {
      label: "Rapports disponibles",
      value: espaces.reduce((sum, e) => sum + e.rapports.length, 0),
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
          <h1 className="text-2xl font-bold text-[#1a3a5c]">
            Bonjour, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            Bienvenue dans votre espace propriétaire Snapdesk
          </p>
        </div>
        <Link href="/proprietaire/nouvel-espace">
          <Button className="bg-[#1a3a5c] hover:bg-[#0f2540] text-white gap-2">
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
                <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center mb-3`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className="text-2xl font-bold text-[#1a3a5c]">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Projets */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold text-[#1a3a5c]">
            Mes espaces & projets
          </CardTitle>
          <Link href="/proprietaire/projets">
            <Button variant="ghost" size="sm" className="text-[#1a3a5c] gap-1">
              Voir tout <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {espaces.map((espace) => (
            <Link key={espace.id} href={`/proprietaire/projets/${espace.id}`}>
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#1a3a5c]/30 hover:bg-blue-50/40 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#1a3a5c]/10 rounded-lg flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-[#1a3a5c]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1a3a5c] text-sm">{espace.nom}</p>
                    <p className="text-xs text-slate-500">
                      {espace.ville} — {espace.superficie} m² — {espace.capacite} postes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      STATUT_COLORS[espace.statut]
                    }`}
                  >
                    {STATUT_PROPRIETAIRE_LABELS[espace.statut]}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            </Link>
          ))}

          {espaces.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Aucun espace soumis pour le moment.</p>
              <Link href="/proprietaire/nouvel-espace">
                <Button variant="outline" className="mt-3 text-[#1a3a5c]">
                  Soumettre mon premier espace
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* CTA Présentation */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-[#1a3a5c] to-[#2563eb] text-white">
        <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-lg">Découvrez notre modèle de gestion</p>
            <p className="text-blue-100 text-sm mt-1">
              Comment Snapdesk valorise vos espaces et maximise vos revenus locatifs.
            </p>
          </div>
          <Link href="/proprietaire/presentation">
            <Button variant="secondary" className="whitespace-nowrap bg-white text-[#1a3a5c] hover:bg-blue-50">
              En savoir plus →
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
