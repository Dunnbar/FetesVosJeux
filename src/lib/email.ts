import { Resend } from "resend";

/**
 * Envoi d'emails via Resend.
 *
 * Robustesse :
 *   - Si `RESEND_API_KEY` n'est pas défini, les fonctions deviennent des
 *     no-ops (utile en dev local pour éviter de devoir une clé). Le caller
 *     reçoit { sent: false, reason: "no-api-key" } et peut décider quoi en
 *     faire (par défaut : continuer sans bloquer).
 *   - Si Resend échoue (réseau, clé invalide, domaine non vérifié),
 *     l'erreur est encapsulée dans la réponse plutôt que jetée — pour que
 *     le caller (Server Action) puisse continuer sans planter le flow.
 */

/** Client Resend instancié paresseusement. */
let resendClient: Resend | null = null;
function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!resendClient) resendClient = new Resend(key);
  return resendClient;
}

/** Vrai si une clé Resend est configurée. */
export function isEmailEnabled(): boolean {
  return Boolean(process.env.RESEND_API_KEY);
}

interface ScratchLinkEmailArgs {
  to: string;
  code: string;
  shareUrl: string;
  annonceTitle: string | null;
}

type SendResult =
  | { sent: true; id: string }
  | { sent: false; reason: "no-api-key" | "send-failed"; error?: string };

/**
 * Envoie le mail "Ta carte est prête" à l'acheteur, avec le lien partageable.
 */
export async function sendScratchLinkEmail(
  args: ScratchLinkEmailArgs
): Promise<SendResult> {
  const client = getClient();
  if (!client) return { sent: false, reason: "no-api-key" };

  const from =
    process.env.EMAIL_FROM ?? "Qui S'y Gratte <onboarding@resend.dev>";

  try {
    const { data, error } = await client.emails.send({
      from,
      to: args.to,
      subject: "Ta carte à gratter est prête ✨",
      html: renderScratchLinkHtml(args),
      text: renderScratchLinkText(args),
    });
    if (error) {
      return {
        sent: false,
        reason: "send-failed",
        error: error.message ?? String(error),
      };
    }
    return { sent: true, id: data?.id ?? "" };
  } catch (e) {
    return {
      sent: false,
      reason: "send-failed",
      error: e instanceof Error ? e.message : String(e),
    };
  }
}

/* ============================================================
   Templates email
   Inline styles obligatoires : la plupart des clients email
   (Gmail, Outlook, Apple Mail) n'appliquent pas le CSS externe.
   On évite aussi les unités modernes (rem, var()) pour la même raison.
   ============================================================ */

function renderScratchLinkHtml(args: ScratchLinkEmailArgs): string {
  const title = escapeHtml(args.annonceTitle ?? "Ta carte à gratter");
  const code = escapeHtml(args.code);
  const url = escapeHtml(args.shareUrl);

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Ta carte à gratter</title>
</head>
<body style="margin:0;padding:0;background-color:#fbf6ee;font-family:'Helvetica Neue',Arial,sans-serif;color:#2d2438;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fbf6ee;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background-color:#ffffff;border-radius:16px;border:2px solid rgba(45,36,56,0.12);overflow:hidden;">
          <tr>
            <td style="padding:36px 36px 8px 36px;">
              <p style="margin:0 0 12px 0;font-family:'Courier New',monospace;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#d77a99;">◆ Ta carte est prête</p>
              <h1 style="margin:0 0 24px 0;font-size:30px;line-height:1.1;font-weight:700;color:#2d2438;">
                <strong>${title}</strong><br>
                <span style="color:#d77a99;">est en ligne.</span>
              </h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 36px 8px 36px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4ecde;border-radius:12px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 8px 0;font-family:'Courier New',monospace;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#6b5f75;">▸ Lien public</p>
                    <p style="margin:0 0 16px 0;font-family:'Courier New',monospace;font-size:14px;color:#2d2438;word-break:break-all;">
                      ${url}
                    </p>
                    <a href="${url}" style="display:inline-block;background-color:#ef9bb4;color:#2d2438;text-decoration:none;padding:12px 24px;border-radius:999px;border:2px solid #2d2438;font-weight:700;text-transform:uppercase;letter-spacing:1px;font-size:13px;box-shadow:5px 5px 0 0 #e8c547;">
                      Ouvrir la carte ▸
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 36px 36px 36px;">
              <p style="margin:0;font-size:14px;line-height:1.6;color:#6b5f75;">
                Code de la carte : <strong style="font-family:'Courier New',monospace;color:#2d2438;">${code}</strong>. Note-le quelque part — c'est la seule clé d'accès.
              </p>
            </td>
          </tr>
        </table>
        <p style="margin:24px 0 0 0;font-family:'Courier New',monospace;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#6b5f75;">
          Qui S'y Gratte · Qui s'y gratte… découvre.
        </p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function renderScratchLinkText(args: ScratchLinkEmailArgs): string {
  const title = args.annonceTitle ?? "Ta carte à gratter";
  return `« ${title} » est en ligne.

Lien à partager :
${args.shareUrl}

Code de la carte : ${args.code} (à conserver, seule clé d'accès).

— Qui S'y Gratte
`;
}

/** Échappe les caractères HTML dangereux pour éviter l'injection dans le mail. */
function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
