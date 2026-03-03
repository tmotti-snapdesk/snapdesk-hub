"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MOCK_ESPACES_DISPONIBLES,
  MOCK_PROJETS_ENTREPRISE,
} from "@/lib/mock-data";
import {
  Building2,
  MapPin,
  Maximize2,
  Users,
  Euro,
  Star,
  StarOff,
  CheckCircle2,
  Calendar,
  ArrowRight,
  Info,
} from "lucide-react";

export default function EspacesProposesPage() {
  const projet = MOCK_PROJETS_ENTREPRISE[0];
  const espaces = MOCK_ESPACES_DISPONIBLES;
  const [selection, setSelection] = useState<string[]>(projet?.espacesSelectionnes ?? []);
  const [commentaire, setCommentaire] = useState(projet?.commentaireSelection ?? "");
  const [feedbackSent, setFeedbackSent] = useState(false);

  const toggleSelection = (id: string) => {
    setSelection((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleSendFeedback = async () => {
    await new Promise((r) => setTimeout(r, 500));
    setFeedbackSent(true);
  };

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1C1F25]">Espaces proposés par Snapdesk</h1>
        <p className="text-slate-500 mt-1">
          Sélection établie pour votre recherche :{" "}
          <span className="font-medium text-[#1C1F25]">{projet?.nom}</span>
        </p>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 bg-[#eef3f2] rounded-xl border border-[#A9BCB7]/30">
        <Info className="w-5 h-5 text-[#1C1F25] flex-shrink-0 mt-0.5" />
        <p className="text-sm text-[#1C1F25]">
          Notre équipe a présélectionné <strong>{espaces.length} espaces</strong> correspondant à
          votre cahier des charges. Cliquez sur <Star className="w-3 h-3 inline" /> pour
          sélectionner les espaces qui vous intéressent, puis transmettez votre retour.
        </p>
      </div>

      {/* Espaces grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {espaces.map((espace) => {
          const isSelected = selection.includes(espace.id);
          return (
            <Card
              key={espace.id}
              className={`border-2 shadow-sm transition-all hover:shadow-md ${
                isSelected
                  ? "border-amber-400 shadow-amber-100"
                  : "border-slate-100 hover:border-slate-200"
              }`}
            >
              {/* Photo placeholder */}
              <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 rounded-t-xl flex items-center justify-center relative">
                <Building2 className="w-12 h-12 text-slate-300" />
                {espace.score && (
                  <div className="absolute top-3 left-3 bg-[#1C1F25] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    Score {espace.score}%
                  </div>
                )}
                <button
                  onClick={() => toggleSelection(espace.id)}
                  className={`absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-amber-400 text-white shadow-md"
                      : "bg-white text-slate-400 hover:text-amber-400 shadow"
                  }`}
                >
                  {isSelected ? (
                    <Star className="w-4 h-4 fill-current" />
                  ) : (
                    <StarOff className="w-4 h-4" />
                  )}
                </button>
              </div>

              <CardContent className="p-5 space-y-3">
                <div>
                  <h3 className="font-bold text-[#1C1F25] leading-snug">{espace.nom}</h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {espace.adresse}, {espace.ville}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-50 rounded-lg p-2">
                    <Maximize2 className="w-3.5 h-3.5 text-slate-400 mx-auto mb-0.5" />
                    <p className="text-xs font-semibold text-[#1C1F25]">{espace.superficie} m²</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <Users className="w-3.5 h-3.5 text-slate-400 mx-auto mb-0.5" />
                    <p className="text-xs font-semibold text-[#1C1F25]">{espace.capacite} postes</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-2">
                    <Euro className="w-3.5 h-3.5 text-slate-400 mx-auto mb-0.5" />
                    <p className="text-xs font-semibold text-[#1C1F25]">
                      {(espace.loyer / 1000).toFixed(0)}k/mois
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                  {espace.description}
                </p>

                <div className="flex flex-wrap gap-1.5">
                  {espace.amenagements.slice(0, 3).map((a) => (
                    <span
                      key={a}
                      className="text-[10px] px-2 py-0.5 bg-[#eef3f2] text-[#1C1F25] rounded-full"
                    >
                      {a}
                    </span>
                  ))}
                  {espace.amenagements.length > 3 && (
                    <span className="text-[10px] px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">
                      +{espace.amenagements.length - 3}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Dispo{" "}
                    {new Date(espace.disponibilite).toLocaleDateString("fr-FR", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                  <Button
                    size="sm"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => toggleSelection(espace.id)}
                    className={`text-xs h-7 px-3 gap-1 ${
                      isSelected
                        ? "bg-[#E590A1] hover:bg-[#d4788e] text-white border-0"
                        : "text-[#1C1F25]"
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Sélectionné
                      </>
                    ) : (
                      "Sélectionner"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feedback panel */}
      {selection.length > 0 && !feedbackSent && (
        <Card className="border-2 border-[#E590A1]/30 shadow-sm bg-[#fdf0f3]">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-[#1C1F25] flex items-center gap-2">
              <Star className="w-4 h-4 fill-[#E590A1] text-[#E590A1]" />
              Ma sélection ({selection.length} espace{selection.length > 1 ? "s" : ""})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {espaces
                .filter((e) => selection.includes(e.id))
                .map((e) => (
                  <span
                    key={e.id}
                    className="text-sm px-3 py-1.5 bg-white rounded-full border border-[#E590A1]/30 text-[#c4607a] font-medium"
                  >
                    {e.nom}
                  </span>
                ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1C1F25]">
                Commentaires pour l'équipe Snapdesk (optionnel)
              </label>
              <textarea
                className="w-full rounded-lg border border-[#E590A1]/30 bg-white p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#E590A1]/50 resize-none"
                rows={3}
                placeholder="Ex : Je préfère l'espace 1 pour son accessibilité, l'espace 2 pour le budget. Disponible pour les visites semaine 20…"
                value={commentaire}
                onChange={(e) => setCommentaire(e.target.value)}
              />
            </div>

            <Button
              onClick={handleSendFeedback}
              className="bg-[#E590A1] hover:bg-[#d4788e] text-white gap-2"
            >
              Transmettre ma sélection à Snapdesk <ArrowRight className="w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {feedbackSent && (
        <Card className="border-0 shadow-sm bg-green-50 border-green-200">
          <CardContent className="p-6 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-green-700">Sélection transmise !</p>
              <p className="text-sm text-green-600">
                L'équipe Snapdesk va vous contacter pour organiser les visites.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prendre RDV */}
      <Card className="border-0 shadow-sm bg-gradient-to-r from-[#1C1F25] to-[#A9BCB7] text-white">
        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold">Besoin d'un échange avec nos experts ?</p>
            <p className="text-white/60 text-sm mt-1">
              Prenez rendez-vous pour affiner votre recherche ou organiser des visites.
            </p>
          </div>
          <Link href="/entreprise/rendez-vous">
            <Button variant="secondary" className="whitespace-nowrap bg-white text-[#1C1F25] hover:bg-[#eef3f2]">
              Prendre rendez-vous →
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
