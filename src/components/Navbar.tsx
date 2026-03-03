"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SnapdeskLogo } from "./SnapdeskLogo";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

interface NavbarProps {
  userRole?: "proprietaire" | "entreprise" | null;
  userName?: string;
}

export function Navbar({ userRole, userName }: NavbarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const proprietaireLinks = [
    { href: "/proprietaire", label: "Tableau de bord" },
    { href: "/proprietaire/presentation", label: "Notre modèle" },
    { href: "/proprietaire/nouvel-espace", label: "Soumettre un espace" },
    { href: "/proprietaire/projets", label: "Mes projets" },
  ];

  const entrepriseLinks = [
    { href: "/entreprise", label: "Tableau de bord" },
    { href: "/entreprise/cahier-des-charges", label: "Mes besoins" },
    { href: "/entreprise/espaces", label: "Espaces proposés" },
    { href: "/entreprise/projets", label: "Mes projets" },
  ];

  const links =
    userRole === "proprietaire"
      ? proprietaireLinks
      : userRole === "entreprise"
      ? entrepriseLinks
      : [];

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("snapdesk_user");
    }
    router.push("/");
  };

  return (
    <nav className="bg-[#1C1F25] text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href={userRole ? `/${userRole}` : "/"}>
            <SnapdeskLogo variant="light" size="sm" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === link.href
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {userName && (
              <span className="hidden md:block text-sm text-white/60">
                {userName}
              </span>
            )}
            {userRole && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline ml-1">Déconnexion</span>
              </Button>
            )}

            {links.length > 0 && (
              <button
                className="md:hidden text-white/60 hover:text-white"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-3 space-y-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === link.href
                    ? "bg-white/15 text-white"
                    : "text-white/60 hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
