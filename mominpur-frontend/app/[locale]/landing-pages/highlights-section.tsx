"use client";

import { StarMark } from "./components";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { LocalizedText } from "@/lib/i18n/LocalizedText";

export default function HighlightsSection() {
  const { t, fonts } = useLang();
  return (
    <section 
      className="border-y select-none" 
      style={{ 
        backgroundColor: "#FFFFFF", 
        borderColor: "rgba(10,61,42,0.12)",
        fontFamily: fonts.body 
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-24">
        
        {/* হেড সেকশন */}
        <div className="text-center mb-16">
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase mb-3 font-semibold" style={{ color: "#0A3D2A" }}>
            <LocalizedText text={t.highlights.eyebrow} />
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight" style={{ color: "#064E3B" }}>
            <LocalizedText text={t.highlights.title} />
          </h2>
          
          {/* মার্জিত সময় ও স্থান নির্দেশক বার (Rounded-sm ও প্রিমিয়াম শ্যাডো) */}
          <div 
            className="inline-flex flex-wrap items-center justify-center gap-x-8 gap-y-3 px-8 py-3.5 rounded-sm text-sm md:text-base font-semibold transition-all duration-300" 
            style={{ 
              backgroundColor: "rgba(10,61,42,0.04)", 
              border: "1px solid rgba(10,61,42,0.1)",
              boxShadow: "0 2px 8px rgba(10,61,42,0.02)"
            }}
          >
            <span className="flex items-center gap-2.5" style={{ color: "#064E3B" }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-[#0A3D2A] shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
              <LocalizedText text={t.highlights.eventDate} />
            </span>
            <span className="hidden sm:inline opacity-30" style={{ color: "#0A3D2A" }}>|</span>
            <span className="flex items-center gap-2.5" style={{ color: "#064E3B" }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-[#0A3D2A] shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <LocalizedText text={t.highlights.eventTime} />
            </span>
          </div>
        </div>

        {/* বৈশিষ্ট্য গ্রিড - নিট ও ক্লিন বর্ডার লেআউট */}
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-2 items-start">
          {t.highlights.items.map((h, index) => (
            <div
              key={h.title}
              className="flex gap-4 py-6 border-b transition-colors duration-300 hover:bg-emerald-50/10 group"
              style={{ borderColor: "rgba(10,61,42,0.08)" }}
            >
              <div className="mt-1 shrink-0">
                <StarMark className="w-4 h-4 text-[#0A3D2A] transition-transform duration-300 group-hover:scale-110" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-bold text-base md:text-lg tracking-tight" style={{ color: "#064E3B" }}>
                  {h.title}
                </h3>
                <p className="text-sm md:text-base leading-relaxed" style={{ color: "#6B7280" }}>
                  <LocalizedText text={h.desc} />
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}