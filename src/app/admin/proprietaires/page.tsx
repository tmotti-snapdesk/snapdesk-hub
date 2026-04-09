import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Plus, Users, Building2, Mail, Phone } from "lucide-react";

import { listOwners } from "@/server/admin";
import {
  SPACE_STATUS_LABELS,
  SPACE_STATUS_COLORS,
} from "@/lib/space-status";

export default async function AdminOwnersPage() {
  const owners = await listOwners();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1C1F25]">Propriétaires</h1>
          <p className="text-slate-500 mt-1">
            {owners.length} propriétaire{owners.length > 1 ? "s" : ""}{" "}
            enregistré{owners.length > 1 ? "s" : ""}.
          </p>
        </div>
        <Link href="/admin/proprietaires/nouveau">
          <Button className="bg-[#1C1F25] hover:bg-[#111318] text-white gap-2">
            <UserPlus className="w-4 h-4" />
            Nouveau propriétaire
          </Button>
        </Link>
      </div>

      {owners.length === 0 ? (
        <Card className="border-0 shadow-sm">
          <CardContent className="py-16 text-center">
            <Users className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 mb-4">
              Aucun propriétaire enregistré.
            </p>
            <Link href="/admin/proprietaires/nouveau">
              <Button className="bg-[#1C1F25] hover:bg-[#111318] text-white gap-2">
                <UserPlus className="w-4 h-4" />
                Créer le premier propriétaire
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {owners.map((owner) => (
            <Card key={owner.id} className="border-0 shadow-sm">
              <CardHeader className="flex flex-row items-start justify-between pb-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-12 h-12 bg-[#1C1F25]/10 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-[#1C1F25]" />
                  </div>
                  <div className="min-w-0">
                    <CardTitle className="text-lg font-bold text-[#1C1F25]">
                      {owner.name}
                      {owner.company && (
                        <span className="text-slate-500 font-normal">
                          {" "}— {owner.company}
                        </span>
                      )}
                    </CardTitle>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {owner.email}
                      </span>
                      {owner.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {owner.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Link href={`/admin/espaces/nouveau?ownerId=${owner.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 border-[#1C1F25] text-[#1C1F25] hover:bg-[#eef3f2] whitespace-nowrap"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ajouter un espace
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {owner.spaces.length === 0 ? (
                  <p className="text-sm text-slate-400 italic">
                    Aucun espace pour ce propriétaire.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {owner.spaces.map((space) => {
                      const rentEuros = Math.round(space.monthlyRent / 100);
                      return (
                        <div
                          key={space.id}
                          className="flex items-center justify-between p-3 rounded-lg border border-slate-100"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-8 h-8 bg-[#eef3f2] rounded-lg flex items-center justify-center flex-shrink-0">
                              <Building2 className="w-4 h-4 text-[#1C1F25]" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[#1C1F25] truncate">
                                {space.name}
                              </p>
                              <p className="text-xs text-slate-500">
                                {space.city} · {space.area} m² ·{" "}
                                {rentEuros.toLocaleString("fr-FR")} €/mois
                              </p>
                            </div>
                          </div>
                          <span
                            className={`text-xs font-medium px-2.5 py-1 rounded-full border whitespace-nowrap ${
                              SPACE_STATUS_COLORS[space.status]
                            }`}
                          >
                            {SPACE_STATUS_LABELS[space.status]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
