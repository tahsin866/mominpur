"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { CornerFlourish } from "./components";

const info = [
  { k: "নাম", v: "আল-মাদরাসাতুল-ইসলামিয়্যাহ মুমিনপুর" },
  { k: "অবস্থান", v: "মুমিনপুর, ডাকাতিয়া নদীর তীরে" },
  { k: "প্রতিষ্ঠাকাল", v: "১৯৬৪" },
  { k: "প্রতিষ্ঠাতা মুহতামিম", v: "হাফেজ মাওলানা ক্বারী মুহসিন সাহেব রহ. (বড় হুজুর) " },
  { k: "সাবেক মুহতামিম", v: "হাফেজ মাওলানা খালিদ বিন মুহসিন সাহেব রহ." },
  { k: "বর্তমান মুহতামিম", v: " রাশেদ বিন মুহসিন দা.বা." },
];

const eventCounts = [
  { value: "৫০+", label: "অনুষ্ঠান" },
  { value: "১০০০+", label: "অংশগ্রহণকারী" },
  { value: "২০+", label: "বছরের ঐতিহ্য" },
  { value: "১৫+", label: "সাংস্কৃতিক অনুষ্ঠান" },
];

const organizers = [
  // প্রধান উদ্যোক্তা


  // কার্যকরী কমিটির অন্যান্য সদস্য
  // { name: "হাফেজ মাওলানা মুহাম্মাদ রাশেদ বিন মুহসিন", role: "মুহতামিম" },
  //   { name: "মাওলানা ফয়জুল হক", role: "সহ-সচিব" },
  //   { name: "হাফেজ আব্দুল হাকিম", role: "কর্মসম্পাদক" },
  //   { name: "মাওলানা সলেম উদ্দিন", role: "সদস্য" },
  { name: "মুফতি সাঈদ আহমাদ সাহেব", role: "জামিয়াতুল আবরার (রাহমানিয়া)" },
  { name: "হাফেজ মাওলানা আহমাদুল্লাহ সাহেব ", role: "জামিয়াতুল আবরার (রাহমানিয়া)" },
  { name: "মুফতি শামসুল আরেফিন খান সাদী সাহেব", role: "কল‍্যানপুর" },
  { name: "মুফতি শামসুল ইসলাম জীলানি সাহেব", role: "কুমিল্লা" },
  { name: "হাফেজ মাওলানা জাহেদ বিন মুহসিন সাহেব", role: "মুমিনপুর" },
  { name: "হাফেজ মাওলানা আব্দুলাহ আল কারীম সাহেব", role: "উত্তরা" },
  { name: "হাফেজ মাওলানা শরীফ আহমাদ সাহেব (নাতী পিরজী হুজুর রহ.)", role: "পুরান ঢাকা" },
  { name: "হাফেজ মাওলানা নোমান বিন মুহিব‍্বুল্লাহ সাহেব", role: "তালতলা" },
  { name: "হাফেজ শোয়াইব সাহেব(ওসাকা)", role: "মোহাম্মদপুর" },
  { name: "মোহাম্মদ আসাদুল্লাহ (মোহাম্মাদিয়া লাইব্রেরি )", role: "পুরান ঢাকা" },
  { name: "হাফেজ হুজাইফা", role: "মিরপুর" },
  { name: "হাফেজ আব্দুলাহ", role: "টংগি" },

  {
    name: "খোরশেদ আলম",
    role: "উত্তরা",
    phone: "+880 1727-728792"
  },

  // সহকারী প্রধান উদ্যোক্তা
  {
    name: "মোঃ মিফতাহ উদ্দিন",
    role: "মিরপুর",
    phone: "+880 1775-900779"
  },
  {
    name: "মোঃ শাহেদ আহম্মেদ ",
    role: "সিলেট",
    phone: "+880 1717-870310"
  },
  {
    name: "মোঃ হুমায়ন খান ",
    role: "সিলেট",
    phone: "+880 1713-811740"
  },




  // {
  // name: "মোঃ তালহা  ",
  // role: "গৌরিপুর",
  // phone: "+880 1670-185211"
  // }, 
  {
    name: "মোঃ আবির ",
    role: "সিলেট",
    phone: "+880 1710-904042"
  },


  {
    name: "মোঃ ইয়ামিন তালুকদার",
    role: " মুমিনপুর",
    phone: "+880 1737-876660"
  },



  {
    name: "শোয়াইব আহম্মেদ ",
    role: "সিলেট",
    phone: "+44 7979 647913"
  },

  {
    name: "মোঃ মাসুম  ",
    role: "নোয়াখালী",
    phone: "+88019 3529 6040"
  },
  {
    name: "ওমায়ের ",
    role: "নোয়াখালি",
    phone: "+880 1848-001670"
  },
  // { name: "মাওলানা ওমায়ের", role: "নোয়াখালী" },
  // { name: "হাফেজ মাওলানা মিফতাহ উদ্দিন", role: "মিরপুর" },
  // { name: "খোরশেদ আলম", role: "উত্তরা" }
];

