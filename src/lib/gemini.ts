import { GoogleGenerativeAI } from "@google/generative-ai";

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

RÈGLES STRICTES :
1. Reste strictement factuel : ne rajoute JAMAIS d'informations qui ne figurent pas dans les notes brutes.
2. Ton professionnel, neutre et bienveillant. Pas de superlatifs creux ("fantastique", "incroyable"). Pas d'emoji.
3. Structure le compte-rendu avec les sections Markdown suivantes, dans cet ordre :
   ## Contexte de la visite
   ## Retours du prospect sur l'espace
   ## Points d'attention
   ## Prochaines étapes
4. Si une section n'a pas d'information dans les notes brutes, écris "Aucun élément spécifique remonté." (ne supprime pas la section).
5. Longueur cible : 150 à 300 mots.
6. N'invente pas de nom de personne, de date ou de chiffre. Si une info manque, ne la mentionne pas.
7. Écris en français. Utilise le vouvoiement implicite (pas de "tu").
8. Renvoie UNIQUEMENT le Markdown du compte-rendu, sans introduction ni conclusion de ta part.`;

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

  const userMessage = `
# Informations de la visite

- **Espace visité :** ${ctx.spaceName}
- **Date de la visite :** ${ctx.visitDate.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
- **Entreprise prospect :** ${ctx.prospectCompany || "Non renseignée"}
- **Contact prospect :** ${ctx.prospectContact || "Non renseigné"}
- **Participants Snapdesk :** ${ctx.attendees || "Non renseignés"}

# Notes brutes à reformuler

${ctx.rawNotes}
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
