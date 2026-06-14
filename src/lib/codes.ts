import { randomBytes } from "node:crypto";

/**
 * Alphabet pour les codes courts : majuscules + chiffres, sans les
 * caractères ambigus à l'oral ou à l'écrit (O/0, I/1, L). Idéal pour un
 * code qu'on peut lire au téléphone ou taper rapidement.
 */
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // 31 caractères
const CODE_LENGTH = 10;

/**
 * Génère un code aléatoire de 10 caractères dans l'alphabet ci-dessus.
 * Entropie : 31^10 ≈ 8.2 × 10^14 — largement assez pour éviter les
 * collisions à notre échelle. La fonction d'appel doit vérifier la
 * collision en base avant insertion (cf. generateUniqueCode).
 */
export function generateCode(): string {
  const bytes = randomBytes(CODE_LENGTH);
  let code = "";
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += CODE_ALPHABET[bytes[i] % CODE_ALPHABET.length];
  }
  return code;
}

/**
 * Génère un code en vérifiant via `exists()` qu'il n'est pas déjà pris.
 * Réessaie jusqu'à `maxAttempts` fois — au-delà, on jette (l'espace est
 * tellement grand qu'une collision répétée révèlerait un bug réel).
 */
export async function generateUniqueCode(
  exists: (code: string) => Promise<boolean>,
  maxAttempts = 8
): Promise<string> {
  for (let i = 0; i < maxAttempts; i++) {
    const code = generateCode();
    if (!(await exists(code))) return code;
  }
  throw new Error(
    `Impossible de générer un code unique après ${maxAttempts} essais`
  );
}

/**
 * Slug aléatoire utilisé pour les noms de fichiers uploadés.
 * 16 caractères hexa — pas d'info devinable depuis le nom du fichier.
 */
export function generateFileSlug(): string {
  return randomBytes(8).toString("hex");
}
