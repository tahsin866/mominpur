"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { CornerFlourish } from "./components";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { LocalizedText } from "@/lib/i18n/LocalizedText";

// NOTE: `eventCounts` kotha-i render hoy na (StatsSection commented out).
// Dead data — dictionary te nai. Wapas use korar dorkar hole add korte hobe.
const eventCounts = [
  { value: "৫০+", label: "অনুষ্ঠান" },
  { value: "১০০০+", label: "অংশগ্রহণকারী" },
  { value: "২০+", label: "বছরের ঐতিহ্য" },
  { value: "১৫+", label: "সাংস্কৃতিক অনুষ্ঠান" },
];

/* info/organizers → t.about.* (dictionary) */

interface GalleryPhoto {
  id: number;
  filePath: string;
}

export default function AboutSection() {
  const { t, fonts } = useLang();
  const BANGLA_FONT = fonts.body;
  const NUMBER_FONT = fonts.number;
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState<GalleryPhoto | null>(null);

  const closeLightbox = useCallback(() => setLightbox(null), []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
    };
    if (lightbox) {
      document.addEventListener("keydown", handleKey);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, closeLightbox]);

  useEffect(() => {
    fetch("/api/photos/section/gallery")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load gallery");
        return r.json();
      })
      .then((data: GalleryPhoto[]) => {
        if (Array.isArray(data)) {
          setGallery(data);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section id="about" className="max-w-6xl mx-auto px-4 py-24 select-none" style={{ fontFamily: BANGLA_FONT }}>

      {/* সেকশন হেডার */}
      <div className="text-center mb-20 relative">
        <p className="text-xs md:text-sm tracking-[0.3em] uppercase mb-3 font-semibold" style={{ color: "#0A3D2A" }}>
          <LocalizedText text={t.about.eyebrow} />
        </p>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight" style={{ color: "#0A3D2A" }}>
          <LocalizedText text={t.about.title} />
        </h2>
        <div className="w-24 h-1 mx-auto mt-5 rounded-full" style={{ backgroundColor: "#0A3D2A" }} />
      </div>

      {/* মাদরাসা পরিচিতি ও তথ্য টেবিল প্যানেল */}
      <div className="grid lg:grid-cols-5 gap-12 items-stretch mb-24">

        {/* টেক্সট এরিয়া */}
        <div className="lg:col-span-3 flex flex-col justify-center space-y-6 text-base md:text-lg leading-relaxed text-justify" style={{ color: "#064E3B" }}>
          <p className="bg-emerald-50/30 p-6 rounded-sm border-l-4 border-[#0A3D2A]">
            <LocalizedText text={t.about.intro[0]} />
          </p>
          <p className="px-6">
            <LocalizedText text={t.about.intro[1]} />
          </p>
          <p className="px-6">
            <LocalizedText text={t.about.intro[2]} />
          </p>
        </div>

        {/* তথ্য কার্ড (Rounded-sm ও CornerFlourish) */}
        <div className="lg:col-span-2 relative h-full flex">
          <CornerFlourish className="absolute -top-3 -left-3 w-8 h-8 text-[#0A3D2A]" />
          <CornerFlourish className="absolute -bottom-3 -right-3 w-8 h-8 rotate-180 text-[#0A3D2A]" />
          <div className="p-8 w-full rounded-sm flex flex-col justify-between" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(10,61,42,0.15)", boxShadow: "0 4px 20px rgba(10,61,42,0.03)" }}>
            <h3 className="font-bold mb-6 text-xl border-b pb-3" style={{ color: "#0A3D2A" }}>
              <LocalizedText text={t.about.factsTitle} />
            </h3>
            <ul className="space-y-4 text-sm md:text-base flex-1 flex flex-col justify-center">
              {t.about.facts.map((item, i) => (
                <li
                  key={item.k}
                  className={`flex justify-between items-start gap-4 pb-3 ${i !== t.about.facts.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <span className="font-medium min-w-0 break-words" style={{ color: "#6B7280" }}>
                    <LocalizedText text={item.k} />
                  </span>
                  <span className="font-bold text-right" style={{ color: "#064E3B" }}>
                    <LocalizedText text={item.v} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* বিশেষ ঘোষণা স্মরণিকা */}
      <div className="mb-16">
        <div className="relative p-8 md:p-10 rounded-sm overflow-hidden" style={{ backgroundColor: "#0A3D2A", border: "2px solid #064E3B" }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>
          <div className="relative z-10 text-center">
            <span className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-widest uppercase rounded-sm bg-white/20 text-white">
              <LocalizedText text={t.about.announcement.badge} />
            </span>
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">
              <LocalizedText text={t.about.announcement.title} />
            </h3>
            <div className="max-w-3xl mx-auto space-y-4 text-base md:text-lg text-emerald-100 leading-relaxed text-justify">
              <p>
                <LocalizedText text={t.about.announcement.line1} />
              </p>
              <p>
                <LocalizedText text={t.about.announcement.line2} />
              </p>
              <p className="pt-4 border-t border-white/20">
                <span className="font-bold text-white"><LocalizedText text={t.about.announcement.contactLabel} /></span><br />
                <a href="https://wa.me/8801848001670" className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-white text-[#0A3D2A] font-bold rounded-sm hover:bg-emerald-50 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <LocalizedText text={t.about.announcement.whatsapp} />
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* আয়োজক ও কার্যকরী কমিটি সেকশন */}
      <div className="mb-24">

        {/* সেকশন সাব-টাইটেল */}
        <div className="flex items-center gap-4 mb-14">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-emerald-800/20"></span>
          <h2 className="text-2xl md:text-3xl font-bold px-6 text-center" style={{ color: "#0A3D2A" }}>
            <LocalizedText text={t.about.committeeTitle} />
          </h2>
          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-emerald-800/20"></span>
        </div>

        {/* সকল আয়োজক ও কমিটি */}
        <div className="relative h-full flex">
          <CornerFlourish className="absolute -top-3 -left-3 w-8 h-8 text-[#0A3D2A]" />
          <CornerFlourish className="absolute -bottom-3 -right-3 w-8 h-8 rotate-180 text-[#0A3D2A]" />
          <div className="p-8 w-full rounded-sm flex flex-col justify-between" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(10,61,42,0.15)", boxShadow: "0 4px 20px rgba(10,61,42,0.03)" }}>
            <ul className="space-y-4 text-sm md:text-base flex-1 flex flex-col justify-center">
              {t.about.organizers
                .map((org, i, arr) => (
                  <li key={`${org.name}-${org.role}`} className={`flex justify-between items-start gap-4 pb-3 ${i !== arr.length - 1 ? "border-b border-gray-100" : ""}`}>
                    <span className="font-bold min-w-0 break-words" style={{ color: "#064E3B" }}>
                      <LocalizedText text={org.name} />
                    </span>
                    <span className="font-medium min-w-0 text-right flex flex-col items-end break-words" style={{ color: "#6B7280" }}>
                      <span><LocalizedText text={org.role} /></span>
                      {org.phone && (
                        <span className="text-xs mt-0.5 font-semibold text-gray-500" style={{ fontFamily: NUMBER_FONT }}>{org.phone}</span>
                      )}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ডিজাইন ও ডেভেলপমেন্ট সেকশন */}
      <div className="mb-24">
        <div className="flex items-center gap-4 mb-10">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-emerald-800/20"></span>
          <h2 className="text-2xl md:text-3xl font-bold px-6 text-center" style={{ color: "#0A3D2A" }}>
            <LocalizedText text={t.about.techTitle} />
          </h2>
          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-emerald-800/20"></span>
        </div>

        <div className="relative h-full flex">
          <CornerFlourish className="absolute -top-3 -left-3 w-8 h-8 text-[#0A3D2A]" />
          <CornerFlourish className="absolute -bottom-3 -right-3 w-8 h-8 rotate-180 text-[#0A3D2A]" />
          <div className="p-8 w-full rounded-sm flex flex-col justify-between" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(10,61,42,0.15)", boxShadow: "0 4px 20px rgba(10,61,42,0.03)" }}>
            <div className="text-sm md:text-base flex-1 flex flex-col justify-center">
              <ul className="space-y-4">
                {t.about.contributors.map((c, i, arr) => (
                  <li
                    key={c.name}
                    className={`flex justify-between items-start gap-4 ${i !== arr.length - 1 ? "pb-3 border-b border-gray-100" : ""}`}
                  >
                    <span className="font-bold min-w-0 break-words" style={{ color: "#064E3B" }}>
                      <LocalizedText text={c.name} />
                    </span>
                    <span className="text-center" style={{ color: "#6B7280" }}>
                      <LocalizedText text={c.role} />
                    </span>
                    <span className="font-medium min-w-0 break-words" style={{ color: "#064E3B", fontFamily: NUMBER_FONT }}>
                      {c.phone}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* গ্যালারি সেকশন */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <h3 className="text-sm font-bold px-4 py-1.5 rounded-sm text-white tracking-wider" style={{ backgroundColor: "#0A3D2A" }}>
            <LocalizedText text={t.about.galleryTitle} />
          </h3>
          <span className="h-[1px] flex-1" style={{ backgroundColor: "rgba(10,61,42,0.12)" }}></span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-sm font-medium text-gray-400 animate-pulse">
            <LocalizedText text={t.about.galleryLoading} />
          </div>
        ) : gallery.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {gallery.map((photo, i) => (
              <div
                key={photo.id || i}
                className="aspect-square relative overflow-hidden rounded-sm group border transition-all duration-300 hover:shadow-md cursor-pointer"
                style={{ backgroundColor: "#F3F4F6", borderColor: "rgba(10,61,42,0.12)" }}
                onClick={() => setLightbox(photo)}
              >
                <Image
                  src={`/api/photos/${photo.id}/file`}
                  alt={photo.filePath}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-sm font-medium text-gray-400">
            <LocalizedText text={t.about.galleryEmpty} />
          </div>
        )}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            aria-label={t.about.closeGallery}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div
            className="relative max-w-4xl w-full max-h-[85vh] aspect-[4/3]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={`/api/photos/${lightbox.id}/file`}
              alt={lightbox.filePath}
              fill
              sizes="(max-width: 768px) 100vw, 75vw"
              className="object-contain rounded-sm"
            />
          </div>
        </div>
      )}
    </section>
  );
}