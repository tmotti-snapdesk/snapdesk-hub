"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ChevronLeft, ChevronRight, Euro, MapPin, Users, Maximize2 } from "lucide-react";

const STEPS = [
  { num: 1, label: "Localisation & timing" },
  { num: 2, label: "Espace & capacité" },
  { num: 3, label: "Budget" },
  { num: 4, label: "Détails & attentes" },
];

const VILLES = ["Paris", "Lyon", "Bordeaux", "Marseille", "Toulouse", "Nantes", "Lille", "Nice", "Autre"];

const TYPES_ESPACE = [
  "Open-space",
  "Bureaux fermés",
  "Mixte (open-space + bureaux)",
  "Coworking privatisé",
  "Immeuble privatif",
  "Flexible (pas de préférence)",
];

const AMENAGEMENTS = [
  "Salles de réunion",
  "Parking",
  "Restauration / cuisine",
  "Fibre dédiée",
  "Accès 24/7",
  "Réception / accueil",
  "Conciergerie",
  "Terrasse / extérieur",
  "Salle de sport / bien-être",
  "Stockage / archives",
];

const PRIORITES = [
  "Emplacement / accessibilité",
  "Budget",
  "Superficie",
  "Qualité des prestations",
  "Flexibilité du bail",
  "Disponibilité immédiate",
];

