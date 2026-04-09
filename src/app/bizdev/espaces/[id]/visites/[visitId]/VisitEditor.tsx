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
  Send,
  Edit3,
  Clock,
  CheckCircle2,
} from "lucide-react";
import type { VisitReportStatus } from "@prisma/client";

import {
  updateRawNotesAction,
  formatVisitReportAction,
  updateFormattedReportAction,
  publishVisitReportAction,
} from "@/server/visits";

type Props = {
  visitId: string;
  initialRawNotes: string;
  initialFormattedReport: string | null;
  initialStatus: VisitReportStatus;
  prospectCompany: string | null;
  prospectContact: string | null;
  attendees: string | null;
  ownerEmail: string;
};

const STATUS_BADGE: Record<
  VisitReportStatus,
  { label: string; className: string; icon: React.ElementType }
> = {
  DRAFT: {
    label: "Brouillon",
    className: "bg-slate-100 text-slate-600 border-slate-200",
    icon: Edit3,
  },
  FORMATTED: {
    label: "Reformulé — à publier",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
  },
  PUBLISHED: {
    label: "Publié",
    className: "bg-green-100 text-green-700 border-green-200",
    icon: CheckCircle2,
  },
};

export function VisitEditor({
  visitId,
  initialRawNotes,
  initialFormattedReport,
  initialStatus,
  prospectCompany,
  prospectContact,
  attendees,
  ownerEmail,
}: Props) {
  const router = useRouter();

  const [status, setStatus] = useState<VisitReportStatus>(initialStatus);
  const [rawNotes, setRawNotes] = useState(initialRawNotes);
  const [formattedReport, setFormattedReport] = useState(
    initialFormattedReport ?? "",
  );
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSaving, startSaving] = useTransition();
  const [isFormatting, startFormatting] = useTransition();
  const [isPublishing, startPublishing] = useTransition();

  const isPublished = status === "PUBLISHED";

  const handleSaveRawNotes = () => {
    setError("");
    setSuccess("");
    startSaving(async () => {
      const result = await updateRawNotesAction(visitId, rawNotes);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSuccess("Notes brutes enregistrées.");
    });
  };

  const handleFormat = () => {
    setError("");
    setSuccess("");
    startFormatting(async () => {
      // On sauvegarde d'abord les notes brutes au cas où elles ont été éditées
      if (rawNotes !== initialRawNotes) {
        const save = await updateRawNotesAction(visitId, rawNotes);
        if (!save.ok) {
          setError(save.error);
          return;
        }
      }

      const result = await formatVisitReportAction(visitId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setFormattedReport(result.formatted);
      setStatus("FORMATTED");
      setSuccess("Compte-rendu reformulé avec succès — relis-le avant de publier.");
    });
  };

  const handleSaveFormatted = () => {
    setError("");
    setSuccess("");
    startSaving(async () => {
      const result = await updateFormattedReportAction(visitId, formattedReport);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setSuccess("Compte-rendu enregistré.");
    });
  };

  const handlePublish = () => {
    setError("");
    setSuccess("");
    startPublishing(async () => {
      // Sauvegarde le dernier état du compte-rendu avant publication
      if (formattedReport.trim()) {
        const save = await updateFormattedReportAction(visitId, formattedReport);
        if (!save.ok) {
          setError(save.error);
          return;
        }
      }
      const result = await publishVisitReportAction(visitId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setStatus("PUBLISHED");
      setSuccess(
        `Compte-rendu publié. Le propriétaire a été notifié à ${ownerEmail}.`,
      );
      // Refresh pour recharger la page côté serveur
      router.refresh();
    });
  };

  const badge = STATUS_BADGE[status];
  const BadgeIcon = badge.icon;

  return (
    <div className="space-y-6">
      {/* Status bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-full border ${badge.className}`}
          >
            <BadgeIcon className="w-4 h-4" />
            {badge.label}
          </span>
          {prospectCompany && (
            <span className="text-sm text-slate-500">
              Prospect : <strong>{prospectCompany}</strong>
              {prospectContact && ` (${prospectContact})`}
            </span>
          )}
        </div>
        {attendees && (
          <span className="text-xs text-slate-400">Avec {attendees}</span>
        )}
      </div>

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

      {/* Raw notes */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base font-semibold text-[#1C1F25] flex items-center gap-2">
            <Edit3 className="w-4 h-4" />
            Notes brutes
          </CardTitle>
          {!isPublished && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveRawNotes}
              disabled={isSaving || rawNotes.trim() === initialRawNotes.trim()}
              className="gap-1"
            >
              <Save className="w-3.5 h-3.5" />
              Enregistrer
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Textarea
            value={rawNotes}
            onChange={(e) => setRawNotes(e.target.value)}
            rows={8}
            className="font-mono text-sm"
            disabled={isPublished}
          />
        </CardContent>
      </Card>

      {/* Reformulate action */}
      {!isPublished && (
        <div className="flex items-center justify-center">
          <Button
            onClick={handleFormat}
            disabled={isFormatting || !rawNotes.trim()}
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
            {!isPublished && formattedReport && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleSaveFormatted}
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
              disabled={isPublished || isFormatting}
              placeholder={
                isFormatting
                  ? "L'IA est en train de reformuler tes notes..."
                  : ""
              }
            />
            <p className="text-xs text-slate-400 mt-2">
              Tu peux éditer manuellement ce texte avant de publier. Il sera
              visible tel quel par le propriétaire.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Publish */}
      {!isPublished && formattedReport && (
        <Card className="border-0 shadow-sm bg-[#eef3f2]/50">
          <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-[#1C1F25]">
                Prêt à publier au propriétaire ?
              </p>
              <p className="text-sm text-slate-500 mt-1">
                Le compte-rendu apparaîtra dans son espace et il recevra un
                email à {ownerEmail}.
              </p>
            </div>
            <Button
              onClick={handlePublish}
              disabled={isPublishing || !formattedReport.trim()}
              className="bg-green-600 hover:bg-green-700 text-white gap-2 whitespace-nowrap"
            >
              <Send className="w-4 h-4" />
              {isPublishing ? "Publication..." : "Publier et notifier"}
            </Button>
          </CardContent>
        </Card>
      )}

      {isPublished && (
        <Card className="border-0 shadow-sm bg-green-50">
          <CardContent className="p-5 text-center">
            <CheckCircle2 className="w-10 h-10 text-green-600 mx-auto mb-2" />
            <p className="font-semibold text-green-800">
              Compte-rendu publié
            </p>
            <p className="text-sm text-green-700 mt-1">
              Le propriétaire a accès au compte-rendu dans son espace Snapdesk.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
