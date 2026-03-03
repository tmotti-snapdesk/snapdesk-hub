"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SnapdeskLogo } from "@/components/SnapdeskLogo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authenticateUser } from "@/lib/auth";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    await new Promise((r) => setTimeout(r, 400));
    const user = authenticateUser(email, password);

    if (user) {
      sessionStorage.setItem("snapdesk_user", JSON.stringify(user));
      router.push(`/${user.role}`);
    } else {
      setError("Email ou mot de passe incorrect.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1C1F25] via-[#2a3040] to-[#1C1F25] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <SnapdeskLogo variant="light" size="lg" className="justify-center mb-4" />
        </div>

        <Card className="border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-[#1C1F25]">
              Connexion
            </CardTitle>
            <CardDescription>
              Accédez à votre espace partenaire
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

              <div className="space-y-2">
                <Label htmlFor="email">Adresse email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#1C1F25] hover:bg-[#111318] text-white"
                disabled={loading}
              >
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>

            {/* Demo accounts */}
            <div className="mt-6 p-4 bg-[#eef3f2] rounded-lg border border-[#A9BCB7]/30">
              <p className="text-xs font-semibold text-[#1C1F25] mb-2">
                Comptes de démonstration
              </p>
              <div className="space-y-1 text-xs text-[#1C1F25]">
                <button
                  onClick={() => { setEmail("proprietaire@demo.com"); setPassword("demo1234"); }}
                  className="block hover:underline text-left"
                >
                  Propriétaire : proprietaire@demo.com / demo1234
                </button>
                <button
                  onClick={() => { setEmail("entreprise@demo.com"); setPassword("demo1234"); }}
                  className="block hover:underline text-left"
                >
                  Entreprise : entreprise@demo.com / demo1234
                </button>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 text-center text-sm text-slate-500">
            <p>
              Pas encore de compte ?{" "}
              <Link href="/signup" className="text-[#1C1F25] font-semibold hover:underline">
                S'inscrire
              </Link>
            </p>
            <Link href="/" className="text-slate-400 hover:text-slate-600 text-xs">
              ← Retour à l'accueil
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