export default function CahierDesChargesPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    nomRecherche: "",
    villes: [] as string[],
    autreVille: "",
    disponibilite: "",
    dureeBail: "",
    superficie: "",
    superficieMax: "",
    capacite: "",
    typeEspace: "",
    amenagements: [] as string[],
    budgetMin: "",
    budgetMax: "",
    charges: "incluses",
    priorites: [] as string[],
    commentaires: "",
    contactNom: "",
    contactPoste: "",
    contactTel: "",
  });

  const update = (key: string, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleItem = (field: "villes" | "amenagements" | "priorites", item: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter((i) => i !== item)
        : [...prev[field], item],
    }));
  };

  const handleSubmit = async () => {
    await new Promise((r) => setTimeout(r, 700));
    setSubmitted(true);
    setTimeout(() => router.push("/entreprise/espaces"), 3000);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full border-0 shadow-lg text-center">
          <CardContent className="p-10">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-5" />
            <h2 className="text-2xl font-bold text-[#1C1F25] mb-2">Cahier des charges envoyé !</h2>
            <p className="text-slate-600 mb-3">
              Notre équipe analyse vos besoins et vous préparera une sélection d'espaces sous 48h.
            </p>
            <p className="text-slate-400 text-sm">Redirection vers les espaces proposés…</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1C1F25]">Cahier des charges</h1>
        <p className="text-slate-500 mt-1">
          Décrivez vos besoins pour que nos experts vous proposent les espaces les plus adaptés.
        </p>
      </div>

      {/* Progress */}
      <div className="flex gap-2">
        {STEPS.map((s) => (
          <div key={s.num} className="flex-1">
            <div
              className={`h-1.5 rounded-full transition-all ${
                step >= s.num ? "bg-[#E590A1]" : "bg-slate-200"
              }`}
            />
            <p className={`text-xs mt-1.5 font-medium ${step >= s.num ? "text-[#E590A1]" : "text-slate-400"}`}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-[#1C1F25] flex items-center gap-2">
            {step === 1 && <MapPin className="w-5 h-5" />}
            {step === 2 && <Maximize2 className="w-5 h-5" />}
            {step === 3 && <Euro className="w-5 h-5" />}
            {step === 4 && <Users className="w-5 h-5" />}
            {STEPS[step - 1].label}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Step 1 */}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label>Nom de la recherche *</Label>
                <Input
                  placeholder="Ex : Siège social 2024, Ouverture bureau Lyon…"
                  value={form.nomRecherche}
                  onChange={(e) => update("nomRecherche", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Ville(s) souhaitée(s) *</Label>
                <div className="flex flex-wrap gap-2">
                  {VILLES.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => toggleItem("villes", v)}
                      className={`px-3 py-1.5 rounded-full text-sm border transition-all ${
                        form.villes.includes(v)
                          ? "bg-[#E590A1] text-white border-[#E590A1]"
                          : "border-slate-200 text-slate-600 hover:border-[#E590A1]/50"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
                {form.villes.includes("Autre") && (
                  <Input
                    placeholder="Précisez la ville"
                    value={form.autreVille}
                    onChange={(e) => update("autreVille", e.target.value)}
                    className="mt-2"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Date de disponibilité souhaitée *</Label>
                  <Input
                    type="date"
                    value={form.disponibilite}
                    onChange={(e) => update("disponibilite", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Durée de bail envisagée</Label>
                  <select
                    className="w-full h-9 rounded-md border border-slate-200 px-3 text-sm bg-white"
                    value={form.dureeBail}
                    onChange={(e) => update("dureeBail", e.target.value)}
                  >
                    <option value="">Sélectionner</option>
                    <option>1 an</option>
                    <option>2 ans</option>
                    <option>3 ans ferme</option>
                    <option>3/6/9 ans</option>
                    <option>Flexible</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Superficie minimale (m²) *</Label>
                  <Input
                    type="number"
                    placeholder="250"
                    value={form.superficie}
                    onChange={(e) => update("superficie", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Superficie maximale (m²)</Label>
                  <Input
                    type="number"
                    placeholder="600"
                    value={form.superficieMax}
                    onChange={(e) => update("superficieMax", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Nombre de postes de travail *</Label>
                <Input
                  type="number"
                  placeholder="25"
                  value={form.capacite}
                  onChange={(e) => update("capacite", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Type d'espace préféré *</Label>
                <div className="grid grid-cols-2 gap-2">
                  {TYPES_ESPACE.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => update("typeEspace", type)}
                      className={`p-3 rounded-lg border text-sm text-left transition-all ${
                        form.typeEspace === type
                          ? "border-[#E590A1] bg-[#fdf0f3] text-[#c4607a] font-medium"
                          : "border-slate-200 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Services & aménagements souhaités</Label>
                <div className="grid grid-cols-2 gap-2">
                  {AMENAGEMENTS.map((item) => (
                    <label key={item} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.amenagements.includes(item)}
                        onChange={() => toggleItem("amenagements", item)}
                        className="rounded border-slate-300"
                      />
                      <span className="text-sm text-slate-600">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Budget min (€/mois HT) *</Label>
                  <Input
                    type="number"
                    placeholder="10000"
                    value={form.budgetMin}
                    onChange={(e) => update("budgetMin", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Budget max (€/mois HT) *</Label>
                  <Input
                    type="number"
                    placeholder="20000"
                    value={form.budgetMax}
                    onChange={(e) => update("budgetMax", e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Charges</Label>
                <div className="flex gap-3">
                  {["incluses", "en sus"].map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => update("charges", opt)}
                      className={`flex-1 py-3 rounded-lg border text-sm transition-all capitalize ${
                        form.charges === opt
                          ? "border-[#E590A1] bg-[#fdf0f3] text-[#c4607a] font-medium"
                          : "border-slate-200 text-slate-600"
                      }`}
                    >
                      Charges {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Vos priorités (sélectionnez jusqu'à 3)</Label>
                <div className="grid grid-cols-2 gap-2">
                  {PRIORITES.map((p) => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.priorites.includes(p)}
                        disabled={
                          !form.priorites.includes(p) && form.priorites.length >= 3
                        }
                        onChange={() => toggleItem("priorites", p)}
                        className="rounded border-slate-300"
                      />
                      <span className={`text-sm ${!form.priorites.includes(p) && form.priorites.length >= 3 ? "text-slate-300" : "text-slate-600"}`}>
                        {p}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Step 4 */}
          {step === 4 && (
            <>
              <div className="space-y-2">
                <Label>Commentaires & critères particuliers</Label>
                <Textarea
                  placeholder="Précisez tout élément important : secteur géographique précis, contraintes d'image, besoins spécifiques de votre métier, nombre de salles de réunion, etc."
                  value={form.commentaires}
                  onChange={(e) => update("commentaires", e.target.value)}
                  rows={4}
                />
              </div>

              <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-4">
                <p className="text-sm font-semibold text-[#1C1F25]">Contact principal</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nom & prénom *</Label>
                    <Input
                      placeholder="Sophie Martin"
                      value={form.contactNom}
                      onChange={(e) => update("contactNom", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Poste</Label>
                    <Input
                      placeholder="DG, DAF, Office Manager…"
                      value={form.contactPoste}
                      onChange={(e) => update("contactPoste", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Téléphone</Label>
                  <Input
                    type="tel"
                    placeholder="+33 6 00 00 00 00"
                    value={form.contactTel}
                    onChange={(e) => update("contactTel", e.target.value)}
                  />
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
            className="bg-[#E590A1] hover:bg-[#d4788e] text-white gap-2"
            disabled={
              (step === 1 && (!form.nomRecherche || form.villes.length === 0 || !form.disponibilite)) ||
              (step === 2 && (!form.superficie || !form.typeEspace || !form.capacite)) ||
              (step === 3 && (!form.budgetMin || !form.budgetMax))
            }
          >
            Suivant <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            className="bg-[#E590A1] hover:bg-[#d4788e] text-white gap-2"
            disabled={!form.contactNom}
          >
            Envoyer mon cahier des charges <CheckCircle2 className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
