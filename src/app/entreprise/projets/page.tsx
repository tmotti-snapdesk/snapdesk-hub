"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MOCK_PROJETS_ENTREPRISE,
  STATUT_ENTREPRISE_LABELS,
  STATUT_ENTREPRISE_ORDER,
} from "@/lib/mock-data";
import { Search, ArrowRight, Plus, MapPin, Maximize2, Users, Euro } from "lucide-react";

const STATUT_COLORS: Record<string, string> = {
  en_attente: "bg-slate-100 text-slate-600 border-slate-200",
  espaces_proposes: "bg-blue-100 text-blue-700 border-blue-200",
  selection_faite: "bg-indigo-100 text-indigo-700 border-indigo-200",
  visite_planifiee: "bg-yellow-100 text-yellow-700 border-yellow-200",
  visite_effectuee: "bg-orange-100 text-orange-700 border-orange-200",
  loi_envoyee: "bg-amber-100 text-amber-700 border-amber-200",
  projet_contrat: "bg-purple-100 text-purple-700 border-purple-200",
  contrat_signe: "bg-green-100 text-green-700 border-green-200",
};

export default function ProjetsEntreprisePage() {
  const projets = MOCK_PROJETS_ENTREPRISE;

  return (
    <div className="max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a5c]">Mes recherches & projets</h1>
          <p className="text-slate-500 mt-1">
            Suivez l'avancement de chaque dossier de recherche.
          </p>
        </div>
        <Link href="/entreprise/cahier-des-charges">
          <Button className="bg-[#1a3a5c] hover:bg-[#0f2540] text-white gap-2">
            <Plus className="w-4 h-4" />
            Nouvelle recherche
          </Button>
        </Link>
      </div>

      {projets.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-16 text-center">
            <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">Vous n'avez pas encore de recherche active.</p>
            <Link href="/entreprise/cahier-des-charges">
              <Button className="bg-[#1a3a5c] hover:bg-[#0f2540] text-white">
                Démarrer ma première recherche
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {projets.map((projet) => {
            const currentIndex = STATUT_ENTREPRISE_ORDER.indexOf(projet.statut);
            const progress = Math.max(
              0,
              ((currentIndex + 1) / STATUT_ENTREPRISE_ORDER.length) * 100
            );
            const cdc = projet.cahierDesCharges;

            return (
              <Card
                key={projet.id}
                className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Search className="w-6 h-6 text-amber-600" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1a3a5c] text-lg">{projet.nom}</h3>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {cdc.ville}
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Maximize2 className="w-3 h-3" />
                            {cdc.superficie}+ m²
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {cdc.capacite} postes
                          </span>
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Euro className="w-3 h-3" />
                            {cdc.budget.toLocaleString("fr-FR")} €/mois max
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Créé le{" "}
                          {new Date(projet.dateCreation).toLocaleDateString("fr-FR")}
                          {projet.dateRendezVous &&
                            ` — RDV le ${new Date(projet.dateRendezVous).toLocaleDateString("fr-FR")}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <div className="text-center">
                        <p className="text-xs text-slate-400 mb-1">Espaces reçus</p>
                        <p className="text-lg font-bold text-[#1a3a5c]">
                          {projet.espacesProposes.length}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-slate-400 mb-1">Sélectionnés</p>
                        <p className="text-lg font-bold text-amber-600">
                          {projet.espacesSelectionnes.length}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                          STATUT_COLORS[projet.statut]
                        }`}
                      >
                        {STATUT_ENTREPRISE_LABELS[projet.statut]}
                      </span>
                      <Link href={`/entreprise/projets/${projet.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          Voir <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progression</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
