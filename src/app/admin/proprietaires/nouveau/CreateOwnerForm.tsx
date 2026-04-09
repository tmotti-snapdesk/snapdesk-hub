"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle, Save } from "lucide-react";

import { createOwnerAction } from "@/server/admin";

function generateTempPassword() {
  // 8 caractères random lisibles (pas de 0/O/1/l)
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 10; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export function CreateOwnerForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    password: generateTempPassword(),
  });

  const update = (key: keyof typeof form, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    startTransition(async () => {
      const result = await createOwnerAction({
        name: form.name,
        email: form.email,
        company: form.company || undefined,
        phone: form.phone || undefined,
        password: form.password,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(`/admin/proprietaires?created=${result.ownerId}`);
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
              <Label>Nom complet *</Label>
              <Input
                placeholder="Jean Dupont"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Société</Label>
              <Input
                placeholder="Immobilier Dupont SAS"
                value={form.company}
                onChange={(e) => update("company", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Email *</Label>
              <Input
                type="email"
                placeholder="jean.dupont@exemple.com"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Téléphone</Label>
              <Input
                placeholder="+33 6 12 34 56 78"
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Mot de passe initial *</Label>
            <div className="flex gap-2">
              <Input
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className="font-mono"
                required
                minLength={8}
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => update("password", generateTempPassword())}
              >
                Régénérer
              </Button>
            </div>
            <p className="text-xs text-slate-400">
              Communique ce mot de passe au propriétaire par un canal sûr. Il
              pourra le changer à sa première connexion.
            </p>
          </div>

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isPending || !form.name || !form.email}
              className="bg-[#1C1F25] hover:bg-[#111318] text-white gap-2"
            >
              <Save className="w-4 h-4" />
              {isPending ? "Création..." : "Créer le propriétaire"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
