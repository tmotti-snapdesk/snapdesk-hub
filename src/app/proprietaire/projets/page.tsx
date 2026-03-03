"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MOCK_ESPACES_PROPRIETAIRE,
  STATUT_PROPRIETAIRE_LABELS,
  STATUT_PROPRIETAIRE_ORDER,
} from "@/lib/mock-data";
import { Building2, ArrowRight, Plus, FileText } from "lucide-react";

const STATUT_COLORS: Record<string, string> = {
  receptionne: "bg-blue-100 text-blue-700 border-blue-200",
  visite_planifiee: "bg-yellow-100 text-yellow-700 border-yellow-200",
  visite_effectuee: "bg-orange-100 text-orange-700 border-orange-200",
  en_discussion: "bg-purple-100 text-purple-700 border-purple-200",
  contrat_signe: "bg-green-100 text-green-700 border-green-200",
  archive: "bg-slate-100 text-slate-500 border-slate-200",
};

export default function ProjetsPage() {
  const espaces = MOCK_ESPACES_PROPRIETAIRE;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1a3a5c]">Mes projets</h1>
          <p className="text-slate-500 mt-1">
            Suivez l'avancement de chaque espace soumis à Snapdesk.
          </p>
        </div>
        <Link href="/proprietaire/nouvel-espace">
          <Button className="bg-[#1a3a5c] hover:bg-[#0f2540] text-white gap-2">
            <Plus className="w-4 h-4" />
            Nouvel espace
          </Button>
        </Link>
      </div>

      {espaces.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-16 text-center">
            <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">Vous n'avez pas encore soumis d'espace.</p>
            <Link href="/proprietaire/nouvel-espace">
              <Button className="bg-[#1a3a5c] hover:bg-[#0f2540] text-white">
                Soumettre mon premier espace
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {espaces.map((espace) => {
            const currentIndex = STATUT_PROPRIETAIRE_ORDER.indexOf(espace.statut);
            const progress = Math.max(
              0,
              ((currentIndex + 1) / STATUT_PROPRIETAIRE_ORDER.length) * 100
            );

            return (
              <Card key={espace.id} className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#1a3a5c]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-[#1a3a5c]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1a3a5c] text-lg">{espace.nom}</h3>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {espace.adresse}, {espace.ville} — {espace.superficie} m² —{" "}
                          {espace.capacite} postes
                        </p>
                        <p className="text-sm text-slate-400 mt-0.5">
                          Soumis le {new Date(espace.dateCreation).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {espace.rapports.length > 0 && (
                        <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                          <FileText className="w-3 h-3" />
                          {espace.rapports.length} rapport{espace.rapports.length > 1 ? "s" : ""}
                        </span>
                      )}
                      <span
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                          STATUT_COLORS[espace.statut]
                        }`}
                      >
                        {STATUT_PROPRIETAIRE_LABELS[espace.statut]}
                      </span>
                      <Link href={`/proprietaire/projets/${espace.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          Voir <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Mini progress */}
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progression</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1a3a5c] rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 overflow-x-auto">
                      {STATUT_PROPRIETAIRE_ORDER.map((s, i) => (
                        <span
                          key={s}
                          className={`text-[10px] whitespace-nowrap ${
                            i <= currentIndex ? "text-[#1a3a5c] font-medium" : "text-slate-300"
                          }`}
                        >
                          {STATUT_PROPRIETAIRE_LABELS[s]}
                        </span>
                      ))}
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
