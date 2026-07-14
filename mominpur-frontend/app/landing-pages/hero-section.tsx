"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { StarMark } from "./components";

const API = process.env.NEXT_PUBLIC_API_URL;

const fallbackSlides = [
  { filename: "", alt: "ইত্তেহাদে আবনায়ে মুমিনপুর", caption: "মুমিনপুর কওমী মাদরাসা" },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState(fallbackSlides);

  useEffect(() => {
    fetch(`${API}/api/photos/section/hero`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSlides(
            data.map((p: { filename: string; originalFilename: string }) => ({
              filename: p.filename,
              alt: p.originalFilename,
              caption: p.originalFilename,
            }))
          );
        } else {
          fetch(`${API}/api/photos`)
            .then((r) => r.json())
            .then((all) => {
              if (Array.isArray(all) && all.length > 0) {
                setSlides(
                  all.map((p: { filename: string; originalFilename: string }) => ({
                    filename: p.filename,
                    alt: p.originalFilename,
                    caption: p.originalFilename,
                  }))
                );
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  return (
    <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden">
      {slides.map((slide, i) => (
        <div
          key={`${slide.filename}-${i}`}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          {slide.filename ? (
            <img
              src={`${API}/api/photos/file/${slide.filename}`}
              alt={slide.alt}
              className="w-full h-full object-cover"
              loading={i === 0 ? "eager" : "lazy"}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#132029] to-[#0B1418]" />
          )}
        </div>
      ))}

      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(160deg, rgba(19,32,41,0.85) 0%, rgba(11,20,24,0.7) 55%, rgba(11,20,24,0.9) 100%)" }}
      />

      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #B8924A 1px, transparent 1px)",
          backgroundSize: "26px 26px",
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center" style={{ color: "#F4ECD8" }}>
        <div className="flex items-center justify-center gap-3 mb-5 text-[#B8924A]">
          <span className="h-px w-10 bg-[#B8924A]/50" />
          <span className="text-xs tracking-[0.3em] uppercase" style={{ fontFamily: "var(--font-body)" }}>
            ঐতিহাসিক পুনর্মিলনী ও মিলনমেলা ২০২৬
          </span>
          <span className="h-px w-10 bg-[#B8924A]/50" />
        </div>

        <h1
          className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          ইত্তেহাদে আবনায়ে মুমিনপুর
        </h1>

        <p className="max-w-xl mx-auto mb-8" style={{ color: "#C9BFA6" }}>
          স্মৃতির টানে, চেনা প্রাঙ্গণে... ১৯৬৩ সাল থেকে আজ পর্যন্ত সকল প্রাক্তনের মিলনমেলা
        </p>

        <Link
          href="/registration/reg"
          className="inline-block font-semibold px-9 py-3 rounded-sm shadow-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-[#B8924A] mb-10"
          style={{ backgroundColor: "#7C2D2D", color: "#F4ECD8" }}
        >
          রেজিস্ট্রেশন করুন
        </Link>

        <p className="text-sm mb-4" style={{ color: "#B8924A" }}>
          {slides[current].caption}
        </p>

        {slides.length > 1 && (
          <>
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={prev}
                className="w-10 h-10 rounded-full border flex items-center justify-center transition hover:bg-white/10"
                style={{ borderColor: "rgba(184,146,74,0.5)", color: "#B8924A" }}
                aria-label="আগের ছবি"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={next}
                className="w-10 h-10 rounded-full border flex items-center justify-center transition hover:bg-white/10"
                style={{ borderColor: "rgba(184,146,74,0.5)", color: "#B8924A" }}
                aria-label="পরের ছবি"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="w-2 h-2 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i === current ? "#B8924A" : "rgba(184,146,74,0.3)",
                    transform: i === current ? "scale(1.3)" : "scale(1)",
                  }}
                  aria-label={`ছবি ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm" style={{ color: "#C9BFA6" }}>
          <span className="flex items-center gap-2">
            <StarMark className="w-3 h-3 text-[#B8924A]" />
            ১৬ ডিসেম্বর, ২০২৬
          </span>
          <span className="flex items-center gap-2">
            <StarMark className="w-3 h-3 text-[#B8924A]" />
            মাদরাসা প্রাঙ্গন
          </span>
        </div>
      </div>
    </section>
  );
}
