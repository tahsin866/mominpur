"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { StarMark } from "./components";

const API = "";

const fallbackSlides: { filename: string; alt: string; caption?: string }[] = [
  { filename: "", alt: "ইত্তেহাদে আবনায়ে মুমিনপুর" },
];

// বাংলা লেখার জন্য প্রিমিয়াম ফন্ট ফ্যামিলি
const FONT_FAMILY = "'Hind Siliguri', 'SolaimanLipi', 'Aneuro', sans-serif";
// সংখ্যার নিখুঁত ভিজ্যুয়াল ক্ল্যারিটির জন্য স্ট্যান্ডার্ড ফন্ট স্ট্যাক
const NUMBER_FONT_FAMILY = "Inter, system-ui, -apple-system, sans-serif";

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState(fallbackSlides);

  useEffect(() => {
    fetch(`${API}/api/photos/section/hero`)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load hero photos");
        const contentType = r.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response format");
        }
        return r.json();
      })
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
            .then((r) => {
              if (!r.ok) throw new Error("Failed to load photos");
              const contentType = r.headers.get("content-type");
              if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Invalid response format");
              }
              return r.json();
            })
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
    <section className="relative w-full h-[90vh] min-h-[650px] overflow-hidden bg-[#FFFFFF]">
      {/* ইমেজের ব্যাকগ্রাউন্ড স্লাইডার */}
      {slides.map((slide, i) => (
        <div
          key={`${slide.filename}-${i}`}
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          {slide.filename ? (
            <Image
              src={`${API}/api/photos/file/${slide.filename}`}
              alt={slide.alt}
              fill
              className="object-cover transform scale-105 transition-transform duration-[4000ms] ease-out"
              loading={i === 0 ? "eager" : "lazy"}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#F0FDF4] via-[#FFFFFF] to-[#E6F4EA]" />
          )}
        </div>
      ))}

      {/* সফ্ট গ্লাস ওভারলে ও থিম কালার গ্রেডিয়েন্ট */}
      <div
        className="absolute inset-0 z-0"
        style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(240,253,244,0.82) 60%, rgba(255,255,255,0.96) 100%)" }}
      />

      {/* মিনিমাল ডট ম্যাট্রিক্স প্রফেশনাল টেক্সচার */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, #0A3D2A 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* মূল কন্টেন্ট কন্টেইনার */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-5xl mx-auto px-4 text-center">
        
        {/* সাব-হেডিং এনভায়রনমেন্ট */}
        <div className="flex items-center justify-center gap-3 mb-6" style={{ color: "#0A3D2A" }}>
          <span className="h-[1px] w-12 bg-emerald-800/30" />
          <span 
            className="text-sm md:text-base font-semibold tracking-[0.25em] uppercase" 
            style={{ fontFamily: FONT_FAMILY, color: "#0A3D2A" }}
          >
            ঐতিহাসিক পুনর্মিলনী ও স্মৃতিচারণ <span style={{ fontFamily: NUMBER_FONT_FAMILY }}>২০২৬</span>
          </span>
          <span className="h-[1px] w-12 bg-emerald-800/30" />
        </div>

        {/* মেইন লার্জ ও টাইটেল টেক্সট */}
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 drop-shadow-[0_2px_10px_rgba(255,255,255,0.8)] leading-[1.2]"
          style={{ fontFamily: FONT_FAMILY, color: "#0A3D2A" }}
        >
          ইত্তেহাদে আবনায়ে মুমিনপুর
        </h1>

        {/* ডেসক্রিপশন টেক্সট - সংখ্যাগুলোকে আলাদা স্প্যানে নিয়ে ফন্ট ফিক্স করা হয়েছে */}
        <p 
          className="max-w-2xl mx-auto text-base md:text-xl mb-10 font-medium leading-relaxed" 
          style={{ fontFamily: FONT_FAMILY, color: "#064E3B" }}
        >
          স্মৃতির টানে, চেনা প্রাঙ্গণে... <span style={{ fontFamily: NUMBER_FONT_FAMILY }}>১৯৬৪</span> সাল থেকে <span style={{ fontFamily: NUMBER_FONT_FAMILY }}>২০২৬</span> সকল প্রাক্তনের স্মৃতিচারণ ও পুনর্মিলনী।
        </p>

        {/* রেজিস্ট্রেশন কল-টু-অ্যাকশন বাটন */}
        <div className="mb-12">
          <Link
            href="/registration/reg"
            className="inline-block font-bold text-base md:text-lg px-10 py-4 rounded-sm shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[#0A3D2A]"
            style={{ fontFamily: FONT_FAMILY, backgroundColor: "#0A3D2A", color: "#FFFFFF" }}
          >
            রেজিস্ট্রেশন করুন
          </Link>
        </div>

        {/* ইনফরমেশন কার্ড প্যানেল (তারিখ ও স্থান) */}
        <div 
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-8 py-3.5 rounded-sm backdrop-blur-sm border transition-all duration-300 shadow-sm"
          style={{ 
            backgroundColor: "rgba(255, 255, 255, 0.75)", 
            borderColor: "rgba(10,61,42,0.15)",
          }}
        >
          <span className="flex items-center gap-2.5 text-base md:text-lg font-bold" style={{ fontFamily: FONT_FAMILY, color: "#064E3B" }}>
            <StarMark className="w-3.5 h-4 text-emerald-800 shrink-0" />
            <span style={{ fontFamily: NUMBER_FONT_FAMILY }}>১৬</span> ডিসেম্বর, <span style={{ fontFamily: NUMBER_FONT_FAMILY }}>২০২৬</span>
          </span>
          <span className="hidden sm:inline text-emerald-800/30">|</span>
          <span className="flex items-center gap-2.5 text-base md:text-lg font-bold" style={{ fontFamily: FONT_FAMILY, color: "#064E3B" }}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-emerald-800">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
            মাদরাসা প্রাঙ্গন
          </span>
        </div>



        {/* স্লাইডার নেভিগেশন কন্ট্রোলসমূহ */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                className="w-9 h-9 rounded-full border flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:bg-[#0A3D2A] hover:text-white"
                style={{ borderColor: "rgba(10,61,42,0.25)", color: "#0A3D2A" }}
                aria-label="আগের ছবি"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={next}
                className="w-9 h-9 rounded-full border flex items-center justify-center backdrop-blur-sm transition-all duration-200 hover:bg-[#0A3D2A] hover:text-white"
                style={{ borderColor: "rgba(10,61,42,0.25)", color: "#0A3D2A" }}
                aria-label="পরের ছবি"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* স্লাইডার ডটস */}
            <div className="flex items-center gap-2">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: i === current ? "#0A3D2A" : "rgba(10,61,42,0.2)",
                    transform: i === current ? "scale(1.4)" : "scale(1)",
                  }}
                  aria-label={`ছবি ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}