import { StarMark } from "./components";

const highlights = [
  { title: "কুরআন তিলাওয়াত", desc: "প্রাক্তন হাফেজদের দ্বারা কুরআন তিলাওয়াত ও মুখস্থকারীদের অংশগ্রহণ" },
  { title: "সহপাঠী সমাবেশ", desc: "প্রাক্তন সহপাঠীদের সাথে স্মৃতি তুলে ধরার সুযোগ" },
  { title: "নসীহত ও বক্তৃতা", desc: "দেশ বরেণ্য উলামা-মাশায়েখদের নসীহত ও বক্তৃতা" },
  { title: "স্মৃতি সংরক্ষণ", desc: "পুরোনো ছবি ও স্মৃতির ধারণা, সহপাঠী সমাবেশ" },
  { title: "সম্মাননা", desc: "প্রাক্তন শিক্ষক ও শিক্ষার্থীদের সম্মাননা প্রদান" },
];

// গ্লোবাল ফন্ট কনফিগারেশন
const BANGLA_FONT = "'Hind Siliguri', 'SolaimanLipi', 'Aneuro', sans-serif";
const NUMBER_FONT = "Inter, system-ui, -apple-system, sans-serif";

export default function HighlightsSection() {
  return (
    <section 
      className="border-y select-none" 
      style={{ 
        backgroundColor: "#FFFFFF", 
        borderColor: "rgba(10,61,42,0.12)",
        fontFamily: BANGLA_FONT 
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-24">
        
        {/* হেড সেকশন */}
        <div className="text-center mb-16">
          <p className="text-xs md:text-sm tracking-[0.3em] uppercase mb-3 font-semibold" style={{ color: "#0A3D2A" }}>
            অনুষ্ঠানসূচি
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-6 tracking-tight" style={{ color: "#064E3B" }}>
            অনুষ্ঠানের বৈশিষ্ট্য
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3v18.75h18V5.25H3v15.75Z" />
              </svg>
              <span style={{ fontFamily: NUMBER_FONT }}>১৬ ই ডিসেম্বর, ২০২৬</span>
            </span>
            <span className="hidden sm:inline opacity-30" style={{ color: "#0A3D2A" }}>|</span>
            <span className="flex items-center gap-2.5" style={{ color: "#064E3B" }}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 text-[#0A3D2A] shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              <span style={{ fontFamily: NUMBER_FONT }}>সকাল ৯:০০ টা - দুপুর ২:০০ টা</span>
            </span>
          </div>
        </div>

        {/* বৈশিষ্ট্য গ্রিড - নিট ও ক্লিন বর্ডার লেআউট */}
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-2 items-start">
          {highlights.map((h, index) => (
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
                  {h.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}