"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { CornerFlourish } from "./components";

const info = [
  { k: "নাম", v: "আল-মাদরাসাতুল-ইসলামিয়্যাহ মুমিনপুর" },
  { k: "অবস্থান", v: "মুমিনপুর, ডাকাতিয়া নদীর তীরে" },
  { k: "প্রতিষ্ঠাকাল", v: "১৯৬৩" },
  { k: "প্রতিষ্ঠাতা মুহতামিম", v: "হাফেজ মাওলানা মুহসিন সাহেব রহ. (বড় হুজুর) " },
  { k: "সাবেক মুহতামিম", v: "হাফেজ মাওলানা খালিদ বিন মুহসিন সাহেব রহ." },
  { k: "বর্তমান মুহতামিম", v: "হাফেজ মাওলানা রাশেদ বিন মুহসিন দা.বা." },
];

const eventCounts = [
  { value: "৫০+", label: "অনুষ্ঠান" },
  { value: "১০০০+", label: "অংশগ্রহণকারী" },
  { value: "২০+", label: "বছরের ঐতিহ্য" },
  { value: "১৫+", label: "সাংস্কৃতিক অনুষ্ঠান" },
];

const organizers = [
  // প্রধান উদ্যোক্তা
  { 
    name: "খোরশেদ আলম", 
    role: "প্রধান উদ্যোক্তা", 
    phone: "+880 1727-728792" 
  },
  
  // সহকারী প্রধান উদ্যোক্তা
  { 
    name: "মোঃ মিফতাহ উদ্দিন", 
    role: "সহকারী প্রধান উদ্যোক্তা", 
    phone: "+880 1775-900779" 
  },
  { 
    name: "মোঃ শাহেদ আহম্মেদ (সিলেট)", 
    role: "সহকারী প্রধান উদ্যোক্তা", 
    phone: "+880 1717-870310" 
  },
  { 
    name: "মোঃ হুমায়ন খান (সিলেট)", 
    role: "সহকারী উদ্যোক্তা", 
    phone: "+880 1713-811740" 
  },
  { 
    name: "মোঃ ইয়ামিন তালুকদার (মুমিনপুর)", 
    role: "সহকারী উদ্যোক্তা", 
    phone: "+880 1737-876660" 
  },


  { 
    name: "মোঃ তালহা (গৌরিপুর)", 
    role: "সহকারী  উদ্যোক্তা", 
    phone: "+880 1670-185211" 
  },
  { 
    name: "শোয়াইব আহম্মেদ (সিলেট)", 
    role: "সহকারী  উদ্যোক্তা", 
    phone: "+৪৪৭ 1979-79647913" 
  },
  { 
    name: "ওমায়ের (নোয়াখালি)", 
    role: "সহকারী উদ্যোক্তা", 
    phone: "+880 1848-001670" 
  },

  // কার্যকরী কমিটির অন্যান্য সদস্য
// { name: "হাফেজ মাওলানা মুহাম্মাদ রাশেদ বিন মুহসিন", role: "মুহতামিম" },
//   { name: "মাওলানা ফয়জুল হক", role: "সহ-সচিব" },
//   { name: "হাফেজ আব্দুল হাকিম", role: "কর্মসম্পাদক" },
//   { name: "মাওলানা সলেম উদ্দিন", role: "সদস্য" },
  { name: " মাওলানা মুফতি সাঈদ সাহেব", role: "জামিয়াতুল আবরার (রহমানিয়া)" },
  { name: "মাওলানা আহমদুল্লাহ সাহেব ", role: "জামিয়াতুল আবরার (রহমানিয়া)" },
  { name: " মাওলানা মুফতি শামসুল আরেফিন খান সাদী সাহেব", role: "কল‍্যানপুর" },
  { name: " মাওলানা মুফতি শামসুল ইসলাম জীলানি সাহেব", role: "কুমিল্লা" },
  { name: "হাফেজ মাওলানা জাহেদ বিন মুহসিন সাহেব", role: "মুমিনপুর" },
  { name: "হাফেজ মাওলানা আব্দুলাহ আল কারীম সাহেব", role: "উত্তরা" },
  { name: "হাফেজ মাওলানা শরীফ আহমাদ সাহেব (নাতী পিরজী হুজুর রহ.)", role: "পুরান ঢাকা" },
  { name: "হাফেজ মাওলানা নোমান বিন মুহিব‍্বুল্লাহ সাহেব", role: "তালতলা" },
  { name: "হাফেজ শোয়াইব", role: "মোহাম্মদপুর" },
  { name: "মোহাম্মদ আসাদুল্লাহ ( মোহাম্মাদিয়া লাইব্রেরি )", role: "পুরান ঢাকা" },
  { name: "হাফেজ হুজাইফা", role: "মিরপুর" },
  { name: "হাফেজ আব্দুলাহ", role: "টংগি" },
  { name: "মাওলানা ওমায়ের", role: "নোয়াখালী" },
  { name: "হাফেজ মাওলানা মিফতাহ উদ্দিন", role: "মিরপুর" },
  { name: "খোরশেদ আলম", role: "উত্তরা" }
];

