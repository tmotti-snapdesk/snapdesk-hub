"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusTimeline } from "@/components/StatusTimeline";
import {
  MOCK_ESPACES_PROPRIETAIRE,
  STATUT_PROPRIETAIRE_LABELS,
  STATUT_PROPRIETAIRE_ORDER,
} from "@/lib/mock-data";
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
} from "lucide-react";

export default function ProjetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const espace = MOCK_ESPACES_PROPRIETAIRE.find((e) => e.id === id);

  if (!espace) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Projet introuvable.</p>
        <Button onClick={() => router.push("/proprietaire/projets")} className="mt-4">
          Retour aux projets
        </Button>
      </div>
    );
  }

  const timelineSteps = STATUT_PROPRIETAIRE_ORDER.map((key) => ({
    key,
    label: STATUT_PROPRIETAIRE_LABELS[key],
  }));

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
            <h1 className="text-2xl font-bold text-[#1C1F25]">{espace.nom}</h1>
            <p className="text-slate-500 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {espace.adresse}, {espace.ville}
            </p>
          </div>
        </div>
        <span className="text-sm font-semibold px-4 py-2 rounded-full bg-green-100 text-green-700 self-start">
          {STATUT_PROPRIETAIRE_LABELS[espace.statut]}
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
          <StatusTimeline steps={timelineSteps} currentStep={espace.statut} />
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
              { icon: Maximize2, label: "Superficie", value: `${espace.superficie} m²` },
              { icon: Users, label: "Capacité", value: `${espace.capacite} postes` },
              { icon: Building2, label: "Type", value: espace.typeEspace },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-[#eef3f2] rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#1C1F25]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="text-sm font-medium text-[#1C1F25]">{item.value}</p>
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
                value: `${espace.loyer.toLocaleString("fr-FR")} €/mois HT`,
              },
              {
                icon: Calendar,
                label: "Disponibilité",
                value: new Date(espace.disponibilite).toLocaleDateString("fr-FR"),
              },
              {
                icon: Calendar,
                label: "Soumis le",
                value: new Date(espace.dateCreation).toLocaleDateString("fr-FR"),
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
                    <p className="text-sm font-medium text-[#1C1F25]">{item.value}</p>
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
            <p className="text-sm text-slate-600 leading-relaxed">{espace.description}</p>
            {espace.notes && (
              <div className="mt-3 p-3 bg-[#fdf0f3] rounded-lg border border-amber-100">
                <p className="text-xs font-semibold text-[#c4607a] mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  Note Snapdesk
                </p>
                <p className="text-xs text-[#E590A1]">{espace.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Rapports de commercialisation */}
      {espace.rapports.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <FileText className="w-5 h-5 text-[#1C1F25]" />
            <h2 className="text-xl font-bold text-[#1C1F25]">
              Rapports de commercialisation
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {espace.rapports.map((rapport) => (
              <Card key={rapport.mois} className="border border-slate-100 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold text-[#1C1F25]">
                    {rapport.mois}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="bg-[#eef3f2] rounded-lg p-3">
                      <p className="text-xl font-bold text-[#1C1F25]">{rapport.visites}</p>
                      <p className="text-xs text-slate-500">Visites</p>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <p className="text-xl font-bold text-purple-600">{rapport.demandes}</p>
                      <p className="text-xs text-slate-500">Demandes</p>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-xl font-bold text-green-600">{rapport.tauxOccupation}%</p>
                      <p className="text-xs text-slate-500">Occupation</p>
                    </div>
                  </div>

                  {/* Taux bar */}
                  <div>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Taux d'occupation</span>
                      <span>{rapport.tauxOccupation}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${rapport.tauxOccupation}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs font-semibold text-slate-500 mb-1">
                      Commentaire Snapdesk
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {rapport.commentaire}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {espace.rapports.length === 0 && (
        <Card className="border-0 shadow-sm bg-slate-50">
          <CardContent className="py-8 text-center">
            <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">
              Les rapports de commercialisation seront disponibles après signature du contrat.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
