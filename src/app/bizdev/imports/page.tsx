import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Inbox,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import {
  listPendingImports,
  listProcessedImports,
} from "@/server/sheet-imports";

export default async function BizdevImportsPage() {
  const [pending, processed] = await Promise.all([
    listPendingImports(),
    listProcessedImports(20),
  ]);

  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#1C1F25]">
          Imports depuis Google Sheet
        </h1>
        <p className="text-slate-500 mt-1">
          Visites reçues depuis le Sheet de suivi. Chaque import doit être
          validé + assigné à un espace avant de devenir une vraie visite
          publiable.
        </p>
      </div>

      {/* Pending */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-semibold text-[#1C1F25] flex items-center gap-2">
            <Inbox className="w-5 h-5" />
            En attente de validation ({pending.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {pending.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">
              Aucun import en attente. Les nouvelles visites saisies dans le
              Sheet apparaîtront ici.
            </p>
          ) : (
            <div className="space-y-3">
              {pending.map((imp) => (
                <Link key={imp.id} href={`/bizdev/imports/${imp.id}`}>
                  <div className="flex items-center justify-between p-4 rounded-xl border border-amber-200 bg-amber-50/40 hover:border-amber-400 hover:bg-amber-50 transition-all cursor-pointer">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-[#1C1F25] text-sm truncate">
                          {imp.sheetSpaceName}
                        </p>
                        {imp.sheetClient && (
                          <span className="text-xs text-slate-500">
                            · {imp.sheetClient}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        Visite du{" "}
                        {new Date(imp.visitDate).toLocaleDateString("fr-FR")}
                        {" "}· Saisi par{" "}
                        {imp.createdBy?.name ?? imp.sheetSalesCode}
                        {imp.sheetBroker && ` · ${imp.sheetBroker}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {imp.formattedReport ? (
                        <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 text-green-700 border border-green-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Reformulé
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          <Clock className="w-3 h-3" />
                          Brut
                        </span>
                      )}
                      <ArrowRight className="w-4 h-4 text-slate-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent history */}
      {processed.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold text-[#1C1F25]">
              Historique récent
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {processed.map((imp) => (
                <div
                  key={imp.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-100 text-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {imp.status === "CONVERTED" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-[#1C1F25] truncate">
                        {imp.convertedVisit?.space.name ?? imp.sheetSpaceName}
                        {imp.sheetClient && (
                          <span className="text-slate-500 font-normal">
                            {" "}· {imp.sheetClient}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-slate-400">
                        {new Date(imp.updatedAt).toLocaleDateString("fr-FR")} ·{" "}
                        {imp.status === "CONVERTED" ? "Converti" : "Rejeté"}
                        {imp.createdBy && ` · ${imp.createdBy.name}`}
                      </p>
                    </div>
                  </div>
                  {imp.convertedVisit && (
                    <Link
                      href={`/bizdev/espaces/${imp.convertedVisit.space.id}/visites/${imp.convertedVisit.id}`}
                      className="text-xs text-[#1C1F25] hover:underline"
                    >
                      Voir la visite →
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
