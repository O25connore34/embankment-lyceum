"use client";

import { PublicShell } from "@/components/public-chrome";
import { useI18n } from "@/lib/locale";

export default function TermsPage() {
  const { dict } = useI18n();
  return (
    <PublicShell>
      <article className="legal">
        <h1>{dict.terms.title}</h1>
        <p>{dict.terms.p1}</p>
        <p>{dict.terms.p2}</p>
        <p>{dict.terms.p3}</p>
      </article>
    </PublicShell>
  );
}
