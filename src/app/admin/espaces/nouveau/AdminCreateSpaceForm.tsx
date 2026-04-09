"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Save } from "lucide-react";

import { adminCreateSpaceAction } from "@/server/admin";
import { SPACE_TYPES, SPACE_AMENITIES } from "@/lib/space-status";

type OwnerOption = { id: string; label: string };

export function AdminCreateSpaceForm({
  owners,
  initialOwnerId,
}: {
  owners: OwnerOption[];
  initialOwnerId?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    ownerId: initialOwnerId ?? "",
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
    availabilityDate: new Date().toISOString().split("T")[0],
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await adminCreateSpaceAction({
        ownerId: form.ownerId,
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
      router.push("/admin/proprietaires");
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

          {/* Propriétaire */}
          <div className="space-y-2">
            <Label>Propriétaire *</Label>
            <select
              value={form.ownerId}
              onChange={(e) => update("ownerId", e.target.value)}
              required
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C1F25]/20"
            >
              <option value="">— Sélectionner un propriétaire —</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {/* Localisation */}
          <div className="space-y-2">
            <Label>Nom de l&apos;espace *</Label>
            <Input
              placeholder="Ex : Bergère R+2, Tour Alpha Plateau 12…"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Adresse *</Label>
            <Input
              placeholder="Numéro, rue"
              value={form.address}
              onChange={(e) => update("address", e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Code postal *</Label>
              <Input
                placeholder="75001"
                value={form.postalCode}
                onChange={(e) => update("postalCode", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Ville *</Label>
              <Input
                placeholder="Paris"
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Étage</Label>
              <Input
                placeholder="R+2"
                value={form.floor}
                onChange={(e) => update("floor", e.target.value)}
              />
            </div>
          </div>

          {/* Caractéristiques */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Superficie (m²) *</Label>
              <Input
                type="number"
                placeholder="450"
                value={form.area}
                onChange={(e) => update("area", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Capacité (postes) *</Label>
              <Input
                type="number"
                placeholder="30"
                value={form.capacity}
                onChange={(e) => update("capacity", e.target.value)}
                required
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
                  className={`p-2.5 rounded-lg border text-sm text-left transition-all ${
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
            <Label>Aménagements</Label>
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

          {/* Financier */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Loyer (€/mois HT) *</Label>
              <Input
                type="number"
                placeholder="15000"
                value={form.monthlyRent}
                onChange={(e) => update("monthlyRent", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Charges (€/mois)</Label>
              <Input
                type="number"
                placeholder="2000"
                value={form.monthlyCharges}
                onChange={(e) => update("monthlyCharges", e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Disponibilité *</Label>
            <Input
              type="date"
              value={form.availabilityDate}
              onChange={(e) => update("availabilityDate", e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description *</Label>
            <Textarea
              placeholder="Décris l'espace : luminosité, vues, qualité de construction, prestations particulières…"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>État & travaux</Label>
            <Textarea
              placeholder="État actuel, travaux récents ou à prévoir…"
              value={form.worksStatus}
              onChange={(e) => update("worksStatus", e.target.value)}
              rows={2}
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={
                isPending ||
                !form.ownerId ||
                !form.name ||
                !form.address ||
                !form.city ||
                !form.area ||
                !form.capacity ||
                !form.spaceType ||
                !form.monthlyRent ||
                !form.description
              }
              className="bg-[#1C1F25] hover:bg-[#111318] text-white gap-2"
            >
              <Save className="w-4 h-4" />
              {isPending ? "Création..." : "Créer l'espace"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
