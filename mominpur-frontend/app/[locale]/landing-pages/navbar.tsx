"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { LanguageToggle } from "../components/LanguageToggle";

export function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const { t, href } = useLang();

  const navLinks = [
    { label: t.nav.about, href: "/#about" },
    { label: t.nav.checkStatus, href: "/status" },
    { label: t.nav.contact, href: "/#contact" },
  ];

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur bg-white/95 dark:bg-gray-900/95"
      style={{
        borderColor: "rgba(6,78,59,0.15)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* Mobile e brand + hamburger ek line-e thake — logo/name choto o
            truncate kora jate double line na hoy. EN/BN toggle mobile e
            dropdown menu-r bhitore thake, top row khali rakhe. */}
        <div className="flex items-center justify-between gap-2 py-2.5 md:py-0 md:h-16">
          <Link
            href={href("/")}
            className="flex items-center gap-2 md:gap-3 min-w-0 flex-1 md:flex-initial font-bold text-sm md:text-base tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <Image
              src="/muminpur-logo-v2.png"
              alt=""
              aria-hidden="true"
              width={40}
              height={40}
              className="h-9 w-9 md:h-12 md:w-12 shrink-0 rounded-sm object-contain"
              priority
            />
            <span className="min-w-0">
              <span className="block text-sm md:text-xl font-extrabold text-emerald-900 dark:text-white truncate">
                {t.nav.brandName}
              </span>
              <span className="block text-[11px] md:text-xs font-normal text-gray-500 dark:text-gray-400 truncate">
                {t.nav.brandAddress}
              </span>
            </span>
          </Link>

          {/* Right side — toggle sobcheye rightmost e thake */}
          <div className="flex items-center gap-3 shrink-0">
            <nav className="hidden md:flex items-center gap-5">
              {navLinks.map((l) => (
                <a
                  key={l.label}
                  href={href(l.href)}
                  className="text-sm transition-colors hover:text-emerald-700 dark:hover:text-emerald-400 text-gray-700 dark:text-gray-200"
                >
                  {l.label}
                </a>
              ))}
              <Link
                href={href("/registration/reg")}
                className="text-sm font-semibold px-5 py-2 rounded-sm transition duration-200 hover:bg-[#064e3b]"
                style={{ backgroundColor: "#065F46", color: "#FFFFFF" }}
              >
                {t.nav.registration}
              </Link>
            </nav>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
              aria-expanded={open}
              className="md:hidden p-2 -mr-2 text-emerald-800 dark:text-emerald-300"
            >
              {open ? (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              )}
            </button>

            <div className="hidden md:block">
              <LanguageToggle />
            </div>
          </div>
        </div>

        {open && (
          <nav className="md:hidden flex flex-col gap-1 pb-5 border-t pt-3 dark:border-gray-700">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={href(l.href)}
                onClick={() => setOpen(false)}
                className="text-sm py-2.5 text-gray-700 dark:text-gray-200"
              >
                {l.label}
              </a>
            ))}
            <Link
              href={href("/registration/reg")}
              onClick={() => setOpen(false)}
              className="text-sm font-semibold text-center px-5 py-2.5 rounded-sm mt-2"
              style={{ backgroundColor: "#065F46", color: "#FFFFFF" }}
            >
              {t.nav.registration}
            </Link>

            <div className="mt-3 pt-3 border-t flex justify-center dark:border-gray-700">
              <LanguageToggle />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}