"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MOCK_PROJETS_ENTREPRISE,
  STATUT_ENTREPRISE_LABELS,
  type User,
} from "@/lib/mock-data";
import {
  Search,
  FileText,
  Calendar,
  Building2,
  ArrowRight,
  ClipboardList,
  Star,
} from "lucide-react";

const STATUT_COLORS: Record<string, string> = {
  en_attente: "bg-slate-100 text-slate-600",
  espaces_proposes: "bg-blue-100 text-[#1C1F25]",
  selection_faite: "bg-indigo-100 text-indigo-700",
  visite_planifiee: "bg-yellow-100 text-yellow-700",
  visite_effectuee: "bg-orange-100 text-orange-700",
  loi_envoyee: "bg-amber-100 text-[#c4607a]",
  projet_contrat: "bg-purple-100 text-purple-700",
  contrat_signe: "bg-green-100 text-green-700",
};

export default function EntrepriseDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const projets = MOCK_PROJETS_ENTREPRISE;

  useEffect(() => {
    const raw = sessionStorage.getItem("snapdesk_user");
    if (raw) setUser(JSON.parse(raw));
  }, []);

  const stats = [
    {
      label: "Recherches actives",
      value: projets.length,
      icon: Search,
      color: "text-[#1C1F25]",
      bg: "bg-[#eef3f2]",
    },
    {
      label: "Espaces reçus",
      value: projets.reduce((s, p) => s + p.espacesProposes.length, 0),
      icon: Building2,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Espaces sélectionnés",
      value: projets.reduce((s, p) => s + p.espacesSelectionnes.length, 0),
      icon: Star,
      color: "text-[#E590A1]",
      bg: "bg-[#fdf0f3]",
    },
    {
      label: "RDV planifiés",
      value: projets.filter((p) => p.dateRendezVous).length,
      icon: Calendar,
      color: "text-green-600",
      bg: "bg-green-50",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1F25]">
            Bonjour, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1">
            {user?.company} — Tableau de bord de votre recherche de bureaux
          </p>
        </div>
        <Link href="/entreprise/cahier-des-charges">
          <Button className="bg-[#1C1F25] hover:bg-[#111318] text-white gap-2">
            <ClipboardList className="w-4 h-4" />
            Nouvelle recherche
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
                <p className="text-2xl font-bold text-[#1C1F25]">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{stat.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Projets en cours */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold text-[#1C1F25]">
            Mes recherches
          </CardTitle>
          <Link href="/entreprise/projets">
            <Button variant="ghost" size="sm" className="text-[#1C1F25] gap-1">
              Voir tout <ArrowRight className="w-3 h-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="space-y-3">
          {projets.map((projet) => (
            <Link key={projet.id} href={`/entreprise/projets/${projet.id}`}>
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-[#1C1F25]/30 hover:bg-[#eef3f2]/40 transition-all cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#fdf0f3] rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-[#E590A1]" />
                  </div>
                  <div>
                    <p className="font-semibold text-[#1C1F25] text-sm">{projet.nom}</p>
                    <p className="text-xs text-slate-500">
                      {projet.cahierDesCharges.ville} — {projet.cahierDesCharges.superficie} m²
                      min — {projet.cahierDesCharges.capacite} postes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                      STATUT_COLORS[projet.statut]
                    }`}
                  >
                    {STATUT_ENTREPRISE_LABELS[projet.statut]}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </div>
              </div>
            </Link>
          ))}

          {projets.length === 0 && (
            <div className="text-center py-12 text-slate-400">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Vous n'avez pas encore démarré de recherche.</p>
              <Link href="/entreprise/cahier-des-charges">
                <Button variant="outline" className="mt-3 text-[#1C1F25]">
                  Démarrer ma recherche
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Building2,
            title: "Espaces proposés",
            desc: "Consultez la sélection d'espaces établie par Snapdesk.",
            href: "/entreprise/espaces",
            color: "text-[#1C1F25]",
            bg: "bg-[#eef3f2]",
          },
          {
            icon: Calendar,
            title: "Prendre rendez-vous",
            desc: "Échangez avec un expert Snapdesk pour affiner votre recherche.",
            href: "/entreprise/rendez-vous",
            color: "text-green-600",
            bg: "bg-green-50",
          },
          {
            icon: FileText,
            title: "Mes projets",
            desc: "Suivez l'avancement de vos négociations et processus contractuels.",
            href: "/entreprise/projets",
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <Card className="border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer h-full">
                <CardContent className="p-5">
                  <div
                    className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center mb-3`}
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <h3 className="font-semibold text-[#1C1F25] mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
