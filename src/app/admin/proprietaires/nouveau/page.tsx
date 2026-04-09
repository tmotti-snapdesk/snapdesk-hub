import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CreateOwnerForm } from "./CreateOwnerForm";

export default function NouveauProprietairePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Link
        href="/admin/proprietaires"
        className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#1C1F25] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour aux propriétaires
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-[#1C1F25]">
          Nouveau propriétaire
        </h1>
        <p className="text-slate-500 mt-1">
          Crée un compte propriétaire. Tu pourras ensuite lui ajouter un ou
          plusieurs espaces depuis son profil.
        </p>
      </div>

      <CreateOwnerForm />
    </div>
  );
}
