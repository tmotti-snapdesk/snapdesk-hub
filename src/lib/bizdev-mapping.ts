/**
 * Mapping des initiales BizDev (telles que saisies dans le Google Sheet
 * de suivi des visites) vers les emails des comptes Snapdesk.
 *
 * Pour ajouter un nouveau BizDev :
 *   1. Créer son compte dans Snapdesk (role = BIZDEV)
 *   2. Ajouter une entrée ici
 *   3. Mettre à jour prisma/seed.ts (optionnel, pour le dev local)
 */
export const BIZDEV_INITIALS_MAP: Record<string, string> = {
  MV: "mvisiedo@snapdesk.co",
  FF: "ffourquemin@snapdesk.co",
  TM: "tmartins@snapdesk.co",
  MR: "mrumeau@snapdesk.co",
  MP: "mparmentelot@snapdesk.co",
  RH: "rherfort@snapdesk.co",
};

export type BizdevInitial = keyof typeof BIZDEV_INITIALS_MAP;

/**
 * Retourne l'email correspondant aux initiales, ou null si inconnu.
 * Insensible à la casse.
 */
export function emailFromInitials(initials: string): string | null {
  const key = initials.trim().toUpperCase();
  return BIZDEV_INITIALS_MAP[key] ?? null;
}
