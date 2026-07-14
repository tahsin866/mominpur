import { StarMark } from "./components";

const highlights = [
  { title: "কুরআন তিলাওয়াত", desc: "প্রাক্তন হাফেজদের দ্বারা কুরআন তিলাওয়াত ও মুখস্থকারীদের অংশগ্রহণ" },
  { title: "সহপাঠী মিলন", desc: "প্রাক্তন সহপাঠীদের সাথে স্মৃতি তুলে ধরার সুযোগ" },
  { title: "নসীহত সমবেশ", desc: "দেশ বরেণ্য উলামা-মাশায়েখদের নসীহত ও বক্তৃতা" },
  { title: "স্মৃতি সংরক্ষণ", desc: "পুরোনো ছবি ও স্মৃতির ধারণা, সহপাঠী সমাবেশ" },
  { title: "সাংস্কৃতিক অনুষ্ঠান", desc: "মাহফিলে নাশিদ ও সাংস্কৃতিক অনুষ্ঠানের আয়োজন" },
  { title: "সম্মাননা", desc: "প্রাক্তন শিক্ষক ও শিক্ষার্থীদের সম্মাননা প্রদান" },
];

export default function HighlightsSection() {
  return (
    <section className="border-y" style={{ backgroundColor: "#EDE1C4", borderColor: "rgba(184,146,74,0.3)" }}>
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "#B8924A" }}>
            অনুষ্ঠানসূচি
          </p>
          <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
            অনুষ্ঠানের বৈশিষ্ট্য
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-12">
          {highlights.map((h) => (
            <div
              key={h.title}
              className="flex gap-4 py-5 border-b"
              style={{ borderColor: "rgba(184,146,74,0.25)" }}
            >
              <StarMark className="w-3.5 h-3.5 mt-1.5 shrink-0 text-[#7C2D2D]" />
              <div>
                <h3 className="font-bold mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  {h.title}
                </h3>
                <p className="text-sm" style={{ color: "#5C5544" }}>
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
