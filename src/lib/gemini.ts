import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Wrapper autour du SDK Google Generative AI.
 * Utilise Gemini 2.0 Flash (modèle gratuit, 15 req/min, 1500 req/jour).
 *
 * Doc : https://ai.google.dev/gemini-api/docs
 */
function getClient() {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GOOGLE_GEMINI_API_KEY manquante. Ajoute-la dans .env.local.",
    );
  }
  return new GoogleGenerativeAI(apiKey);
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
 */
export async function formatVisitReport(ctx: VisitContext): Promise<string> {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: "gemini-2.0-flash",
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

  const result = await model.generateContent(userMessage);
  const text = result.response.text();

  if (!text || text.trim().length === 0) {
    throw new Error("La reformulation a renvoyé un texte vide.");
  }

  return text.trim();
}
