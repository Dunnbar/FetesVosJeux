"use client";

import Link from "next/link";
import { track, type CtaPosition } from "@/lib/analytics";

/**
 * CTA « Créer ma carte » des pages marketing.
 *
 * Les pages marketing sont des Server Components : elles ne peuvent pas
 * porter de onClick. Ce wrapper est le strict minimum de code client pour
 * mesurer la première marche du funnel — la page, elle, reste serveur.
 */
export function CtaCreerLink({
  position,
  className = "btn-primary",
  children,
}: {
  position: CtaPosition;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href="/creer"
      className={className}
      onClick={() => track("cta_creer_clic", { position })}
    >
      {children}
    </Link>
  );
}
