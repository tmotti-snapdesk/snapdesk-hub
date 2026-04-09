"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2,
  Upload,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

import { createSpaceAction } from "@/server/spaces";
import { SPACE_TYPES, SPACE_AMENITIES } from "@/lib/space-status";

const STEPS = [
  { num: 1, label: "Localisation" },
  { num: 2, label: "Caractéristiques" },
  { num: 3, label: "Informations financières" },
  { num: 4, label: "Description" },
];

export default function NouvelEspacePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    address: "",
    postalCode: "",
    city: "",
    floor: "",
    area: "",
    capacity: "",
    spaceType: "",
    amenities: [] as string[],
    monthlyRent: "",
    monthlyCharges: "",
    availabilityDate: "",
    description: "",
    worksStatus: "",
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleAmenity = (item: string) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(item)
        ? prev.amenities.filter((a) => a !== item)
        : [...prev.amenities, item],
    }));
  };

  const handleSubmit = () => {
    setError("");
    startTransition(async () => {
      const result = await createSpaceAction({
        name: form.name,
        address: form.address,
        postalCode: form.postalCode,
        city: form.city,
        floor: form.floor || undefined,
        area: Number(form.area),
        capacity: Number(form.capacity),
        spaceType: form.spaceType,
        amenities: form.amenities,
        monthlyRent: Number(form.monthlyRent),
        monthlyCharges: form.monthlyCharges
          ? Number(form.monthlyCharges)
          : undefined,
        availabilityDate: form.availabilityDate,
        description: form.description,
        worksStatus: form.worksStatus || undefined,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/proprietaire/projets/${result.spaceId}?justCreated=1`);
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1C1F25]">
          Soumettre un espace
        </h1>
        <p className="text-slate-500 mt-1">
          Renseignez les informations de votre espace pour que notre équipe
          puisse l&apos;étudier.
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
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Step 1: Localisation */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label>Nom / Titre de l&apos;espace *</Label>
                <Input
                  placeholder="Ex : Tour Majunga – Plateau 8, Espace Montparnasse…"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Adresse *</Label>
                <Input
                  placeholder="Numéro, rue"
                  value={form.address}
                  onChange={(e) => update("address", e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Code postal *</Label>
                  <Input
                    placeholder="75001"
                    value={form.postalCode}
                    onChange={(e) => update("postalCode", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ville *</Label>
                  <Input
                    placeholder="Paris"
                    value={form.city}
                    onChange={(e) => update("city", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Étage</Label>
                <Input
                  placeholder="Ex : 5ème étage, RDC…"
                  value={form.floor}
                  onChange={(e) => update("floor", e.target.value)}
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
                    value={form.area}
                    onChange={(e) => update("area", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Capacité (postes) *</Label>
                  <Input
                    type="number"
                    placeholder="30"
                    value={form.capacity}
                    onChange={(e) => update("capacity", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Type d&apos;espace *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {SPACE_TYPES.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => update("spaceType", type)}
                      className={`p-3 rounded-lg border text-sm text-left transition-all ${
                        form.spaceType === type
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
                  {SPACE_AMENITIES.map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={form.amenities.includes(item)}
                        onChange={() => toggleAmenity(item)}
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
                    value={form.monthlyRent}
                    onChange={(e) => update("monthlyRent", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Charges (€/mois, si connues)</Label>
                  <Input
                    type="number"
                    placeholder="2000"
                    value={form.monthlyCharges}
                    onChange={(e) =>
                      update("monthlyCharges", e.target.value)
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Disponibilité *</Label>
                <Input
                  type="date"
                  value={form.availabilityDate}
                  onChange={(e) =>
                    update("availabilityDate", e.target.value)
                  }
                />
              </div>
              <div className="p-4 bg-[#eef3f2] rounded-lg border border-[#A9BCB7]/30">
                <p className="text-xs text-[#1C1F25] font-semibold mb-1">
                  À titre indicatif
                </p>
                <p className="text-xs text-[#1C1F25] leading-relaxed">
                  Le loyer final sera négocié avec notre équipe lors de la
                  phase de discussion. Snapdesk peut également proposer une
                  structure de rémunération variable.
                </p>
              </div>
            </>
          )}

          {/* Step 4: Description */}
          {step === 4 && (
            <>
              <div className="space-y-2">
                <Label>Description de l&apos;espace *</Label>
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
                  value={form.worksStatus}
                  onChange={(e) => update("worksStatus", e.target.value)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Photos</Label>
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
          disabled={isPending}
        >
          <ChevronLeft className="w-4 h-4" />
          {step === 1 ? "Annuler" : "Précédent"}
        </Button>

        {step < 4 ? (
          <Button
            onClick={() => setStep(step + 1)}
            className="bg-[#1C1F25] hover:bg-[#111318] text-white gap-2"
            disabled={
              (step === 1 &&
                (!form.name || !form.address || !form.city || !form.postalCode)) ||
              (step === 2 &&
                (!form.area || !form.capacity || !form.spaceType)) ||
              (step === 3 && (!form.monthlyRent || !form.availabilityDate))
            }
          >
            Suivant <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="bg-[#1C1F25] hover:bg-[#111318] text-white gap-2"
            disabled={!form.description || isPending}
          >
            {isPending ? "Soumission..." : "Soumettre l'espace"}
            <CheckCircle2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
