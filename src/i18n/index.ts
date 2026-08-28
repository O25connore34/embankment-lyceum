import type { Dictionary } from "./ru";
import { ru } from "./ru";
import { en } from "./en";
import type { Locale } from "@/lib/types";

export const dictionaries: Record<Locale, Dictionary> = { ru, en };

export function isLocale(value: string): value is Locale {
  return value === "ru" || value === "en";
}
