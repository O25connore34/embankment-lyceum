"use client";

import { PublicShell } from "@/components/public-chrome";
import { useI18n } from "@/lib/locale";

export default function PrivacyPage() {
  const { dict } = useI18n();
  return (
    <PublicShell>
      <article className="legal">
        <h1>{dict.privacy.title}</h1>
        <p>{dict.privacy.p1}</p>
        <p>{dict.privacy.p2}</p>
        <p>{dict.privacy.p3}</p>
      </article>
    </PublicShell>
  );
}
