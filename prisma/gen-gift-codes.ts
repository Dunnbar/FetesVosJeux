/**
 * Génère des codes cadeaux à usage unique (admin).
 *
 * Usage :
 *   npm run codes:gen            → 1 code
 *   npm run codes:gen -- 10      → 10 codes
 *   npm run codes:gen -- 5 "jeu concours insta"  → 5 codes avec une note
 *
 * Chaque code débloque UNE carte gratuitement (status PAID) sans passer par
 * Stripe, puis est consommé. Distribue-les à la main.
 */

import { PrismaClient } from "@prisma/client";
import { generateUniqueCode } from "../src/lib/codes";

const db = new PrismaClient();

async function main() {
  const count = Math.max(1, parseInt(process.argv[2] ?? "1", 10) || 1);
  const note = process.argv[3]?.trim() || null;

  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = await generateUniqueCode(async (candidate) => {
      const found = await db.promoCode.findUnique({
        where: { code: candidate },
        select: { code: true },
      });
      return found !== null;
    });
    await db.promoCode.create({ data: { code, note } });
    codes.push(code);
  }

  console.log(
    `\n✅ ${count} code(s) cadeau généré(s)${note ? ` — note : "${note}"` : ""} :\n`
  );
  for (const code of codes) console.log(`   ${code}`);
  console.log(
    "\nÀ distribuer. Chaque code débloque une carte gratuitement (usage unique).\n"
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
