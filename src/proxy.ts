import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Protège l'admin par mot de passe (Basic Auth navigateur).
 * Le mot de passe vient de la variable d'env ADMIN_PASSWORD — jamais en dur.
 * Si la variable n'est pas définie, l'accès est refusé (fail-closed).
 */
export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

export function proxy(request: NextRequest) {
  const expected = process.env.ADMIN_PASSWORD;
  const header = request.headers.get("authorization");

  if (expected && header?.startsWith("Basic ")) {
    try {
      const decoded = atob(header.slice(6)); // "utilisateur:motdepasse"
      const password = decoded.slice(decoded.indexOf(":") + 1);
      if (password === expected) {
        return NextResponse.next();
      }
    } catch {
      // base64 invalide → on tombe sur le 401 ci-dessous
    }
  }

  return new NextResponse("Authentification requise.", {
    status: 401,
    headers: {
      // En-tête HTTP = Latin-1 uniquement : pas d'accent ni de tiret cadratin.
      "WWW-Authenticate": 'Basic realm="Admin Qui Sy Gratte"',
    },
  });
}
