import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { label: "মুমিনপুর সম্পর্কে", href: "#about" },
  { label: "আবেদন স্ট্যাটাস চেক", href: "/status" },
  { label: "যোগাযোগ", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur"
      style={{
        backgroundColor: "rgba(11,20,24,0.92)",
        borderColor: "rgba(184,146,74,0.3)",
      }}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="font-bold text-base md:text-lg tracking-tight"
            style={{ fontFamily: "var(--font-display)", color: "#F4ECD8" }}
          >
            ইত্তেহাদে আবনায়ে মুমিনপুর
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm transition-colors hover:text-[#B8924A]"
                style={{ color: "#C9BFA6" }}
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/registration/reg"
              className="text-sm font-semibold px-5 py-2 rounded-sm transition duration-200"
              style={{ backgroundColor: "#7C2D2D", color: "#F4ECD8" }}
            >
              রেজিস্ট্রেশন
            </Link>
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="মেনু খুলুন"
            aria-expanded={open}
            className="md:hidden p-2 -mr-2"
            style={{ color: "#F4ECD8" }}
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
            className="md:hidden flex flex-col gap-1 pb-5 border-t pt-3"
            style={{ borderColor: "rgba(184,146,74,0.2)" }}
          >
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-sm py-2.5"
                style={{ color: "#C9BFA6" }}
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/registration/reg"
              onClick={() => setOpen(false)}
              className="text-sm font-semibold text-center px-5 py-2.5 rounded-sm mt-2"
              style={{ backgroundColor: "#7C2D2D", color: "#F4ECD8" }}
            >
              রেজিস্ট্রেশন
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
