import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminCreateSpaceForm } from "./AdminCreateSpaceForm";

export default async function AdminNouvelEspacePage({
  searchParams,
}: {
  searchParams: Promise<{ ownerId?: string }>;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/signin");
  }

  const { ownerId } = await searchParams;

  const owners = await prisma.user.findMany({
    where: { role: "OWNER" },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      company: true,
      email: true,
    },
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href="/admin/proprietaires"
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#1C1F25] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux propriétaires
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-[#1C1F25]">Nouvel espace</h1>
        <p className="text-slate-500 mt-1">
          Crée un espace pour un propriétaire existant. L&apos;espace sera
          directement créé en statut &laquo; En commercialisation &raquo;.
        </p>
      </div>

      {owners.length === 0 ? (
        <div className="p-6 rounded-xl border border-amber-200 bg-amber-50 text-amber-800">
          <p className="font-semibold mb-2">Aucun propriétaire en base.</p>
          <p className="text-sm mb-4">
            Tu dois d&apos;abord créer un propriétaire avant de pouvoir lui
            ajouter un espace.
          </p>
          <Link
            href="/admin/proprietaires/nouveau"
            className="text-sm font-semibold underline"
          >
            Créer un propriétaire →
          </Link>
        </div>
      ) : (
        <AdminCreateSpaceForm
          owners={owners.map((o) => ({
            id: o.id,
            label: `${o.name}${o.company ? ` — ${o.company}` : ""} (${o.email})`,
          }))}
          initialOwnerId={ownerId}
        />
      )}
    </div>
  );
}
