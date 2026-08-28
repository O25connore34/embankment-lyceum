"use client";

import { useParams } from "next/navigation";
import { dictionaries } from "@/i18n";
import type { Locale } from "./types";

export function useI18n() {
  const params = useParams<{ locale: string }>();
  const locale: Locale = params.locale === "en" ? "en" : "ru";
  return {
    locale,
    dict: dictionaries[locale],
    href: (path: string) => `/${locale}${path.startsWith("/") ? path : `/${path}`}`,
  };
}

export function otherLocale(locale: Locale): Locale {
  return locale === "ru" ? "en" : "ru";
}

export function swapLocalePath(pathname: string, next: Locale): string {
  const parts = pathname.split("/");
  if (parts[1] === "ru" || parts[1] === "en") {
    parts[1] = next;
    return parts.join("/") || `/${next}`;
  }
  return `/${next}${pathname}`;
}
