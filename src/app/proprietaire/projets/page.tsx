import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  ArrowRight,
  Plus,
  FileText,
} from "lucide-react";

import { auth } from "@/auth";
import { getSpacesForOwner } from "@/server/spaces";
import {
  SPACE_STATUS_LABELS,
  SPACE_STATUS_COLORS,
  SPACE_STATUS_ORDER,
} from "@/lib/space-status";

export default async function ProjetsPage() {
  const session = await auth();
  if (!session?.user) redirect("/signin");

  const spaces = await getSpacesForOwner(session.user.id);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1F25]">Mes projets</h1>
          <p className="text-slate-500 mt-1">
            Suivez l&apos;avancement de chaque espace soumis à Snapdesk.
          </p>
        </div>
        <Link href="/proprietaire/nouvel-espace">
          <Button className="bg-[#1C1F25] hover:bg-[#111318] text-white gap-2">
            <Plus className="w-4 h-4" />
            Nouvel espace
          </Button>
        </Link>
      </div>

      {spaces.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-16 text-center">
            <Building2 className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">
              Vous n&apos;avez pas encore soumis d&apos;espace.
            </p>
            <Link href="/proprietaire/nouvel-espace">
              <Button className="bg-[#1C1F25] hover:bg-[#111318] text-white">
                Soumettre mon premier espace
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {spaces.map((space) => {
            const currentIndex =
              space.status === "ARCHIVED"
                ? SPACE_STATUS_ORDER.length - 1
                : SPACE_STATUS_ORDER.indexOf(space.status);
            const progress = Math.max(
              0,
              ((currentIndex + 1) / SPACE_STATUS_ORDER.length) * 100,
            );

            return (
              <Card
                key={space.id}
                className="border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-[#1C1F25]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-6 h-6 text-[#1C1F25]" />
                      </div>
                      <div>
                        <h3 className="font-bold text-[#1C1F25] text-lg">
                          {space.name}
                        </h3>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {space.address}, {space.city} — {space.area} m² —{" "}
                          {space.capacity} postes
                        </p>
                        <p className="text-sm text-slate-400 mt-0.5">
                          Soumis le{" "}
                          {new Date(space.createdAt).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {space._count.commercializationReports > 0 && (
                        <span className="flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                          <FileText className="w-3 h-3" />
                          {space._count.commercializationReports} rapport
                          {space._count.commercializationReports > 1 ? "s" : ""}
                        </span>
                      )}
                      <span
                        className={`text-xs font-semibold px-3 py-1.5 rounded-full border ${
                          SPACE_STATUS_COLORS[space.status]
                        }`}
                      >
                        {SPACE_STATUS_LABELS[space.status]}
                      </span>
                      <Link href={`/proprietaire/projets/${space.id}`}>
                        <Button variant="outline" size="sm" className="gap-1">
                          Voir <ArrowRight className="w-3 h-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Mini progress */}
                  {space.status !== "ARCHIVED" && (
                    <div className="mt-4">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                        <span>Progression</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#1C1F25] rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex justify-between mt-2 overflow-x-auto gap-1">
                        {SPACE_STATUS_ORDER.map((s, i) => (
                          <span
                            key={s}
                            className={`text-[10px] whitespace-nowrap ${
                              i <= currentIndex
                                ? "text-[#1C1F25] font-medium"
                                : "text-slate-300"
                            }`}
                          >
                            {SPACE_STATUS_LABELS[s]}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
