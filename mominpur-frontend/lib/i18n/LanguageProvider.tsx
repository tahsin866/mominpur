"use client";

import { createContext, useContext, useMemo } from "react";
import type { Locale } from "./config";
import { localizePathname } from "./config";
import type { Dictionary } from "./dictionaries/bn";

interface LanguageValue {
  locale: Locale;
  t: Dictionary;
  /**
   * Locale-aware link. `href("/status")` -> "/bn/status" ba "/en/status".
   * Component e hardcoded "/status" likhle English e broken link hobe —
   * tai sheshesh sob public link ei function diye banate hobe.
   */
  href: (path: string) => string;
  /** Locale-aware number, jemon "1,234" ba "১,২৩৪" */
  num: (value: number) => string;
  /**
   * Dictionary template e placeholder replace. E.g.
   * fmt(t.status.guestRemaining, { n: 2 }) -> "আরো ২ জন..." / "You can add 2 more..."
   * Number thakle nije theke locale digit e convert hoy.
   */
  fmt: (template: string, values: Record<string, string | number>) => string;
  /**
   * Locale-aware font stack. English e SolaimanLipi (Bangla font) e text
   * pothomoto dekhay na — tai English e alada Latin font lagbe.
   */
  fonts: { display: string; body: string; number: string };
}

const FONT_STACKS: Record<Locale, LanguageValue["fonts"]> = {
  // Bangla body-font-e Bangla ligature gulo thik moto dekhay.
  bn: {
    display: "'SolaimanLipi', sans-serif",
    body: "'SolaimanLipi', sans-serif",
    number: "Inter, system-ui, -apple-system, sans-serif",
  },
  // English e serif heading + sans body — international pad'er standard.
  en: {
    display: "Georgia, 'Times New Roman', serif",
    body: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif",
    number: "Inter, system-ui, -apple-system, sans-serif",
  },
};

const LanguageContext = createContext<LanguageValue | null>(null);

export function LanguageProvider({
  locale,
  dictionary,
  children,
}: {
  locale: Locale;
  dictionary: Dictionary;
  children: React.ReactNode;
}) {
  const value = useMemo<LanguageValue>(
    () => ({
      locale,
      t: dictionary,
      href: (path: string) => localizePathname(path, locale),
      num: (n: number) => new Intl.NumberFormat(locale).format(n),
      fmt: (template, values) =>
        template.replace(/\{(\w+)\}/g, (whole, key: string) => {
          if (!(key in values)) return whole;
          const v = values[key];
          return typeof v === "number"
            ? new Intl.NumberFormat(locale).format(v)
            : v;
        }),
      fonts: FONT_STACKS[locale],
    }),
    [locale, dictionary]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLang(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error(
      "useLang() ke root layout er LanguageProvider er bithore call korte hobe"
    );
  }
  return ctx;
}