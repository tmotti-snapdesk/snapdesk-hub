import { redirect } from "next/navigation";

/**
 * La section entreprise est mise en pause le temps de finaliser la section
 * propriétaire. Toutes les routes /entreprise/* renvoient vers /signin.
 *
 * TODO: ajouter le rôle ENTERPRISE à UserRole et recréer les pages
 * quand on reprendra cette partie.
 */
export default function EntrepriseLayout() {
  redirect("/signin");
}
