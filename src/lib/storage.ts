import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { put } from "@vercel/blob";

/**
 * Stockage des fichiers uploadés (images cover).
 *
 * Deux modes, choisis automatiquement :
 *   1. Vercel Blob — utilisé si `BLOB_READ_WRITE_TOKEN` est défini.
 *      C'est le mode de prod : le filesystem Vercel est en lecture seule,
 *      donc impossible d'écrire dans /public/uploads/.
 *   2. Filesystem local — fallback en dev, écrit dans /public/uploads/.
 *      Pratique pour bosser sans devoir set un Blob.
 *
 * Dans les deux cas, on retourne une URL **utilisable directement** dans
 * un <img src> :
 *   - Blob : URL absolue HTTPS (ex: https://abc.public.blob.vercel-storage.com/x.jpg)
 *   - Local : chemin relatif servi par Next (ex: /uploads/x.jpg)
 */

const useBlob = (): boolean => Boolean(process.env.BLOB_READ_WRITE_TOKEN);

interface UploadResult {
  /** URL prête à coller dans un <img src>. À stocker tel quel en DB. */
  url: string;
  /** Le backend utilisé — utile pour les logs et les tests. */
  backend: "blob" | "local";
}

/**
 * Upload une image (typiquement la cover d'une carte) et renvoie son URL publique.
 *
 * @param file - le File reçu via FormData
 * @param slug - un identifiant unique sans extension (généré par generateFileSlug)
 * @param ext  - l'extension du fichier (jpg / png / webp / gif)
 */
export async function uploadCoverImage(
  file: File,
  slug: string,
  ext: string
): Promise<UploadResult> {
  const filename = `${slug}.${ext}`;

  if (useBlob()) {
    // Vercel Blob — accès public. Pas de cache-control custom : par défaut
    // les fichiers sont caché-ables, ce qui convient pour notre cas.
    const blob = await put(`covers/${filename}`, file, {
      access: "public",
      addRandomSuffix: false, // on contrôle déjà l'unicité via slug
    });
    return { url: blob.url, backend: "blob" };
  }

  // Mode local : écrit dans /public/uploads/, Next le sert sur /uploads/...
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });
  const arrayBuffer = await file.arrayBuffer();
  await writeFile(path.join(uploadsDir, filename), Buffer.from(arrayBuffer));
  return { url: `/uploads/${filename}`, backend: "local" };
}
