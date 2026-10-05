import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LanguageProvider } from "@/lib/i18n/LanguageProvider";
import getDictionary from "@/lib/i18n/get-dictionary";
import { isLocale, locales } from "@/lib/i18n/config";
import { LandingNavbar } from "./landing-pages/navbar";

/**
 * SEO: /en e English title+description, /bn e Bangla. Google dono language
 * alada alada URL e alada alada text dekhabe — tai keywords duita jaygay
 * poriborton hobe na.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    title: t.meta.title,
    description: t.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: { bn: "/bn", en: "/en" },
    },
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      locale: locale === "bn" ? "bn_BD" : "en_GB",
    },
  };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // "/xx/something" -> 404. Tarpor na to homepage-e dhuke "xx" dhakhay na.
  if (!isLocale(locale)) notFound();

  return (
    <LanguageProvider locale={locale} dictionary={getDictionary(locale)}>
      <LandingNavbar />
            {children}
    </LanguageProvider>
  );
}