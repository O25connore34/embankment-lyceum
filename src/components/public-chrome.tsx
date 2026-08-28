"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Logo } from "./logo";
import { useI18n, swapLocalePath } from "@/lib/locale";
import { ln } from "@/lib/format";
import { useDemo } from "@/lib/store";

export function LocaleSwitch() {
  const { locale, dict } = useI18n();
  const pathname = usePathname() || "/";
  return (
    <div className="locale" role="navigation" aria-label="Language">
      <Link href={swapLocalePath(pathname, "ru")} className={locale === "ru" ? "on" : ""}>
        {dict.common.localeRu}
      </Link>
      <Link href={swapLocalePath(pathname, "en")} className={locale === "en" ? "on" : ""}>
        {dict.common.localeEn}
      </Link>
    </div>
  );
}

export function PublicHeader() {
  const { href, dict, locale } = useI18n();
  const { state, ready } = useDemo();
  const name = ready && state ? ln(state.institution.name, locale) : dict.brand.lyceum;
  return (
    <header className="wrap">
      <div className="masthead">
        <Link className="brand" href={href("/")}>
          <Logo />
          <div>
            <strong>{name}</strong>
            <span>{dict.brand.portal}</span>
          </div>
        </Link>
        <div className="mast-actions">
          <LocaleSwitch />
          <Link className="btn" href={href("/login")}>
            {dict.nav.signIn}
          </Link>
        </div>
      </div>
    </header>
  );
}

export function PublicFooter() {
  const { href, dict } = useI18n();
  return (
    <footer className="wrap foot">
      <div className="foot-links">
        <Link href={href("/privacy")}>{dict.nav.privacy}</Link>
        <Link href={href("/terms")}>{dict.nav.terms}</Link>
        <Link href={href("/")}>{dict.nav.home}</Link>
      </div>
      <p>{dict.footer.note}</p>
    </footer>
  );
}

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <>
      <PublicHeader />
      <main id="main">{children}</main>
      <PublicFooter />
    </>
  );
}
