"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function DawatnamaModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const seen = sessionStorage.getItem("dawatnama_seen");
    if (!seen) {
      const timer = setTimeout(() => setOpen(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const close = () => {
    setOpen(false);
    sessionStorage.setItem("dawatnama_seen", "1");
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
      onClick={close}
    >
      {/* Close button */}
      <button
        onClick={close}
        className="absolute top-4 right-4 z-[110] w-10 h-10 rounded-full flex items-center justify-center transition hover:bg-white/20"
        style={{ color: "#F4ECD8" }}
        aria-label="বন্ধ করুন"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
        </svg>
      </button>

      {/* Modal content - full width image */}
      <div
        className="relative w-full max-w-4xl h-[85vh] rounded-sm overflow-hidden cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src="/dawatnama.jpeg"
          alt="দাওয়াতনামা - ইত্তেহাদে আবনায়ে মুমিনপুর"
          fill
          sizes="90vw"
          className="object-contain"
          priority
        />
      </div>

      {/* Close hint */}
      <p
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs"
        style={{ color: "rgba(201,191,166,0.6)" }}
      >
        যেকোনো জায়গায় ক্লিক করে বন্ধ করুন
      </p>
    </div>
  );
}
