"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Upload, ChevronLeft, ChevronRight } from "lucide-react";

const STEPS = [
  { num: 1, label: "Localisation" },
  { num: 2, label: "Caractéristiques" },
  { num: 3, label: "Informations financières" },
  { num: 4, label: "Description" },
];

const TYPES_ESPACE = [
  "Plateau open-space",
  "Bureaux cloisonnés",
  "Coworking privatisé",
  "Immeuble de bureaux",
  "Local commercial converti",
  "Autre",
];

const AMENAGEMENTS = [
  "Salles de réunion",
  "Cuisine équipée",
  "Parking",
  "Fibre dédiée",
  "Conciergerie",
  "Terrasse / extérieur",
  "Salle de sport",
  "Restaurant d'entreprise",
  "Accès 24/7",
  "Réception / accueil",
];

export default function NouvelEspacePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    adresse: "",
    ville: "",
    codePostal: "",
    superficie: "",
    capacite: "",
    typeEspace: "",
    etage: "",
    loyer: "",
    disponibilite: "",
    charges: "",
    nom: "",
    description: "",
    amenagements: [] as string[],
    travaux: "",
    photoDescription: "",
  });

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleAmenagement = (item: string) => {
    setForm((prev) => ({
      ...prev,
      amenagements: prev.amenagements.includes(item)
        ? prev.amenagements.filter((a) => a !== item)
        : [...prev.amenagements, item],
    }));
  };

  const handleSubmit = async () => {
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
    setTimeout(() => router.push("/proprietaire/projets"), 3000);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full border-0 shadow-lg text-center">
          <CardContent className="p-10">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-5" />
            <h2 className="text-2xl font-bold text-[#1C1F25] mb-2">Espace soumis !</h2>
            <p className="text-slate-600 mb-1">
              Votre espace <strong>{form.nom || "sans nom"}</strong> a bien été enregistré.
            </p>
            <p className="text-slate-500 text-sm">
              Notre équipe sourcing vous recontactera sous 48 heures.
              Redirection vers vos projets…
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1C1F25]">Soumettre un espace</h1>
        <p className="text-slate-500 mt-1">
          Renseignez les informations de votre espace pour que notre équipe puisse l'étudier.
        </p>
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        {STEPS.map((s) => (
          <div key={s.num} className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-all ${
                step >= s.num ? "bg-[#1C1F25]" : "bg-slate-200"
              }`}
            />
            <p
              className={`text-xs mt-1.5 font-medium ${
                step >= s.num ? "text-[#1C1F25]" : "text-slate-400"
              }`}
            >
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#1C1F25]">
            {STEPS[step - 1].label}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Step 1: Localisation */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label>Nom / Titre de l'espace *</Label>
                <Input
                  placeholder="Ex : Tour Majunga – Plateau 8, Espace Montparnasse…"
                  value={form.nom}
                  onChange={(e) => update("nom", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Adresse *</Label>
                <Input
                  placeholder="Numéro, rue"
                  value={form.adresse}
                  onChange={(e) => update("adresse", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Code postal *</Label>
                  <Input
                    placeholder="75001"
                    value={form.codePostal}
                    onChange={(e) => update("codePostal", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ville *</Label>
                  <Input
                    placeholder="Paris"
                    value={form.ville}
                    onChange={(e) => update("ville", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Étage</Label>
                <Input
                  placeholder="Ex : 5ème étage, RDC…"
                  value={form.etage}
                  onChange={(e) => update("etage", e.target.value)}
                />
              </div>
            </>
          )}

          {/* Step 2: Caractéristiques */}
          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Superficie (m²) *</Label>
                  <Input
                    type="number"
                    placeholder="450"
                    value={form.superficie}
                    onChange={(e) => update("superficie", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Capacité (postes) *</Label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={form.capacite}
                    onChange={(e) => update("capacite", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Type d'espace *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {TYPES_ESPACE.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => update("typeEspace", type)}
                      className={`p-3 rounded-lg border text-sm text-left transition-all ${
                        form.typeEspace === type
                          ? "border-[#1C1F25] bg-[#eef3f2] text-[#1C1F25] font-medium"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Aménagements disponibles</Label>
                <div className="grid grid-cols-2 gap-2">
                  {AMENAGEMENTS.map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.amenagements.includes(item)}
                        onChange={() => toggleAmenagement(item)}
                        className="rounded border-slate-300 text-[#1C1F25]"
                      />
                      <span className="text-sm text-slate-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 3: Financier */}
          {step === 3 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Loyer souhaité (€/mois HT) *</Label>
                  <Input
                    type="number"
                    placeholder="15000"
                    value={form.loyer}
                    onChange={(e) => update("loyer", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Charges (€/mois, si connues)</Label>
                  <Input
                    type="number"
                    placeholder="2000"
                    value={form.charges}
                    onChange={(e) => update("charges", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Disponibilité *</Label>
                <Input
                  type="date"
                  value={form.disponibilite}
                  onChange={(e) => update("disponibilite", e.target.value)}
                />
              </div>
              <div className="p-4 bg-[#eef3f2] rounded-lg border border-[#A9BCB7]/30">
                <p className="text-xs text-[#1C1F25] font-semibold mb-1">
                  À titre indicatif
                </p>
                <p className="text-xs text-[#1C1F25] leading-relaxed">
                  Le loyer final sera négocié avec notre équipe lors de la phase de discussion.
                  Snapdesk peut également proposer une structure de rémunération variable.
                </p>
              </div>
            </>
          )}

          {/* Step 4: Description */}
          {step === 4 && (
            <>
              <div className="space-y-2">
                <Label>Description de l'espace *</Label>
                <Textarea
                  placeholder="Décrivez votre espace : luminosité, vues, qualité de construction, prestations particulières, historique…"
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={5}
                />
              </div>
              <div className="space-y-2">
                <Label>État & travaux</Label>
                <Textarea
                  placeholder="État actuel de l'espace, travaux récents ou à prévoir, label environnemental éventuel (HQE, BREEAM…)"
                  value={form.travaux}
                  onChange={(e) => update("travaux", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Photos (liens ou description)</Label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center">
                  <Upload className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500">
                    La gestion des photos sera disponible après soumission.
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Notre équipe vous contactera pour les organiser.
                  </p>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => (step > 1 ? setStep(step - 1) : router.back())}
          className="gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          {step === 1 ? "Annuler" : "Précédent"}
        </Button>

        {step < 4 ? (
          <Button
            onClick={() => setStep(step + 1)}
            className="bg-[#1C1F25] hover:bg-[#111318] text-white gap-2"
            disabled={
              (step === 1 && (!form.nom || !form.adresse || !form.ville)) ||
              (step === 2 && (!form.superficie || !form.typeEspace)) ||
              (step === 3 && (!form.loyer || !form.disponibilite))
            }
          >
            Suivant <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="bg-[#1C1F25] hover:bg-[#111318] text-white gap-2"
            disabled={!form.description}
          >
            Soumettre l'espace <CheckCircle2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
