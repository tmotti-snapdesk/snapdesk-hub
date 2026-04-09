/**
 * Anonymisation du nom du prospect dans tout ce que le propriétaire peut voir
 * (affichage UI, email, CR reformulé par Gemini).
 *
 * Pourquoi : le propriétaire ne doit pas pouvoir identifier le prospect pour
 * éviter qu'il contourne Snapdesk en négociant en direct.
 *
 * Format : 2 premières lettres + 4 étoiles fixes (longueur fixe pour ne pas
 * leaker la longueur du vrai nom).
 *
 *   "Upflow"              -> "Up****"
 *   "TechFlow Solutions"  -> "Te****"
 *   "A"                   -> "A****"
 *   ""                    -> ""
 */
export function anonymizeClientName(
  name: string | null | undefined,
): string {
  if (!name) return "";
  const trimmed = name.trim();
  if (!trimmed) return "";
  const prefix = trimmed.slice(0, Math.min(2, trimmed.length));
  return prefix + "****";
}

/**
 * Remplace toutes les occurrences du nom du prospect dans un texte par sa
 * version anonymisée. Utilisé pour nettoyer les notes brutes avant de les
 * envoyer à Gemini, afin que le modèle ne puisse pas reproduire le nom
 * dans sa sortie.
 *
 * Insensible à la casse, respect des limites de mots pour éviter les
 * faux positifs sur des sous-chaînes.
 */
export function redactClientNameInText(
  text: string,
  clientName: string | null | undefined,
): string {
  if (!text || !clientName) return text;
  const trimmed = clientName.trim();
  if (trimmed.length < 2) return text;

  const escaped = trimmed.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // \b : limites de mots (gère les apostrophes, ponctuation, espaces)
  const regex = new RegExp(`\\b${escaped}\\b`, "gi");
  return text.replace(regex, anonymizeClientName(trimmed));
}
