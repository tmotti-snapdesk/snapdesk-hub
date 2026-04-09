import { Resend } from "resend";

/**
 * Wrapper autour du SDK Resend.
 * Doc : https://resend.com/docs
 *
 * Mode DEV : l'adresse "from" par défaut est `onboarding@resend.dev`,
 * qui fonctionne SANS domaine vérifié mais ne peut envoyer qu'à l'adresse
 * email utilisée pour créer le compte Resend. Pour envoyer en prod vers
 * n'importe qui, il faudra vérifier un domaine sur https://resend.com/domains.
 */
function getClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("RESEND_API_KEY manquante. Ajoute-la dans .env.local.");
  }
  return new Resend(apiKey);
}

export type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({ to, subject, html, text }: SendEmailInput) {
  const client = getClient();
  const from = process.env.RESEND_FROM_EMAIL || "Snapdesk <onboarding@resend.dev>";

  const { data, error } = await client.emails.send({
    from,
    to,
    subject,
    html,
    text,
  });

  if (error) {
    throw new Error(`Resend error: ${error.message}`);
  }
  return data;
}
