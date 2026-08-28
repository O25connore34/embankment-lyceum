import type { Locale, User, L } from "./types";

export function ln(value: L, locale: Locale): string {
  return value[locale];
}

export function personName(user: User, locale: Locale): string {
  if (locale === "ru") {
    const p = user.patronymic ? ` ${user.patronymic.ru}` : "";
    if (user.role === "student") return `${user.firstName.ru} ${user.lastName.ru}`;
    return `${user.lastName.ru} ${user.firstName.ru}${p}`;
  }
  return `${user.firstName.en} ${user.lastName.en}`;
}

export function shortName(user: User, locale: Locale): string {
  if (locale === "ru") return `${user.lastName.ru} ${user.firstName.ru[0]}.`;
  return `${user.firstName.en[0]}. ${user.lastName.en}`;
}

export function formatDate(iso: string, locale: Locale): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(d);
}

export function formatDateTime(iso: string, locale: Locale): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat(locale === "ru" ? "ru-RU" : "en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function weekdayName(day: number, locale: Locale): string {
  const ru = ["", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"];
  const en = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  return locale === "ru" ? ru[day] : en[day];
}

export function weekdayShort(day: number, locale: Locale): string {
  const ru = ["", "пн", "вт", "ср", "чт", "пт", "сб", "вс"];
  const en = ["", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return locale === "ru" ? ru[day] : en[day];
}

export function jsWeekdayToSlot(date = new Date()): number {
  const d = date.getDay();
  return d === 0 ? 7 : d;
}

export function markLabel(value: number, locale: Locale): string {
  if (locale === "ru") {
    if (value === 5) return "отлично";
    if (value === 4) return "хорошо";
    if (value === 3) return "удовлетворительно";
    return "неудовлетворительно";
  }
  if (value === 5) return "excellent";
  if (value === 4) return "good";
  if (value === 3) return "pass";
  return "fail";
}

export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

export function homeForRole(role: User["role"]): string {
  if (role === "teacher") return "/app/teaching";
  if (role === "admin") return "/app/admin";
  return "/app/today";
}
