import { dictionaries, isLocale } from "@/i18n";
import { HomePage } from "@/components/home-page";

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale = isLocale(raw) ? raw : "ru";
  return <HomePage locale={locale} dict={dictionaries[locale]} />;
}