interface GalleryPhoto {
  id: number;
  filename: string;
  originalFilename: string;
}

// গ্লোবাল ফন্ট কনফিগারেশন
const BANGLA_FONT = "'Hind Siliguri', 'SolaimanLipi', 'Aneuro', sans-serif";
const NUMBER_FONT = "Inter, system-ui, -apple-system, sans-serif";

export default function AboutSection() {
  const [gallery, setGallery] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/photos/section/gallery")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load gallery");
        const contentType = r.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid response format");
        }
        return r.json();
      })
      .then((data) => {
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
          পরিচিতি
        </p>
        <h2 className="text-3xl md:text-5xl font-black tracking-tight" style={{ color: "#0A3D2A" }}>
          মুমিনপুর মাদরাসা সম্পর্কে
        </h2>
        <div className="w-24 h-1 mx-auto mt-5 rounded-full" style={{ backgroundColor: "#0A3D2A" }} />
      </div>

      {/* মাদরাসা পরিচিতি ও তথ্য টেবিল প্যানেল */}
      <div className="grid lg:grid-cols-5 gap-12 items-stretch mb-24">
        
        {/* টেক্সট এরিয়া */}
        <div className="lg:col-span-3 flex flex-col justify-center space-y-6 text-base md:text-lg leading-relaxed text-justify" style={{ color: "#064E3B" }}>
          <p className="bg-emerald-50/30 p-6 rounded-sm border-l-4 border-[#0A3D2A]">
            তিনদিক থেকে ডাকাতিয়া নদী বেষ্টিত দ্বীপসদৃশ মুমিনপুর গ্রামে অবস্থিত মুমিনপুর মাদরাসা একটি ঐতিহ্যবাহী কওমী শিক্ষা প্রতিষ্ঠান।
            হিফজুল কুরআনের কিংবদন্তি হাফেজ মাওলানা মুহসিন সাহেব রহ. (বড় হুজুর) ও তাঁর যোগ্য উত্তরসূরীদের দরদমাখা ও কঠোর তদারকিতে এই মাদরাসা পরিচালিত হয়ে আসছে।
          </p>
          <p className="px-6">
            শৈশবের শিক্ষা জীবনের স্মৃতিগুলো মুমিনপুর মাদরাসার শিক্ষার্থীদের মন থেকে কখনো মুছে যায় না বলে আমাদের বিশ্বাস।
          </p>
        </div>

        {/* তথ্য কার্ড (Rounded-sm ও CornerFlourish) */}
        <div className="lg:col-span-2 relative h-full flex">
          <CornerFlourish className="absolute -top-3 -left-3 w-8 h-8 text-[#0A3D2A]" />
          <CornerFlourish className="absolute -bottom-3 -right-3 w-8 h-8 rotate-180 text-[#0A3D2A]" />
          <div className="p-8 w-full rounded-sm flex flex-col justify-between" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(10,61,42,0.15)", boxShadow: "0 4px 20px rgba(10,61,42,0.03)" }}>
            <h3 className="font-bold mb-6 text-xl border-b pb-3" style={{ color: "#0A3D2A" }}>
              মাদরাসার তথ্য
            </h3>
            <ul className="space-y-4 text-sm md:text-base flex-1 flex flex-col justify-center">
              {info.map((item, i) => (
                <li
                  key={item.k}
                  className={`flex justify-between items-start gap-4 pb-3 ${i !== info.length - 1 ? "border-b border-gray-100" : ""}`}
                >
                  <span className="font-medium shrink-0" style={{ color: "#6B7280" }}>{item.k}</span>
                  <span 
                    className="font-bold text-right" 
                    style={{ 
                      color: "#064E3B",
                      fontFamily: item.k === "প্রতিষ্ঠাকাল" ? NUMBER_FONT : BANGLA_FONT 
                    }}
                  >
                    {item.v}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* আয়োজক ও কার্যকরী কমিটি সেকশন */}
      <div className="mb-24">
        
        {/* সেকশন সাব-টাইটেল */}
        <div className="flex items-center gap-4 mb-14">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-emerald-800/20"></span>
          <h2 className="text-2xl md:text-3xl font-bold px-6 text-center" style={{ color: "#0A3D2A" }}>
            আয়োজক ও অনুষ্ঠান কার্যকরী কমিটি
          </h2>
          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-emerald-800/20"></span>
        </div>

        {/* ================= ১. মূল উদ্যোক্তা সেকশন ================= */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h3 className="text-sm font-bold px-4 py-1.5 rounded-sm text-white tracking-wider" style={{ backgroundColor: "#0A3D2A" }}>
              উদ্যোক্তাগণ
            </h3>
            <span className="h-[1px] flex-1" style={{ backgroundColor: "rgba(10,61,42,0.12)" }}></span>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
            {organizers
              .filter(org => org.role.includes("উদ্যোক্তা") || org.role.toLowerCase().includes("organizer") || org.role.toLowerCase().includes("founder"))
              .map((org) => (
                <div
                  key={org.name}
                  className="text-center p-6 rounded-sm transition-all duration-300 flex flex-col justify-between border group hover:shadow-md hover:border-emerald-800/30"
                  style={{ 
                    backgroundColor: "#FFFFFF", 
                    borderColor: "rgba(10,61,42,0.12)",
                  }}
                >
                  <div>
                    <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center relative transition-transform duration-300 group-hover:scale-105" style={{ backgroundColor: "#0A3D2A" }}>
                      <span className="text-xl font-bold text-white">
                        {org.name.charAt(0)}
                      </span>
                      {org.role === "প্রধান উদ্যোক্তা" && (
                        <span className="absolute -top-1 -right-1 text-xs text-white px-1.5 py-0.5 rounded-full font-bold shadow-sm" style={{ backgroundColor: "#D97706" }}>
                          ★
                        </span>
                      )}
                    </div>
                    <h4 className="font-bold mb-1 text-base" style={{ color: "#064E3B" }}>
                      {org.name}
                    </h4>
                    <p className="text-xs font-semibold mb-4 text-[#0A3D2A]/80">
                      {org.role}
                    </p>
                  </div>
                  
                  {org.phone && (
                    <div className="mt-2 pt-3 border-t border-gray-100 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-emerald-800 shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25V16.5a2.25 2.25 0 0 0-2.25-2.25h-1.35c-.48 0-.963-.206-1.3-.53l-2.2-2.2c-.34-.34-.84-.53-1.3-.53H9.75V6.75A2.25 2.25 0 0 0 7.5 4.5H4.5a2.25 2.25 0 0 0-2.25 2.25Z" />
                      </svg>
                      <span style={{ fontFamily: NUMBER_FONT }}>{org.phone}</span>
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* ================= ২. কার্যকরী কমিটি সেকশন ================= */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <h3 className="text-sm font-bold px-4 py-1.5 rounded-sm text-emerald-900 tracking-wider" style={{ backgroundColor: "rgba(10,61,42,0.08)" }}>
              কার্যকারী কমিটি
            </h3>
            <span className="h-[1px] flex-1" style={{ backgroundColor: "rgba(10,61,42,0.12)" }}></span>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {organizers
              .filter(org => !(org.role.includes("উদ্যোক্তা") || org.role.toLowerCase().includes("organizer") || org.role.toLowerCase().includes("founder")))
              .map((org) => (
                <div
                  key={org.name}
                  className="text-center p-6 rounded-sm border transition-all duration-300 hover:shadow-sm"
                  style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(10,61,42,0.12)" }}
                >
                  <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "rgba(10,61,42,0.06)" }}>
                    <span className="text-lg font-bold" style={{ color: "#0A3D2A" }}>
                      {org.name.charAt(0)}
                    </span>
                  </div>
                  <h4 className="font-bold mb-1 text-base" style={{ color: "#064E3B" }}>
                    {org.name}
                  </h4>
                  <p className="text-xs text-gray-500 font-medium">
                    {org.role}
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* ডিজাইন ও ডেভেলপমেন্ট সেকশন */}
      <div className="mb-24">
        <div className="flex items-center gap-4 mb-10">
          <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-emerald-800/20"></span>
          <h2 className="text-2xl md:text-3xl font-bold px-6 text-center" style={{ color: "#0A3D2A" }}>
            ডিজাইন ও কারিগরি সহযোগিতা
          </h2>
          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-emerald-800/20"></span>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* তাহসিন আব্দুল্লাহ */}
          <div
            className="text-center p-6 rounded-sm border transition-all duration-300 hover:shadow-md hover:border-emerald-800/30"
            style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(10,61,42,0.12)" }}
          >
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "#0A3D2A" }}>
              <span className="text-xl font-bold text-white">ত</span>
            </div>
            <h4 className="font-bold mb-1 text-base" style={{ color: "#064E3B" }}>
              তাহসিন আব্দুল্লাহ
            </h4>
            <p className="text-xs font-semibold mb-2" style={{ color: "#0A3D2A" }}>
              সফটওয়্যার ডেভেলপার
            </p>
            <p className="text-xs text-gray-500 mb-4">
              বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ
            </p>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-emerald-800 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25V16.5a2.25 2.25 0 0 0-2.25-2.25h-1.35c-.48 0-.963-.206-1.3-.53l-2.2-2.2c-.34-.34-.84-.53-1.3-.53H9.75V6.75A2.25 2.25 0 0 0 7.5 4.5H4.5a2.25 2.25 0 0 0-2.25 2.25Z" />
              </svg>
              <span style={{ fontFamily: NUMBER_FONT }}>০১৫৩৩৩৮৬৮৬৬</span>
            </div>
          </div>

          {/* আব্দুর রহমান আলজামি */}
          <div
            className="text-center p-6 rounded-sm border transition-all duration-300 hover:shadow-md hover:border-emerald-800/30"
            style={{ backgroundColor: "#FFFFFF", borderColor: "rgba(10,61,42,0.12)" }}
          >
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: "#0A3D2A" }}>
              <span className="text-xl font-bold text-white">আ</span>
            </div>
            <h4 className="font-bold mb-1 text-base" style={{ color: "#064E3B" }}>
              আব্দুর রহমান আলজামি
            </h4>
            <p className="text-xs font-semibold mb-2" style={{ color: "#0A3D2A" }}>
              সফটওয়্যার ডেভেলপার
            </p>
            <p className="text-xs text-gray-500 mb-4">
              আল-হাইআতুল উলয়া লিল-জামি&lsquo;আতিল কওমিয়া বাংলাদেশ
            </p>
            <div className="pt-3 border-t border-gray-100 flex items-center justify-center gap-2 text-sm font-semibold text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-emerald-800 shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25V16.5a2.25 2.25 0 0 0-2.25-2.25h-1.35c-.48 0-.963-.206-1.3-.53l-2.2-2.2c-.34-.34-.84-.53-1.3-.53H9.75V6.75A2.25 2.25 0 0 0 7.5 4.5H4.5a2.25 2.25 0 0 0-2.25 2.25Z" />
              </svg>
              <span style={{ fontFamily: NUMBER_FONT }}>০১৯৯১৭৪৫২১৯</span>
            </div>
          </div>
        </div>
      </div>

      {/* গ্যালারি সেকশন */}
      <div>
        <div className="flex items-center gap-3 mb-8">
          <h3 className="text-sm font-bold px-4 py-1.5 rounded-sm text-white tracking-wider" style={{ backgroundColor: "#0A3D2A" }}>
            ছবির এলবাম
          </h3>
          <span className="h-[1px] flex-1" style={{ backgroundColor: "rgba(10,61,42,0.12)" }}></span>
        </div>

        {loading ? (
          <div className="text-center py-16 text-sm font-medium text-gray-400 animate-pulse">
            গ্যালারি লোড হচ্ছে...
          </div>
        ) : gallery.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {gallery.map((photo, i) => (
              <div
                key={photo.id || i}
                className="aspect-square relative overflow-hidden rounded-sm group border transition-all duration-300 hover:shadow-md"
                style={{ backgroundColor: "#F3F4F6", borderColor: "rgba(10,61,42,0.12)" }}
              >
                <Image
                  src={`/api/photos/file/${photo.filename}`}
                  alt={photo.originalFilename}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-sm font-medium text-gray-400">
            কোনো ছবি পাওয়া যায়নি
          </div>
        )}
      </div>
    </section>
  );
}