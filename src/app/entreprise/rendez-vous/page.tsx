"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Calendar, Clock, Video, Phone, MessageSquare } from "lucide-react";

const CRENEAUX = [
  "9h00 – 9h30",
  "9h30 – 10h00",
  "10h00 – 10h30",
  "10h30 – 11h00",
  "14h00 – 14h30",
  "14h30 – 15h00",
  "15h00 – 15h30",
  "15h30 – 16h00",
  "16h00 – 16h30",
];

const FORMATS = [
  { id: "visio", icon: Video, label: "Visioconférence", desc: "Google Meet ou Teams" },
  { id: "tel", icon: Phone, label: "Téléphone", desc: "Un expert vous rappelle" },
  { id: "presentiel", icon: MessageSquare, label: "En présentiel", desc: "Nos bureaux ou les vôtres" },
];

export default function RendezVousPage() {
  const [format, setFormat] = useState("visio");
  const [date, setDate] = useState("");
  const [creneau, setCreneau] = useState("");
  const [sujet, setSujet] = useState("");
  const [nom, setNom] = useState("");
  const [tel, setTel] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await new Promise((r) => setTimeout(r, 600));
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full border-0 shadow-lg text-center">
          <CardContent className="p-10">
            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-5" />
            <h2 className="text-2xl font-bold text-[#1a3a5c] mb-2">
              Rendez-vous confirmé !
            </h2>
            <p className="text-slate-600">
              Un expert Snapdesk vous contactera pour confirmer le créneau et vous
              transmettre le lien de connexion.
            </p>
            <div className="mt-4 p-4 bg-slate-50 rounded-lg text-left text-sm text-slate-500 space-y-1">
              <p>
                <strong>Format :</strong> {FORMATS.find((f) => f.id === format)?.label}
              </p>
              {date && (
                <p>
                  <strong>Date :</strong>{" "}
                  {new Date(date).toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              )}
              {creneau && (
                <p>
                  <strong>Créneau :</strong> {creneau}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1a3a5c]">Prendre rendez-vous</h1>
        <p className="text-slate-500 mt-1">
          Échangez avec un expert Snapdesk pour affiner votre recherche ou organiser des visites.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Format */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-[#1a3a5c]">Format du rendez-vous</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {FORMATS.map((f) => {
                const Icon = f.icon;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFormat(f.id)}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      format === f.id
                        ? "border-[#1a3a5c] bg-blue-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <Icon
                      className={`w-6 h-6 mx-auto mb-2 ${
                        format === f.id ? "text-[#1a3a5c]" : "text-slate-400"
                      }`}
                    />
                    <p
                      className={`text-sm font-medium ${
                        format === f.id ? "text-[#1a3a5c]" : "text-slate-600"
                      }`}
                    >
                      {f.label}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{f.desc}</p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Créneau */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-[#1a3a5c] flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Choisir un créneau
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Date souhaitée *</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Créneau horaire *
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {CRENEAUX.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCreneau(c)}
                    className={`py-2 px-3 rounded-lg border text-sm transition-all ${
                      creneau === c
                        ? "border-[#1a3a5c] bg-blue-50 text-[#1a3a5c] font-medium"
                        : "border-slate-200 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Infos */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-[#1a3a5c]">Vos informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Votre nom *</Label>
                <Input
                  placeholder="Sophie Martin"
                  value={nom}
                  onChange={(e) => setNom(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Téléphone</Label>
                <Input
                  type="tel"
                  placeholder="+33 6 00 00 00 00"
                  value={tel}
                  onChange={(e) => setTel(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Objet / contexte</Label>
              <Textarea
                placeholder="Ex : Affiner ma recherche sur Paris, organiser des visites pour les espaces sélectionnés, question sur le processus…"
                value={sujet}
                onChange={(e) => setSujet(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] text-white py-6 text-base"
          disabled={!date || !creneau || !nom}
        >
          Confirmer le rendez-vous
        </Button>
      </form>
    </div>
  );
}
