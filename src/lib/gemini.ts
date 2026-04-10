import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  anonymizeClientName,
  redactClientNameInText,
} from "./client-anonymize";

/**
 * Wrapper autour du SDK Google Generative AI.
 *
 * Modèle par défaut : `gemini-2.5-flash-lite` (gratuit dans le free tier actuel).
 * Peut être surchargé via la variable d'env `GEMINI_MODEL` sans redéployer du code.
 *
 * Modèles alternatifs gratuits si le défaut ne marche pas dans ta région :
 *   - gemini-2.5-flash-lite   (recommandé, rapide, gratuit)
 *   - gemini-2.0-flash-lite
 *   - gemini-1.5-flash        (long-running, stable)
 *   - gemini-1.5-flash-8b     (le plus léger)
 *
 * Doc : https://ai.google.dev/gemini-api/docs
 */
function getClient() {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GOOGLE_GEMINI_API_KEY manquante. Ajoute-la dans .env.local (et sur Vercel).",
    );
  }
  return new GoogleGenerativeAI(apiKey);
}

function getModelName(): string {
  return process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
}

/**
 * Prompt système pour la reformulation des CR de visite.
 * Pensé pour produire un texte factuel, structuré, professionnel,
 * à destination d'un propriétaire d'espace de bureaux.
 */
const VISIT_REPORT_SYSTEM_PROMPT = `Tu es un assistant rédactionnel pour Snapdesk, une société qui commercialise des espaces de bureaux pour le compte de propriétaires immobiliers.

Ta mission : transformer les notes brutes prises par un commercial Snapdesk pendant une visite d'espace par un prospect, en un compte-rendu professionnel destiné au propriétaire de l'espace.

STRUCTURE DU COMPTE-RENDU (Markdown) :

## En bref
1 à 2 phrases maximum. Résume l'essentiel : la visite s'est-elle bien passée ? Quel est le niveau d'intérêt du prospect ? Quelle est la prochaine action ?
Cette section est TOUJOURS présente, même si les notes sont courtes.

## Éléments clés
Liste à puces Markdown des données factuelles UNIQUEMENT si elles figurent dans les notes :
- **Effectifs** : nombre actuel et/ou prévisionnel
- **Budget indicatif** : si mentionné
- **Délai de décision** : si mentionné
- **Niveau d'intérêt ressenti** : Fort / Modéré / Faible (déduis-le du ton des notes)
N'invente AUCUN chiffre. Si une info n'est pas dans les notes, ne la mentionne pas.
Si aucun élément factuel n'est disponible, OMETS cette section entièrement.

## Ce qui a plu
Reformule les retours positifs du prospect sur l'espace : localisation, aménagements, luminosité, services, etc.
Si rien de positif n'est mentionné dans les notes, OMETS cette section entièrement.

## Points d'attention soulevés
Reformule les réserves, objections ou points négatifs remontés par le prospect.
Si aucun point négatif n'est mentionné dans les notes, OMETS cette section entièrement.

## Prochaines étapes
Reformule les actions concrètes prévues après la visite : contre-visite, envoi de documents, réponse attendue, etc.
Si aucune prochaine étape n'est mentionnée, OMETS cette section entièrement.

RÈGLES STRICTES :
1. Reste strictement factuel : ne rajoute JAMAIS d'informations qui ne figurent pas dans les notes brutes.
2. Ton professionnel, neutre et bienveillant. Pas de superlatifs creux ("fantastique", "incroyable"). Pas d'emoji.
3. Phrases courtes, paragraphes courts (3 lignes max). Favorise les listes à puces pour la clarté.
4. OMETS les sections qui n'ont aucun contenu pertinent. Ne mets JAMAIS "Aucun élément spécifique remonté" ou toute phrase similaire de remplissage.
5. Longueur cible : 100 à 250 mots (ajuste selon la densité des notes).
6. N'invente pas de nom de personne, de date ou de chiffre.
7. Écris en français.
8. Désigne TOUJOURS le visiteur par "le prospect". Jamais "l'entreprise", "le client", "l'équipe" ni aucun autre synonyme. Cohérence stricte.
9. ANONYMAT DU PROSPECT : ne mentionne JAMAIS le nom de l'entreprise prospect dans le texte. Si un nom commençant par une majuscule ressemble à un nom d'entreprise dans les notes, remplace-le par "le prospect". N'utilise jamais non plus le nom du contact prospect.
10. Renvoie UNIQUEMENT le Markdown du compte-rendu, sans introduction ni conclusion de ta part.`;

export type VisitContext = {
  visitDate: Date;
  prospectCompany?: string | null;
  prospectContact?: string | null;
  attendees?: string | null;
  spaceName: string;
  rawNotes: string;
};

/**
 * Appelle Gemini pour transformer des notes brutes en compte-rendu formaté.
 * Retourne le markdown brut (prêt à stocker dans Visit.formattedReport).
 *
 * En cas de quota dépassé, renvoie une erreur claire avec les instructions
 * pour changer de modèle via la variable d'env GEMINI_MODEL.
 */
export async function formatVisitReport(ctx: VisitContext): Promise<string> {
  const client = getClient();
  const modelName = getModelName();
  const model = client.getGenerativeModel({
    model: modelName,
    systemInstruction: VISIT_REPORT_SYSTEM_PROMPT,
  });

  // Pré-anonymisation : on remplace le nom du prospect dans les notes brutes
  // AVANT de les envoyer à Gemini. Double protection (notes anonymisées +
  // instruction du prompt) pour que le nom réel ne puisse jamais ressortir
  // dans le compte-rendu visible par le propriétaire.
  const anonymizedCompany = anonymizeClientName(ctx.prospectCompany);
  const redactedRawNotes = ctx.prospectCompany
    ? redactClientNameInText(ctx.rawNotes, ctx.prospectCompany)
    : ctx.rawNotes;

  const userMessage = `
# Informations de la visite

- **Espace visité :** ${ctx.spaceName}
- **Date de la visite :** ${ctx.visitDate.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
- **Entreprise prospect :** ${anonymizedCompany || "Non renseignée"} (anonymisé, ne jamais révéler le vrai nom)
- **Participants Snapdesk :** ${ctx.attendees || "Non renseignés"}

# Notes brutes à reformuler
# (Le nom du prospect a été anonymisé. Ne tente pas de le deviner ni de le reconstituer.)

${redactedRawNotes}
`.trim();

  try {
    const result = await model.generateContent(userMessage);
    const text = result.response.text();

    if (!text || text.trim().length === 0) {
      throw new Error("La reformulation a renvoyé un texte vide.");
    }

    return text.trim();
  } catch (err) {
    // Erreur de quota → message explicite pour l'utilisateur final
    const message = err instanceof Error ? err.message : String(err);
    if (message.includes("429") || message.toLowerCase().includes("quota")) {
      throw new Error(
        `Quota Gemini dépassé sur le modèle "${modelName}". ` +
          `Essaie un autre modèle gratuit en définissant la variable d'env ` +
          `GEMINI_MODEL (ex. gemini-1.5-flash ou gemini-1.5-flash-8b).`,
      );
    }
    throw err;
  }
}
