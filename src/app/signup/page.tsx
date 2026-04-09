"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { SnapdeskLogo } from "@/components/SnapdeskLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { registerOwnerAction } from "@/server/auth-actions";
import { AlertCircle, Building2 } from "lucide-react";

export default function SignUpPage() {
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirm) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    startTransition(async () => {
      const result = await registerOwnerAction({
        name: form.name,
        company: form.company,
        email: form.email,
        password: form.password,
      });
      if (!result.ok) {
        setError(result.error);
      }
      // En cas de succès, NextAuth redirige automatiquement vers /proprietaire
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1F25] via-[#2a3040] to-[#1C1F25] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <SnapdeskLogo variant="light" size="lg" className="justify-center mb-4" />
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 rounded-xl bg-[#eef3f2] flex items-center justify-center mb-3">
              <Building2 className="w-6 h-6 text-[#1C1F25]" />
            </div>
            <CardTitle className="text-2xl font-bold text-[#1C1F25]">
              Créer votre compte propriétaire
            </CardTitle>
            <CardDescription>
              Soumettez votre premier espace et recevez une étude de rentabilité
              gratuite sous 48h.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Prénom et nom</Label>
                  <Input
                    placeholder="Jean Dupont"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Société</Label>
                  <Input
                    placeholder="Ma Société SAS"
                    value={form.company}
                    onChange={(e) =>
                      setForm({ ...form, company: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email professionnel</Label>
                <Input
                  type="email"
                  placeholder="vous@societe.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mot de passe</Label>
                  <Input
                    type="password"
                    placeholder="8 caractères min."
                    value={form.password}
                    onChange={(e) =>
                      setForm({ ...form, password: e.target.value })
                    }
                    required
                    minLength={8}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Confirmation</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={(e) =>
                      setForm({ ...form, confirm: e.target.value })
                    }
                    required
                    minLength={8}
                  />
                </div>
              </div>
              {form.password && form.confirm && form.password !== form.confirm && (
                <p className="text-red-500 text-xs">
                  Les mots de passe ne correspondent pas.
                </p>
              )}
              <Button
                type="submit"
                className="w-full bg-[#1C1F25] hover:bg-[#111318] text-white"
                disabled={
                  isPending ||
                  form.password !== form.confirm ||
                  !form.email ||
                  !form.name
                }
              >
                {isPending ? "Création du compte..." : "Créer mon compte"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            <p className="text-sm text-slate-500 text-center">
              Déjà un compte ?{" "}
              <Link href="/signin" className="text-[#1C1F25] font-semibold hover:underline">
                Se connecter
              </Link>
            </p>
            <Link href="/" className="text-slate-400 hover:text-slate-600 text-xs text-center">
              ← Retour à l&apos;accueil
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
