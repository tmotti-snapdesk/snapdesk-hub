"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SnapdeskLogo } from "@/components/SnapdeskLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building2, Users, CheckCircle2 } from "lucide-react";

type Role = "proprietaire" | "entreprise" | null;

export default function SignUpPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) return;
    await new Promise((r) => setTimeout(r, 500));
    setSuccess(true);
    setTimeout(() => router.push("/signin"), 2500);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f2540] via-[#1a3a5c] to-[#0d3270] flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center p-8 border-0 shadow-2xl">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[#1a3a5c] mb-2">Demande envoyée !</h2>
          <p className="text-slate-600">
            Notre équipe va valider votre compte et vous recontacter sous 24h. Redirection vers la connexion…
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2540] via-[#1a3a5c] to-[#0d3270] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <SnapdeskLogo variant="light" size="lg" className="justify-center mb-4" />
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-[#1a3a5c]">
              Créer un compte
            </CardTitle>
            <CardDescription>
              {step === 1 ? "Sélectionnez votre profil" : "Complétez vos informations"}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {step === 1 && (
              <div className="grid grid-cols-2 gap-4">
                {[
                  {
                    key: "proprietaire" as Role,
                    icon: Building2,
                    label: "Propriétaire",
                    desc: "Je possède des espaces de bureaux",
                  },
                  {
                    key: "entreprise" as Role,
                    icon: Users,
                    label: "Entreprise",
                    desc: "Je cherche des bureaux pour mon équipe",
                  },
                ].map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.key}
                      onClick={() => setRole(opt.key)}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${
                        role === opt.key
                          ? "border-[#1a3a5c] bg-blue-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 mb-3 ${
                          role === opt.key ? "text-[#1a3a5c]" : "text-slate-400"
                        }`}
                      />
                      <p className="font-semibold text-[#1a3a5c]">{opt.label}</p>
                      <p className="text-xs text-slate-500 mt-1">{opt.desc}</p>
                    </button>
                  );
                })}
              </div>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      required
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
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
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
                      onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                      required
                      minLength={8}
                    />
                  </div>
                </div>
                {form.password && form.confirm && form.password !== form.confirm && (
                  <p className="text-red-500 text-xs">Les mots de passe ne correspondent pas.</p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] text-white"
                  disabled={form.password !== form.confirm}
                >
                  Envoyer ma demande d'accès
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex flex-col gap-3">
            {step === 1 && (
              <Button
                className="w-full bg-[#1a3a5c] hover:bg-[#0f2540] text-white"
                disabled={!role}
                onClick={() => setStep(2)}
              >
                Continuer
              </Button>
            )}
            {step === 2 && (
              <Button variant="ghost" onClick={() => setStep(1)} className="w-full">
                ← Retour
              </Button>
            )}
            <p className="text-sm text-slate-500 text-center">
              Déjà un compte ?{" "}
              <Link href="/signin" className="text-[#1a3a5c] font-semibold hover:underline">
                Se connecter
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
