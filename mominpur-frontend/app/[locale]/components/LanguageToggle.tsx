"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { switchLocaleInPath, type Locale } from "@/lib/i18n/config";

const OPTIONS: { code: Locale; label: string; title: string; font?: string }[] = [
  // English page e body font Inter — sei font-e "বাংলা" bhul dekhay,
  // tai ei ekta label-e Bangla font force kora hoy.
  { code: "bn", label: "বাংলা", title: "বাংলায় দেখুন", font: "'SolaimanLipi', sans-serif" },
  { code: "en", label: "EN", title: "View in English" },
];

export function LanguageToggle() {
  const { locale } = useLang();
  const pathname = usePathname();

  return (
    <div className="inline-flex items-center gap-1 rounded-sm border border-emerald-800/25 p-0.5 text-xs font-semibold">
      <span className="grid place-items-center px-1 text-emerald-800/70" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path strokeLinecap="round" d="M3.6 9h16.8M3.6 15h16.8" />
          <path strokeLinecap="round" d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18z" />
        </svg>
      </span>
      {OPTIONS.map((opt, i) => (
        <Link
          key={opt.code}
          href={switchLocaleInPath(pathname, opt.code)}
          hrefLang={opt.code}
          lang={opt.code}
          title={opt.title}
          aria-current={opt.code === locale ? "true" : undefined}
          style={opt.font ? { fontFamily: opt.font } : undefined}
          className={[
            "px-2 py-1 transition-colors",
            i > 0 ? "border-l border-emerald-800/25" : "",
            opt.code === locale
              ? "bg-emerald-800 text-white"
              : "text-gray-600 hover:bg-emerald-50 hover:text-emerald-900",
          ].join(" ")}
        >
          {opt.label}
        </Link>
      ))}
    </div>
  );
}
