import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  FileText,
  Gauge,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

/**
 * Scénario "propriétaire sans espace" : pitch de la valeur Snapdesk
 * + gros CTA pour soumettre son premier espace.
 */
export function EmptyState({ firstName }: { firstName: string }) {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1C1F25] via-[#2a3040] to-[#1C1F25] p-8 sm:p-12 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#A9BCB7]/10 rounded-full blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Étude de rentabilité offerte
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            Bienvenue {firstName} 👋
          </h1>
          <p className="text-white/70 text-lg mb-6 leading-relaxed">
            Soumettez votre premier espace et recevez sous 48 h une{" "}
            <strong className="text-white">étude de rentabilité complète</strong>,
            gratuite et sans engagement.
          </p>
          <Link href="/proprietaire/nouvel-espace">
            <Button
              size="lg"
              className="bg-white text-[#1C1F25] hover:bg-[#eef3f2] gap-2 shadow-lg"
            >
              <Building2 className="w-5 h-5" />
              Soumettre mon premier espace
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Ce que contient l'étude */}
      <div>
        <h2 className="text-xl font-bold text-[#1C1F25] mb-4">
          Ce que contient votre étude de rentabilité
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              icon: Gauge,
              title: "Potentiel locatif",
              desc: "Benchmark du loyer optimal selon le marché local et la qualité de votre espace.",
            },
            {
              icon: FileText,
              title: "Plan de commercialisation",
              desc: "Stratégie détaillée : cible, canaux marketing, calendrier de mise sur le marché.",
            },
            {
              icon: Sparkles,
              title: "Recommandations",
              desc: "Améliorations concrètes pour maximiser l'attractivité et le taux d'occupation.",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.title} className="border-0 shadow-sm">
                <CardContent className="p-5">
                  <div className="w-10 h-10 rounded-lg bg-[#eef3f2] flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-[#1C1F25]" />
                  </div>
                  <h3 className="font-semibold text-[#1C1F25] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Garanties */}
      <Card className="border-0 shadow-sm bg-[#eef3f2]/50">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              "100 % gratuit",
              "Sans engagement",
              "Réponse sous 48 heures",
            ].map((text) => (
              <div key={text} className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-[#A9BCB7] flex-shrink-0" />
                <span className="text-sm font-medium text-[#1C1F25]">
                  {text}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
