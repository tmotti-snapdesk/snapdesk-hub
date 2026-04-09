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
import { signInAction } from "@/server/auth-actions";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await signInAction(email, password);
      if (!result.ok) {
        setError(result.error);
      }
      // En cas de succès, NextAuth redirige automatiquement via `redirectTo`
    });
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
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#1C1F25] hover:bg-[#111318] text-white"
                disabled={isPending}
              >
                {isPending ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col gap-3 text-center text-sm text-slate-500">
            <p>
              Pas encore de compte ?{" "}
              <Link href="/signup" className="text-[#1C1F25] font-semibold hover:underline">
                S&apos;inscrire
              </Link>
            </p>
            <Link href="/" className="text-slate-400 hover:text-slate-600 text-xs">
              ← Retour à l&apos;accueil
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
