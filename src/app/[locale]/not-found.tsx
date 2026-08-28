"use client";

import Link from "next/link";
import { PublicShell } from "@/components/public-chrome";
import { useI18n } from "@/lib/locale";

export default function NotFound() {
  const { dict, href } = useI18n();
  return (
    <PublicShell>
      <div className="auth">
        <h1>{dict.common.notFoundTitle}</h1>
        <p className="lead">{dict.common.notFoundText}</p>
        <Link className="btn" href={href("/")}>
          {dict.nav.backHome}
        </Link>
      </div>
    </PublicShell>
  );
}
