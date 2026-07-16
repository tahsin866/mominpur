import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "মুমিনপুর সম্পর্কে", href: "#about" },
  { label: "আবেদন স্ট্যাটাস চেক", href: "/status" },
  { label: "ভেরিফাই", href: "/verify" },
  { label: "যোগাযোগ", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

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
            href="/"
            className="font-bold text-sm md:text-base tracking-tight leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <div className="text-lg md:text-xl font-extrabold text-emerald-900 dark:text-white">আল-মাদরাসাতুল-ইসলামিয়্যাহ মুমিনপুর</div>
            <div className="text-xs font-normal text-gray-500 dark:text-gray-400">পোঃ শাহ্তলী, উপজেলাঃ চাঁদপুর সদর, জেলাঃ চাঁদপুর, বাংলাদেশ</div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm transition-colors hover:text-emerald-700 dark:hover:text-emerald-400 text-gray-700 dark:text-gray-200"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/registration/reg"
              className="text-sm font-semibold px-5 py-2 rounded-sm transition duration-200 hover:bg-[#064e3b]"
              style={{ backgroundColor: "#065F46", color: "#FFFFFF" }}
            >
              রেজিস্ট্রেশন
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="মেনু খুলুন"
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
        </div>

        {open && (
          <nav
            className="md:hidden flex flex-col gap-1 pb-5 border-t pt-3 dark:border-gray-700"
          >
            <div className="mb-2 pb-2 border-b dark:border-gray-700">
              <div className="text-lg font-extrabold text-emerald-900 dark:text-white">আল-মাদরাসাতুল-ইসলামিয়্যাহ মুমিনপুর</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">পোঃ শাহ্তলী, উপজেলাঃ চাঁদপুর সদর, জেলাঃ চাঁদপুর, বাংলাদেশ</div>
            </div>
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm py-2.5 text-gray-700 dark:text-gray-200"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/registration/reg"
              onClick={() => setOpen(false)}
              className="text-sm font-semibold text-center px-5 py-2.5 rounded-sm mt-2"
              style={{ backgroundColor: "#065F46", color: "#FFFFFF" }}
            >
              রেজিস্ট্রেশন
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}