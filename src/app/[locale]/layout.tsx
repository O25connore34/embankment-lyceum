import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Fira_Sans, Spectral } from "next/font/google";
import { dictionaries } from "@/i18n";
import { isLocale } from "@/i18n";
import { Providers } from "@/components/providers";

const spectral = Spectral({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const fira = Fira_Sans({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500", "600"],
  variable: "--font-ui",
  display: "swap",
});

export function generateStaticParams() {
  return [{ locale: "ru" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "ru";
  const dict = dictionaries[locale];
  return {
    title: dict.meta.title,
    description: dict.meta.description,
    metadataBase: new URL("http://localhost:3000"),
    openGraph: {
      title: dict.meta.title,
      description: dict.meta.description,
      images: [{ url: "/images/og-campus.png", width: 1600, height: 900 }],
    },
    icons: { icon: "/favicon.svg" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "ru";
  return (
    <html lang={locale} className={`${spectral.variable} ${fira.variable}`}>
      <body style={{ fontFamily: "var(--font-ui), sans-serif" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
