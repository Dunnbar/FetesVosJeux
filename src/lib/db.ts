import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

/**
 * Client Prisma utilisant le **Neon serverless driver** via l'adapter.
 *
 * Pourquoi pas le driver TCP classique ?
 *   - Sur Vercel (serverless / edge), le TCP traditionnel est capricieux
 *     avec Neon : connexions qui timeout, échec de TLS handshake quand
 *     `channel_binding=require` est dans l'URL, etc.
 *   - Le serverless driver de Neon utilise HTTP/WebSocket, fonctionne
 *     out-of-the-box en environnement serverless, et gère le réveil des
 *     endpoints Neon "endormis" du free tier sans qu'on ait à se soucier
 *     du connect_timeout.
 *
 * Le pool de connexions est géré côté Neon (côté serveur), donc ici
 * on instancie un seul pool client-side.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function makeClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not defined");
  }
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });
}

export const db = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
