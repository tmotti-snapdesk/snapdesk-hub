// ============================================================================
// Snapdesk — Sync visites du Sheet vers Snapdesk
//
// Installation :
//   1. Extensions → Apps Script
//   2. Coller ce code dans Code.gs
//   3. Remplacer WEBHOOK_URL et WEBHOOK_SECRET ci-dessous
//   4. Sauvegarder (💾)
//   5. Lancer la fonction `installOnEditTrigger` (une seule fois, pour
//      autoriser le script à faire des appels externes)
//   6. C'est prêt : dès qu'une ligne a "Envoi CR Visite ?" = VRAI,
//      elle est envoyée automatiquement à Snapdesk.
// ============================================================================

const WEBHOOK_URL = "https://snapdesk-hub.vercel.app/api/webhooks/sheet-visit";
const WEBHOOK_SECRET = "e88ade03a5f625c680f3b23ce1dca9c9377dc83cbc780d8f92f5d12a5ba072f0";

// Nom exact de l'onglet à synchroniser (celui affiché en bas de Google Sheets).
// Le script ignore toute édition sur un autre onglet — en particulier, il
// n'écrit jamais "⚠️ Ligne incomplète…" ailleurs que sur cette feuille.
const SHEET_NAME = "Feedback visites (2)";

// Index des colonnes (1-based). À ajuster si ton Sheet change de structure.
const COL = {
  DATE: 1,           // Col A (pas de header mais c'est la date)
  ESPACES: 5,        // Col E
  ARRONDISSEMENT: 6, // Col F
  CLIENT: 7,         // Col G
  SALES: 8,          // Col H
  BROKER: 9,         // Col I
  NOMBRE_VISITE: 10, // Col J
  FEEDBACKS: 12,     // Col L
  ENVOI_CR: 13,      // Col M "Envoi CR Visite ?"
  SYNC_STATUS: 14,   // Col N — créée par le script pour tracker les syncs
};

// --------------------------------------------------------------------------
// Installable trigger (à lancer une seule fois manuellement)
// --------------------------------------------------------------------------

function installOnEditTrigger() {
  const ss = SpreadsheetApp.getActive();
  // Nettoie les triggers existants pour éviter les doublons
  const triggers = ScriptApp.getProjectTriggers();
  triggers.forEach((t) => {
    if (t.getHandlerFunction() === "onEditSnapdesk") {
      ScriptApp.deleteTrigger(t);
    }
  });
  ScriptApp.newTrigger("onEditSnapdesk")
    .forSpreadsheet(ss)
    .onEdit()
    .create();
  SpreadsheetApp.getUi().alert("✅ Trigger Snapdesk installé.");
}

// --------------------------------------------------------------------------
// Handler principal — appelé à chaque édition du Sheet
// --------------------------------------------------------------------------

function onEditSnapdesk(e) {
  try {
    const range = e.range;
    const sheet = range.getSheet();

    // Ne traite que les éditions sur l'onglet cible (sinon on risque
    // d'écrire "Ligne incomplète" sur la mauvaise feuille).
    if (sheet.getName() !== SHEET_NAME) return;

    // Ne traite que les éditions sur la colonne "Envoi CR Visite ?"
    if (range.getColumn() !== COL.ENVOI_CR) return;

    const value = range.getValue();
    if (!value) return; // décoché ou vidé → on ignore

    const row = range.getRow();
    if (row === 1) return; // header

    // Évite les double-syncs
    const syncCell = sheet.getRange(row, COL.SYNC_STATUS);
    const existingSync = syncCell.getValue();
    if (existingSync && String(existingSync).startsWith("✅")) {
      return;
    }

    // Récupère la ligne complète
    const rowValues = sheet.getRange(row, 1, 1, COL.SYNC_STATUS).getValues()[0];

    const payload = {
      rowNumber: row,
      visitDate: formatDateForApi(rowValues[COL.DATE - 1]),
      spaceName: String(rowValues[COL.ESPACES - 1] || "").trim(),
      arrondissement: String(rowValues[COL.ARRONDISSEMENT - 1] || "").trim(),
      client: String(rowValues[COL.CLIENT - 1] || "").trim(),
      salesCode: String(rowValues[COL.SALES - 1] || "").trim(),
      broker: String(rowValues[COL.BROKER - 1] || "").trim(),
      visitType: String(rowValues[COL.NOMBRE_VISITE - 1] || "").trim(),
      feedback: String(rowValues[COL.FEEDBACKS - 1] || "").trim(),
    };

    // Garde-fous : on n'envoie pas une ligne incomplète
    if (!payload.spaceName || !payload.feedback || !payload.salesCode) {
      syncCell.setValue("⚠️ Ligne incomplète (Espace / Sales / Feedback manquant)");
      syncCell.setBackground("#FFF4C2");
      return;
    }

    // POST vers Snapdesk
    const response = UrlFetchApp.fetch(WEBHOOK_URL, {
      method: "post",
      contentType: "application/json",
      headers: { "X-Snapdesk-Webhook-Secret": WEBHOOK_SECRET },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    });

    const code = response.getResponseCode();
    const body = response.getContentText();

    if (code >= 200 && code < 300) {
      const now = new Date();
      syncCell.setValue("✅ " + Utilities.formatDate(now, "Europe/Paris", "dd/MM HH:mm"));
      syncCell.setBackground("#D4EDDA");
    } else {
      syncCell.setValue("❌ Erreur " + code + " : " + body.slice(0, 100));
      syncCell.setBackground("#F8D7DA");
    }
  } catch (err) {
    try {
      const sheet = e.range.getSheet();
      // Ne reporte l'erreur que sur l'onglet cible, pour ne pas polluer les autres feuilles.
      if (sheet.getName() !== SHEET_NAME) return;
      sheet.getRange(e.range.getRow(), COL.SYNC_STATUS)
        .setValue("❌ " + err.message);
    } catch (_) {}
  }
}

// --------------------------------------------------------------------------
// Format la date pour l'API (ISO 8601 si c'est une Date, sinon string)
// --------------------------------------------------------------------------

function formatDateForApi(value) {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value || "").trim();
}
