"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Sparkles,
  Save,
  Check,
  Trash2,
  CheckCircle2,
  Building2,
} from "lucide-react";
import type { ImportStatus } from "@prisma/client";

import {
  reformatImportAction,
  updateImportFormattedReportAction,
  convertImportToVisitAction,
  discardImportAction,
} from "@/server/sheet-imports";

type SpaceOption = { id: string; label: string };

type Props = {
  importId: string;
  status: ImportStatus;
  sheetSpaceName: string;
  sheetArrondissement: string | null;
  sheetClient: string | null;
  sheetSalesCode: string;
  sheetBroker: string | null;
  sheetVisitType: string | null;
  createdByName: string | null;
  rawNotes: string;
  initialFormattedReport: string | null;
  spaces: SpaceOption[];
};

export function ImportReviewer({
  importId,
  status,
  sheetSpaceName,
  sheetArrondissement,
  sheetClient,
  sheetSalesCode,
  sheetBroker,
  sheetVisitType,
  createdByName,
  rawNotes,
  initialFormattedReport,
  spaces,
}: Props) {
  const router = useRouter();
  const [formattedReport, setFormattedReport] = useState(
    initialFormattedReport ?? "",
  );
  const [selectedSpaceId, setSelectedSpaceId] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isFormatting, startFormatting] = useTransition();
  const [isSaving, startSaving] = useTransition();
  const [isConverting, startConverting] = useTransition();
  const [isDiscarding, startDiscarding] = useTransition();

  const isPending = status === "PENDING_REVIEW";
  const isConverted = status === "CONVERTED";
  const isDiscarded = status === "DISCARDED";

  const handleReformat = () => {
    setError("");
    setSuccess("");
    startFormatting(async () => {
      const result = await reformatImportAction(importId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setFormattedReport(result.formatted);
      setSuccess("Compte-rendu reformulé.");
    });
  };

  const handleSave = () => {
    setError("");
    setSuccess("");
    startSaving(async () => {
      const result = await updateImportFormattedReportAction(
        importId,
        formattedReport,
      );
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSuccess("Compte-rendu enregistré.");
    });
  };

  const handleConvert = () => {
    setError("");
    setSuccess("");
    if (!selectedSpaceId) {
      setError("Sélectionne un espace avant de valider.");
      return;
    }
    if (!formattedReport.trim()) {
      setError("Reformule le compte-rendu avant de valider.");
      return;
    }
    startConverting(async () => {
      // Sauvegarde du texte s'il a été édité avant la conversion
      const save = await updateImportFormattedReportAction(
        importId,
        formattedReport,
      );
      if (!save.ok) {
        setError(save.error);
        return;
      }
      const result = await convertImportToVisitAction({
        importId,
        spaceId: selectedSpaceId,
      });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push(
        `/bizdev/espaces/${result.spaceId}/visites/${result.visitId}`,
      );
    });
  };

  const handleDiscard = () => {
    setError("");
    setSuccess("");
    if (!confirm("Rejeter cet import ? Il sera marqué comme abandonné.")) {
      return;
    }
    startDiscarding(async () => {
      const result = await discardImportAction(importId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      router.push("/bizdev/imports");
    });
  };

  return (
    <div className="space-y-6">
      {/* Status banner */}
      {isConverted && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-200">
          <CheckCircle2 className="w-4 h-4" />
          Cet import a été converti en visite.
        </div>
      )}
      {isDiscarded && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-100 text-slate-600 text-sm border border-slate-200">
          <Trash2 className="w-4 h-4" />
          Cet import a été rejeté.
        </div>
      )}

      {/* Feedback */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 text-sm border border-red-200">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 text-green-700 text-sm border border-green-200">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          {success}
        </div>
      )}

      {/* Sheet context */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1C1F25]">
            Données issues du Sheet
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <Field label="Espace (Sheet)" value={sheetSpaceName} />
            <Field label="Arrondissement" value={sheetArrondissement} />
            <Field label="Client" value={sheetClient} />
            <Field
              label="Commercial"
              value={
                createdByName
                  ? `${createdByName} (${sheetSalesCode})`
                  : sheetSalesCode
              }
            />
            <Field label="Broker" value={sheetBroker} />
            <Field label="Type de visite" value={sheetVisitType} />
          </div>
        </CardContent>
      </Card>

      {/* Raw notes */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-[#1C1F25]">
            Notes brutes (colonne Feedbacks)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-700 whitespace-pre-wrap font-mono">
            {rawNotes}
          </div>
        </CardContent>
      </Card>

      {/* Reformulate */}
      {isPending && (
        <div className="flex items-center justify-center">
          <Button
            onClick={handleReformat}
            disabled={isFormatting}
            size="lg"
            className="bg-gradient-to-r from-[#1C1F25] to-[#2a3040] hover:from-[#111318] hover:to-[#1C1F25] text-white gap-2 shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            {isFormatting
              ? "Reformulation en cours..."
              : formattedReport
                ? "Reformuler à nouveau avec l'IA"
                : "Reformuler avec l'IA (Gemini)"}
          </Button>
        </div>
      )}

      {/* Formatted report */}
      {(formattedReport || isFormatting) && (
        <Card className="border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base font-semibold text-[#1C1F25] flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Compte-rendu pour le propriétaire
            </CardTitle>
            {isPending && formattedReport && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                Enregistrer
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <Textarea
              value={formattedReport}
              onChange={(e) => setFormattedReport(e.target.value)}
              rows={14}
              className="text-sm leading-relaxed"
              disabled={!isPending || isFormatting}
              placeholder={
                isFormatting
                  ? "L'IA est en train de reformuler tes notes..."
                  : ""
              }
            />
          </CardContent>
        </Card>
      )}

      {/* Assign to space + actions */}
      {isPending && formattedReport && (
        <Card className="border-0 shadow-sm bg-[#eef3f2]/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold text-[#1C1F25] flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Assigner à un espace
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-600">
              Le nom remonté par le Sheet est{" "}
              <strong>&laquo; {sheetSpaceName} &raquo;</strong>. Sélectionne
              l&apos;espace Snapdesk correspondant ci-dessous :
            </p>
            <select
              value={selectedSpaceId}
              onChange={(e) => setSelectedSpaceId(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#1C1F25]/20"
            >
              <option value="">— Sélectionner un espace —</option>
              {spaces.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
            {spaces.length === 0 && (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                Aucun espace n&apos;existe encore dans Snapdesk. Crée d&apos;abord
                un propriétaire + son espace depuis l&apos;interface admin.
              </p>
            )}

            <div className="flex items-center justify-between gap-3 pt-2">
              <Button
                variant="outline"
                onClick={handleDiscard}
                disabled={isDiscarding || isConverting}
                className="text-red-600 hover:bg-red-50 border-red-200 gap-2"
              >
                <Trash2 className="w-4 h-4" />
                Rejeter
              </Button>
              <Button
                onClick={handleConvert}
                disabled={
                  isConverting ||
                  !selectedSpaceId ||
                  !formattedReport.trim()
                }
                className="bg-green-600 hover:bg-green-700 text-white gap-2"
              >
                <Check className="w-4 h-4" />
                {isConverting
                  ? "Création de la visite..."
                  : "Valider et créer la visite"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string | null }) {
  return (
    <div>
      <p className="text-xs text-slate-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-sm font-medium text-[#1C1F25] mt-0.5">
        {value || <span className="text-slate-300">—</span>}
      </p>
    </div>
  );
}
