"use client";

import Link from "next/link";
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
        <div className="flex items-center justify-between h-16">
          <Link
            href={href("/")}
            className="font-bold text-sm md:text-base tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <div className="text-lg md:text-xl font-extrabold text-emerald-900 dark:text-white">
              {t.nav.brandName}
            </div>
            <div className="text-xs font-normal text-gray-500 dark:text-gray-400">
              {t.nav.brandAddress}
            </div>
          </Link>

          {/* Right side — toggle sobcheye rightmost e thake */}
          <div className="flex items-center gap-3">
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

            <LanguageToggle />
          </div>
        </div>

        {open && (
          <nav className="md:hidden flex flex-col gap-1 pb-5 border-t pt-3 dark:border-gray-700">
            <div className="mb-2 pb-2 border-b dark:border-gray-700">
              <div className="text-lg font-extrabold text-emerald-900 dark:text-white">
                {t.nav.brandName}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t.nav.brandAddress}
              </div>
            </div>
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
          </nav>
        )}
      </div>
    </header>
  );
}