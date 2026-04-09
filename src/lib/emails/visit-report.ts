/**
 * Template email — notification de nouveau CR de visite publié.
 * HTML inline CSS (seul format fiable dans les clients mail).
 */

export type VisitReportEmailInput = {
  ownerFirstName: string;
  spaceName: string;
  visitDate: Date;
  prospectCompany?: string | null;
  reportUrl: string; // URL absolue vers /proprietaire/projets/[id]
};

export function renderVisitReportEmail(input: VisitReportEmailInput) {
  const { ownerFirstName, spaceName, visitDate, prospectCompany, reportUrl } =
    input;

  const dateStr = visitDate.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const subject = `📋 Nouveau compte-rendu de visite pour ${spaceName}`;

  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f1f5f9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.05);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1C1F25 0%,#2a3040 100%);padding:32px 32px 24px 32px;">
              <p style="margin:0;color:#A9BCB7;font-size:12px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;">Snapdesk</p>
              <h1 style="margin:8px 0 0 0;color:#ffffff;font-size:24px;font-weight:700;line-height:1.2;">
                Nouveau compte-rendu de visite
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 16px 0;color:#1C1F25;font-size:16px;line-height:1.5;">
                Bonjour ${escapeHtml(ownerFirstName)},
              </p>
              <p style="margin:0 0 24px 0;color:#475569;font-size:15px;line-height:1.6;">
                Un nouveau compte-rendu de visite pour votre espace
                <strong style="color:#1C1F25;">${escapeHtml(spaceName)}</strong>
                est disponible dans votre espace propriétaire Snapdesk.
              </p>

              <!-- Visit card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#eef3f2;border-radius:12px;margin:0 0 24px 0;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0 0 8px 0;color:#64748b;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Détails de la visite</p>
                    <p style="margin:0 0 6px 0;color:#1C1F25;font-size:15px;">
                      <strong>Date :</strong> ${escapeHtml(dateStr)}
                    </p>
                    ${
                      prospectCompany
                        ? `<p style="margin:0;color:#1C1F25;font-size:15px;"><strong>Prospect :</strong> ${escapeHtml(prospectCompany)}<span style="color:#94a3b8;font-size:12px;"> (anonymisé)</span></p>`
                        : ""
                    }
                  </td>
                </tr>
              </table>

              <!-- CTA button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${escapeHtml(reportUrl)}" style="display:inline-block;background-color:#1C1F25;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:15px;font-weight:600;">
                      Consulter le compte-rendu →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:24px 0 0 0;color:#94a3b8;font-size:13px;line-height:1.5;text-align:center;">
                Vous recevez cet email parce que vous avez soumis un espace à Snapdesk.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;padding:20px 32px;border-top:1px solid #e2e8f0;">
              <p style="margin:0;color:#94a3b8;font-size:12px;line-height:1.5;text-align:center;">
                Snapdesk — Valorisation d'espaces de bureaux<br/>
                © ${new Date().getFullYear()} Snapdesk. Tous droits réservés.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = `Bonjour ${ownerFirstName},

Un nouveau compte-rendu de visite pour votre espace "${spaceName}" est disponible dans votre espace propriétaire Snapdesk.

Détails de la visite :
- Date : ${dateStr}
${prospectCompany ? `- Prospect : ${prospectCompany}\n` : ""}
Consultez le compte-rendu : ${reportUrl}

--
Snapdesk — Valorisation d'espaces de bureaux`;

  return { subject, html, text };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
