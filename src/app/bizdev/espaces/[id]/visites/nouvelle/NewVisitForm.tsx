"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Save } from "lucide-react";

import { createVisitAction } from "@/server/visits";

export function NewVisitForm({ spaceId }: { spaceId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    visitDate: new Date().toISOString().split("T")[0],
    prospectCompany: "",
    prospectContact: "",
    attendees: "",
    rawNotes: "",
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await createVisitAction({
        spaceId,
        visitDate: form.visitDate,
        prospectCompany: form.prospectCompany || undefined,
        prospectContact: form.prospectContact || undefined,
        attendees: form.attendees || undefined,
        rawNotes: form.rawNotes,
      });

      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/bizdev/espaces/${spaceId}/visites/${result.visitId}`);
    });
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date de la visite *</Label>
              <Input
                type="date"
                value={form.visitDate}
                onChange={(e) => update("visitDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Entreprise prospect</Label>
              <Input
                placeholder="Ex : TechFlow Solutions"
                value={form.prospectCompany}
                onChange={(e) => update("prospectCompany", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Contact prospect</Label>
              <Input
                placeholder="Ex : Sophie Martin, CEO"
                value={form.prospectContact}
                onChange={(e) => update("prospectContact", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Participants Snapdesk</Label>
              <Input
                placeholder="Ex : Claire Lambert, Paul Durand"
                value={form.attendees}
                onChange={(e) => update("attendees", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes brutes de la visite *</Label>
            <Textarea
              placeholder="Notez en vrac : observations, réactions du prospect, questions posées, objections, besoins exprimés, prochaines étapes convenues…"
              value={form.rawNotes}
              onChange={(e) => update("rawNotes", e.target.value)}
              rows={10}
              required
              className="font-mono text-sm"
            />
            <p className="text-xs text-slate-400">
              L&apos;IA reformulera ces notes en un compte-rendu professionnel
              pour le propriétaire à l&apos;étape suivante.
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending || !form.rawNotes.trim()}
              className="bg-[#1C1F25] hover:bg-[#111318] text-white gap-2"
            >
              <Save className="w-4 h-4" />
              {isPending ? "Enregistrement..." : "Enregistrer le brouillon"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
