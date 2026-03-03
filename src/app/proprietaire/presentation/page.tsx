"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Building2,
  TrendingUp,
  Shield,
  Users,
  BarChart3,
  Wrench,
  Star,
  ArrowRight,
  CheckCircle2,
  Euro,
} from "lucide-react";

const etapes = [
  {
    num: "01",
    title: "Soumission & analyse",
    desc: "Vous renseignez les caractéristiques de votre espace. Notre équipe sourcing étudie le potentiel et vous contacte sous 48h.",
    icon: Building2,
  },
  {
    num: "02",
    title: "Visite & validation",
    desc: "Nos équipes visitent l'espace, évaluent les travaux d'aménagement nécessaires et établissent une proposition commerciale.",
    icon: Star,
  },
  {
    num: "03",
    title: "Signature & aménagement",
    desc: "Un contrat de gestion est signé. Snapdesk pilote les travaux d'aménagement selon nos standards premium.",
    icon: Shield,
  },
  {
    num: "04",
    title: "Commercialisation",
    desc: "Snapdesk commercialise votre espace auprès de son réseau d'entreprises. Vous recevez des rapports mensuels détaillés.",
    icon: TrendingUp,
  },
];

const avantages = [
  {
    icon: Euro,
    title: "Revenus garantis",
    desc: "Loyer garanti dès la signature du contrat, indépendamment du taux d'occupation.",
  },
  {
    icon: Wrench,
    title: "Gestion clé en main",
    desc: "Snapdesk gère intégralement l'aménagement, l'exploitation et la maintenance de votre espace.",
  },
  {
    icon: BarChart3,
    title: "Reporting transparent",
    desc: "Rapports mensuels détaillés : visites, taux d'occupation, revenus générés, feedback clients.",
  },
  {
    icon: Shield,
    title: "Contrat sécurisé",
    desc: "Bail commercial ferme avec engagement pluriannuel. Vos intérêts sont protégés contractuellement.",
  },
  {
    icon: Users,
    title: "Réseau qualifié",
    desc: "Accès à notre portefeuille d'entreprises en croissance, sélectionnées pour leur solidité financière.",
  },
  {
    icon: TrendingUp,
    title: "Valorisation du bien",
    desc: "L'aménagement premium réalisé par Snapdesk valorise durablement votre actif immobilier.",
  },
];

const chiffres = [
  { value: "150+", label: "Espaces gérés" },
  { value: "94%", label: "Taux d'occupation moyen" },
  { value: "48h", label: "Délai de réponse" },
  { value: "3 ans", label: "Durée moyenne des baux" },
];

export default function PresentationPage() {
  return (
    <div className="space-y-12 max-w-5xl">
      {/* Hero */}
      <div className="text-center py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1C1F25] mb-4">
          Le modèle Snapdesk pour les propriétaires
        </h1>
        <p className="text-slate-600 text-lg max-w-3xl mx-auto leading-relaxed">
          Snapdesk transforme vos espaces vides en bureaux premium gérés de A à Z.
          Vous bénéficiez d'un revenu locatif stable et garanti, sans aucune contrainte de gestion.
        </p>
      </div>

      {/* Chiffres clés */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {chiffres.map((c) => (
          <Card key={c.label} className="border-0 shadow-sm text-center">
            <CardContent className="p-6">
              <p className="text-3xl font-bold text-[#1C1F25] mb-1">{c.value}</p>
              <p className="text-sm text-slate-500">{c.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comment ça marche */}
      <div>
        <h2 className="text-2xl font-bold text-[#1C1F25] mb-6">
          Comment ça fonctionne ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {etapes.map((etape) => {
            const Icon = etape.icon;
            return (
              <Card key={etape.num} className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-[#1C1F25] rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2563eb] tracking-widest">
                      ÉTAPE {etape.num}
                    </span>
                    <h3 className="font-bold text-[#1C1F25] mt-0.5 mb-2">{etape.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{etape.desc}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Avantages */}
      <div>
        <h2 className="text-2xl font-bold text-[#1C1F25] mb-6">
          Pourquoi choisir Snapdesk ?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {avantages.map((av) => {
            const Icon = av.icon;
            return (
              <Card key={av.title} className="border border-slate-100 shadow-sm">
                <CardContent className="p-5">
                  <div className="w-10 h-10 bg-[#eef3f2] rounded-lg flex items-center justify-center mb-3">
                    <Icon className="w-5 h-5 text-[#1C1F25]" />
                  </div>
                  <h3 className="font-semibold text-[#1C1F25] mb-1">{av.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{av.desc}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Ce que Snapdesk prend en charge */}
      <Card className="border-0 shadow-sm bg-slate-50">
        <CardContent className="p-8">
          <h2 className="text-xl font-bold text-[#1C1F25] mb-5">
            Ce que Snapdesk prend en charge
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Conception et travaux d'aménagement",
              "Mobilier et équipements",
              "Commercialisation et recherche de locataires",
              "Gestion des entrées et sorties",
              "Maintenance et entretien courant",
              "Assurances et gestion des sinistres",
              "Facturation et recouvrement",
              "Reporting mensuel détaillé",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CTA */}
      <div className="text-center pb-8">
        <h2 className="text-xl font-bold text-[#1C1F25] mb-3">
          Prêt à soumettre votre espace ?
        </h2>
        <p className="text-slate-600 mb-6">
          Notre équipe sourcing vous répondra sous 48 heures.
        </p>
        <Link href="/proprietaire/nouvel-espace">
          <Button className="bg-[#1C1F25] hover:bg-[#111318] text-white px-8 py-6 text-base gap-2">
            Soumettre un espace <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
