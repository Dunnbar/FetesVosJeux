/**
 * Sérialisation d'un objet JSON-LD pour injection dans une balise <script>.
 *
 * JSON.stringify ne protège PAS contre une chaîne qui contiendrait
 * « </script> » : le navigateur fermerait la balise et exécuterait la
 * suite. La doc Next impose donc d'échapper « < » en « < ».
 * Ici le contenu vient d'un module TS que l'on écrit nous-mêmes, mais
 * l'échappement reste de rigueur — le jour où une FAQ sera éditée
 * ailleurs, la protection sera déjà là.
 */
export function jsonLdHtml(data: unknown): { __html: string } {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
