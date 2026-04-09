"use client";

import Link from "next/link";
import { SnapdeskLogo } from "@/components/SnapdeskLogo";
import { Building2, ExternalLink, ArrowRight, CheckCircle2 } from "lucide-react";

export default function HubPage() {
  const portails = [
    {
      id: "client",
      icon: ExternalLink,
      title: "Vous êtes client Snapdesk",
      subtitle: "Accédez à votre espace de travail",
      description:
        "Connectez-vous à votre espace Snapdesk pour gérer vos bureaux, consulter vos contrats et accéder à tous vos services.",
      cta: "Accéder à mon espace",
      href: "https://app.snapdesk.co/index.php?page=signin",
      external: true,
      borderColor: "border-slate-200 hover:border-slate-400",
      iconBg: "bg-slate-100",
      iconColor: "text-slate-600",
      ctaColor: "text-slate-600",
      features: ["Gestion de votre contrat", "Facturation", "Services inclus"],
    },
    {
      id: "proprietaire",
      icon: Building2,
      title: "Vous êtes propriétaire d'espaces",
      subtitle: "Valorisez vos actifs immobiliers",
      description:
        "Présentez vos espaces à Snapdesk et rejoignez notre réseau de partenaires. Suivez l'évolution de chaque projet en temps réel.",
      cta: "Accéder à l'espace propriétaire",
      href: "/proprietaire",
      external: false,
      borderColor: "border-[#A9BCB7]/40 hover:border-[#A9BCB7]",
      iconBg: "bg-[#A9BCB7]",
      iconColor: "text-white",
      ctaColor: "text-[#A9BCB7]",
      features: [
        "Soumission d'espaces",
        "Suivi de projet",
        "Rapports mensuels",
      ],
    },
  ];

  const CardContent = ({ portail }: { portail: (typeof portails)[0] }) => {
    const Icon = portail.icon;
    return (
      <div
        className={`group relative bg-white rounded-2xl border-2 ${portail.borderColor} p-8 flex flex-col gap-5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer h-full`}
      >
        <div
          className={`w-14 h-14 rounded-xl ${portail.iconBg} flex items-center justify-center`}
        >
          <Icon className={`w-7 h-7 ${portail.iconColor}`} />
        </div>

        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            {portail.subtitle}
          </p>
          <h2 className="text-xl font-bold text-[#1C1F25] mb-3 leading-snug">
            {portail.title}
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            {portail.description}
          </p>
        </div>

        <ul className="space-y-1.5">
          {portail.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-slate-500">
              <CheckCircle2 className="w-4 h-4 text-[#A9BCB7] flex-shrink-0" />
              {f}
            </li>
          ))}
        </ul>

        <div
          className={`flex items-center justify-between pt-4 border-t border-slate-100 font-semibold text-sm ${portail.ctaColor}`}
        >
          <span>{portail.cta}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1F25] via-[#2a3040] to-[#1C1F25]">
      <header className="pt-12 pb-10 px-6 text-center">
        <SnapdeskLogo variant="light" size="lg" className="justify-center mb-8" />
        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight">
          Votre espace personnel
        </h1>
        <p className="text-white/50 text-lg md:text-xl max-w-2xl mx-auto">
          Bienvenue sur le portail Snapdesk. Sélectionnez votre profil pour
          accéder à votre espace dédié.
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-4 pb-20 grid grid-cols-1 md:grid-cols-2 gap-6">
        {portails.map((portail) =>
          portail.external ? (
            <a
              key={portail.id}
              href={portail.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex"
            >
              <CardContent portail={portail} />
            </a>
          ) : (
            <Link key={portail.id} href={portail.href} className="flex">
              <CardContent portail={portail} />
            </Link>
          )
        )}
      </main>

      <footer className="text-center py-6 text-white/40 text-sm">
        © {new Date().getFullYear()} Snapdesk — Tous droits réservés
      </footer>
    </div>
  );
}
