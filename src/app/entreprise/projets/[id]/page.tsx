"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusTimeline } from "@/components/StatusTimeline";
import {
  MOCK_PROJETS_ENTREPRISE,
  MOCK_ESPACES_DISPONIBLES,
  STATUT_ENTREPRISE_LABELS,
  STATUT_ENTREPRISE_ORDER,
} from "@/lib/mock-data";
import {
  ArrowLeft,
  MapPin,
  Maximize2,
  Users,
  Euro,
  Calendar,
  Building2,
  Star,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
} from "lucide-react";

const STATUT_COLORS: Record<string, string> = {
  en_attente: "bg-slate-100 text-slate-600",
  espaces_proposes: "bg-blue-100 text-blue-700",
  selection_faite: "bg-indigo-100 text-indigo-700",
  visite_planifiee: "bg-yellow-100 text-yellow-700",
  visite_effectuee: "bg-orange-100 text-orange-700",
  loi_envoyee: "bg-amber-100 text-amber-700",
  projet_contrat: "bg-purple-100 text-purple-700",
  contrat_signe: "bg-green-100 text-green-700",
};

export default function ProjetEntrepriseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const projet = MOCK_PROJETS_ENTREPRISE.find((p) => p.id === id);

  if (!projet) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">Projet introuvable.</p>
        <Button onClick={() => router.push("/entreprise/projets")} className="mt-4">
          Retour
        </Button>
      </div>
    );
  }

  const cdc = projet.cahierDesCharges;
  const timelineSteps = STATUT_ENTREPRISE_ORDER.map((key) => ({
    key,
    label: STATUT_ENTREPRISE_LABELS[key],
  }));

  const espacesSelectionnesDetails = MOCK_ESPACES_DISPONIBLES.filter((e) =>
    projet.espacesSelectionnes.includes(e.id)
  );

  return (
    <div className="max-w-5xl space-y-6">
      <Link
        href="/entreprise/projets"
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#1a3a5c] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux projets
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a5c]">{projet.nom}</h1>
          <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {cdc.ville} — Créé le{" "}
            {new Date(projet.dateCreation).toLocaleDateString("fr-FR")}
          </p>
        </div>
        <span
          className={`text-sm font-semibold px-4 py-2 rounded-full self-start ${
            STATUT_COLORS[projet.statut]
          }`}
        >
          {STATUT_ENTREPRISE_LABELS[projet.statut]}
        </span>
      </div>

      {/* Timeline */}
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-[#1a3a5c]">
            Avancement de votre dossier
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-6 px-6 overflow-x-auto">
          <div className="min-w-[600px]">
            <StatusTimeline steps={timelineSteps} currentStep={projet.statut} />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Cahier des charges */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-[#1a3a5c] flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Cahier des charges
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { icon: MapPin, label: "Ville", value: cdc.ville },
              { icon: Maximize2, label: "Superficie min.", value: `${cdc.superficie} m²` },
              { icon: Users, label: "Capacité", value: `${cdc.capacite} postes` },
              {
                icon: Euro,
                label: "Budget max",
                value: `${cdc.budget.toLocaleString("fr-FR")} €/mois HT`,
              },
              { icon: Building2, label: "Type", value: cdc.typeEspace },
              {
                icon: Calendar,
                label: "Disponibilité",
                value: new Date(cdc.disponibilite).toLocaleDateString("fr-FR"),
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-[#1a3a5c]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">{item.label}</p>
                    <p className="text-sm font-medium text-[#1a3a5c]">{item.value}</p>
                  </div>
                </div>
              );
            })}

            {cdc.amenagements.length > 0 && (
              <div className="pt-2">
                <p className="text-xs text-slate-400 mb-2">Services souhaités</p>
                <div className="flex flex-wrap gap-1.5">
                  {cdc.amenagements.map((a) => (
                    <span key={a} className="text-xs px-2.5 py-1 bg-blue-50 text-[#1a3a5c] rounded-full">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {cdc.commentaires && (
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs font-semibold text-slate-500 mb-1">Commentaires</p>
                <p className="text-xs text-slate-600">{cdc.commentaires}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Prochaines étapes */}
        <div className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-[#1a3a5c] flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Prochaines étapes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {projet.statut === "visite_planifiee" && projet.dateRendezVous && (
                <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <Calendar className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-yellow-700">Visites planifiées</p>
                    <p className="text-xs text-yellow-600">
                      {new Date(projet.dateRendezVous).toLocaleDateString("fr-FR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
              <div className="space-y-2">
                {[
                  {
                    done: ["espaces_proposes", "selection_faite", "visite_planifiee", "visite_effectuee", "loi_envoyee", "projet_contrat", "contrat_signe"].includes(projet.statut),
                    label: "Sélection d'espaces reçue",
                  },
                  {
                    done: ["selection_faite", "visite_planifiee", "visite_effectuee", "loi_envoyee", "projet_contrat", "contrat_signe"].includes(projet.statut),
                    label: "Sélection transmise à Snapdesk",
                  },
                  {
                    done: ["visite_planifiee", "visite_effectuee", "loi_envoyee", "projet_contrat", "contrat_signe"].includes(projet.statut),
                    label: "Visites planifiées",
                  },
                  {
                    done: ["visite_effectuee", "loi_envoyee", "projet_contrat", "contrat_signe"].includes(projet.statut),
                    label: "Visites effectuées",
                  },
                  {
                    done: ["loi_envoyee", "projet_contrat", "contrat_signe"].includes(projet.statut),
                    label: "Lettre d'intention (LOI) signée",
                  },
                  {
                    done: ["projet_contrat", "contrat_signe"].includes(projet.statut),
                    label: "Projet de contrat en cours",
                  },
                  {
                    done: projet.statut === "contrat_signe",
                    label: "Contrat signé 🎉",
                  },
                ].map((step) => (
                  <div key={step.label} className="flex items-center gap-2">
                    {step.done ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border-2 border-slate-200 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        step.done ? "text-slate-700 font-medium" : "text-slate-400"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Link href="/entreprise/rendez-vous">
            <Card className="border border-[#1a3a5c]/20 shadow-sm hover:shadow-md transition-shadow cursor-pointer bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="p-4 flex items-center gap-3">
                <MessageSquare className="w-8 h-8 text-[#1a3a5c]" />
                <div>
                  <p className="font-semibold text-[#1a3a5c] text-sm">Contacter un expert</p>
                  <p className="text-xs text-slate-500">Prendre rendez-vous avec l'équipe Snapdesk</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>

      {/* Espaces sélectionnés */}
      {espacesSelectionnesDetails.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h2 className="text-xl font-bold text-[#1a3a5c]">
              Espaces sélectionnés ({espacesSelectionnesDetails.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {espacesSelectionnesDetails.map((espace) => (
              <Card key={espace.id} className="border border-amber-200 shadow-sm">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-slate-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-[#1a3a5c]">{espace.nom}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {espace.adresse}, {espace.ville}
                      </p>
                      <div className="flex gap-3 mt-2 text-xs text-slate-500">
                        <span>{espace.superficie} m²</span>
                        <span>·</span>
                        <span>{espace.capacite} postes</span>
                        <span>·</span>
                        <span>{espace.loyer.toLocaleString("fr-FR")} €/mois</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {espace.amenagements.slice(0, 3).map((a) => (
                      <span key={a} className="text-[10px] px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">
                        {a}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {projet.commentaireSelection && (
            <Card className="mt-4 border-0 shadow-sm bg-slate-50">
              <CardContent className="p-4">
                <p className="text-xs font-semibold text-slate-500 mb-1 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />
                  Votre retour transmis à Snapdesk
                </p>
                <p className="text-sm text-slate-700">{projet.commentaireSelection}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