interface GalleryPhoto {
  id: number;
  filename: string;
  originalFilename: string;
}

// গ্লোবাল ফন্ট কনফিগারেশন
const BANGLA_FONT = "'SolaimanLipi', sans-serif";
const NUMBER_FONT = "Inter, system-ui, -apple-system, sans-serif";

export default function AboutSection() {
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
            হাফেজ মাওলানা ক্বারী মুহসিন (রহ.) ১৯০৪ খ্রিস্টাব্দে শাহ হাবিবুল্লাহ (রহ.)-এর ঘরে জন্মগ্রহণ করেন। শৈশবেই কুরআনের হিফজ সম্পন্ন করে উচ্চশিক্ষার জন্য তিনি দারুল উলুম দেওবন্দে গমন করেন।
          </p>
          <p className="px-6">
            পরবর্তীকালে হযরত আল্লামা শাব্বীর আহমদ উসমানী (রহ.) ও হযরত হুসাইন আহমদ মাদানী (রহ.) তাঁর কুরআনের খেদমতে অসামান্য অবদান রাখার বিষয়ে সুসংবাদ ও দোয়া প্রদান করেন। এই প্রেরণা নিয়ে তিনি মোস্তফাগঞ্জে দীর্ঘ ১৭ বছর কুরআন শিক্ষা ও কিরাআতের খেদমত করেন। পরবর্তীতে ১৯৬৪ সালে তিনি মুমিনপুর মাদ্রাসা প্রতিষ্ঠা করেন। অতঃপর এই মহীয়সী ব্যক্তিত্ব (বড় হুজুর) আমৃত্যু কুরআন শিক্ষা, হিফজ পরিচালনা ও যোগ্য হাফেজ-কারি গড়ে তোলার মহান কাজে নিজেকে আত্মনিয়োগ করেন।
          </p>
          <p className="px-6">
            তাঁর ইন্তেকালের পর জ্যেষ্ঠ পুত্র হাফেজ মাওলানা খালেদ মুহসিন (রহ.) প্রতিষ্ঠানের দায়িত্ব গ্রহণ করেন এবং তাঁর অক্লান্ত মেহনতের বদৌলতে মাদ্রাসার ব্যাপক উন্নতি সাধিত হয়। পরবর্তীতে বার্ধক্যজনিত কারণে ইন্তেকালের কয়েক বছর পূর্বেই তিনি দায়িত্ব থেকে অবসর গ্রহণ করলে, তাঁর ছোট ভাই  রাশেদ বিন মুহসিন (দা.বা.) প্রতিষ্ঠানের দায়িত্বভার গ্রহণ করেন। বর্তমানে তাঁরই সুযোগ্য নেতৃত্বে মাদ্রাসার শিক্ষা কার্যক্রম ও দ্বীনি খেদমতের ধারাবাহিকতা সফলভাবে অব্যাহত রয়েছে।
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

      {/* বিশেষ ঘোষণা স্মরণিকা */}
      <div className="mb-16">
        <div className="relative p-8 md:p-10 rounded-sm overflow-hidden" style={{ backgroundColor: "#0A3D2A", border: "2px solid #064E3B" }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>
          <div className="relative z-10 text-center">
            <span className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-widest uppercase rounded-sm bg-white/20 text-white">
              বিশেষ ঘোষণা
            </span>
            <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">
              ১৬ ডিসেম্বরের পুনর্মিলনী উপলক্ষে ঐতিহাসিক স্মরণিকা প্রকাশ
            </h3>
            <div className="max-w-3xl mx-auto space-y-4 text-base md:text-lg text-emerald-100 leading-relaxed text-justify">
              <p>
                ১৬ ডিসেম্বরের পুনর্মিলনী উপলক্ষে মুমিনপুর মাদ্রাসার একটি ঐতিহাসিক স্মরণিকা প্রকাশের উদ্যোগ নেওয়া হয়েছে।
              </p>
              <p>
                তাই বড় হুজুর (রহ.) ও মাদরাসা সংক্রান্ত নির্ভরযোগ্য যেকোন তথ্য পাঠিয়ে আপনিও এই উদ্যোগের অংশীদার হোন।
              </p>
              <p className="pt-4 border-t border-white/20">
                <span className="font-bold text-white">তথ্য পাঠানোর জন্য যোগাযোগ করুন:</span><br />
                <a href="https://wa.me/8801848001670" className="inline-flex items-center gap-2 mt-2 px-5 py-2.5 bg-white text-[#0A3D2A] font-bold rounded-sm hover:bg-emerald-50 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  01848001670 (Whatsapp মোঃ ওমায়ের)
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
            আয়োজক ও অনুষ্ঠান কার্যকরী কমিটি
          </h2>
          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-emerald-800/20"></span>
        </div>

        {/* সকল আয়োজক ও কমিটি */}
        <div className="relative h-full flex">
          <CornerFlourish className="absolute -top-3 -left-3 w-8 h-8 text-[#0A3D2A]" />
          <CornerFlourish className="absolute -bottom-3 -right-3 w-8 h-8 rotate-180 text-[#0A3D2A]" />
          <div className="p-8 w-full rounded-sm flex flex-col justify-between" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(10,61,42,0.15)", boxShadow: "0 4px 20px rgba(10,61,42,0.03)" }}>
            <ul className="space-y-4 text-sm md:text-base flex-1 flex flex-col justify-center">
              {organizers
                .map((org, i, arr) => (
                  <li key={`${org.name}-${org.role}`} className={`flex justify-between items-start gap-4 pb-3 ${i !== arr.length - 1 ? "border-b border-gray-100" : ""}`}>
                    <span className="font-bold shrink-0" style={{ color: "#064E3B" }}>{org.name}</span>
                    <span className="font-medium shrink-0 text-right flex flex-col items-end" style={{ color: "#6B7280" }}>
                      <span>{org.role}</span>
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
            ডিজাইন ও কারিগরি সহযোগিতা
          </h2>
          <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-emerald-800/20"></span>
        </div>

        <div className="relative h-full flex">
          <CornerFlourish className="absolute -top-3 -left-3 w-8 h-8 text-[#0A3D2A]" />
          <CornerFlourish className="absolute -bottom-3 -right-3 w-8 h-8 rotate-180 text-[#0A3D2A]" />
          <div className="p-8 w-full rounded-sm flex flex-col justify-between" style={{ backgroundColor: "#FFFFFF", border: "1px solid rgba(10,61,42,0.15)", boxShadow: "0 4px 20px rgba(10,61,42,0.03)" }}>
            <div className="text-sm md:text-base flex-1 flex flex-col justify-center">
              <ul className="space-y-4">
                <li className="flex justify-between items-start gap-4 pb-3 border-b border-gray-100">
                  <span className="font-bold shrink-0" style={{ color: "#064E3B" }}>তাহসিন আব্দুল্লাহ</span>
                  <span className="text-center" style={{ color: "#6B7280" }}>সফটওয়্যার ডেভেলপার, বেফাকুল মাদারিসিল আরাবিয়া বাংলাদেশ</span>
                  <span className="font-medium shrink-0" style={{ color: "#064E3B", fontFamily: NUMBER_FONT }}>০১৫৩৩৩৮৬৮৬৬</span>
                </li>
                <li className="flex justify-between items-start gap-4 pb-3 border-b border-gray-100">
                  <span className="font-bold shrink-0" style={{ color: "#064E3B" }}>আব্দুর রহমান আলজামী</span>
                  <span className="text-center" style={{ color: "#6B7280" }}>সফটওয়্যার ডেভেলপার, আল-হাইআতুল উলয়া লিল-জামি'আতিল কওমিয়া বাংলাদেশ</span>
                  <span className="font-medium shrink-0" style={{ color: "#064E3B", fontFamily: NUMBER_FONT }}>০১৯৯১৭৪৫২১৯</span>
                </li>
                <li className="flex justify-between items-start gap-4 pb-3 border-b border-gray-100">
                  <span className="font-bold shrink-0" style={{ color: "#064E3B" }}>আরাফাত ইসলাম</span>
                  <span className="text-center" style={{ color: "#6B7280" }}>সহকারী শিক্ষক (নূরানী), তানজিমুল উম্মাহ প্রি-হিফজ মাদ্রাসা, মিরপুর শাখা</span>
                  <span className="font-medium shrink-0" style={{ color: "#064E3B", fontFamily: NUMBER_FONT }}>০১৩২৭-৩৬৩৯৬১</span>
                </li>
                <li className="flex justify-between items-start gap-4">
                  <span className="font-bold shrink-0" style={{ color: "#064E3B" }}>শুয়াইব</span>
                  <span className="text-center" style={{ color: "#6B7280" }}>আল-হাইআতুল উলয়া লিল-জামি'আতিল কওমিয়া বাংলাদেশ</span>
                  <span className="font-medium shrink-0" style={{ color: "#064E3B", fontFamily: NUMBER_FONT }}>০১৮৩৫৩৯৮৬৫৬</span>
                </li>
              </ul>
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
                className="aspect-square relative overflow-hidden rounded-sm group border transition-all duration-300 hover:shadow-md cursor-pointer"
                style={{ backgroundColor: "#F3F4F6", borderColor: "rgba(10,61,42,0.12)" }}
                onClick={() => setLightbox(photo)}
              >
                <Image
                  src={`/api/photos/file/${photo.filename}`}
                  alt={photo.originalFilename}
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
            কোনো ছবি পাওয়া যায়নি
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
              src={`/photos/${lightbox.filename}`}
              alt={lightbox.originalFilename}
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