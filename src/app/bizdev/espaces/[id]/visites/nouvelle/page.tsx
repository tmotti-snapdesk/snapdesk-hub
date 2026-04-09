import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getSpaceForBizdev } from "@/server/bizdev-spaces";
import { NewVisitForm } from "./NewVisitForm";

export default async function NouvelleVisitePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const space = await getSpaceForBizdev(id);
  if (!space) notFound();

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Link
        href={`/bizdev/espaces/${id}`}
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#1C1F25] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour à l&apos;espace
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-[#1C1F25]">
          Nouvelle visite — {space.name}
        </h1>
        <p className="text-slate-500 mt-1">
          Saisissez les informations et les notes brutes de la visite. Vous
          pourrez ensuite les reformuler avec l&apos;IA et publier le
          compte-rendu au propriétaire.
        </p>
      </div>

      <NewVisitForm spaceId={id} />
    </div>
  );
}
