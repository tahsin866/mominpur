import { CornerFlourish } from "./components";

const info = [
  { k: "নাম", v: "মুমিনপুর কওমী মাদরাসা" },
  { k: "অবস্থান", v: "মুমিনপুর, ডাকাতিয়া নদী" },
  { k: "প্রতিষ্ঠাকাল", v: "১৯৬৩" },
  { k: "ধরন", v: "কওমী হিফজ মাদরাসা" },
  { k: "মুহতামিম", v: "হাফেজ মাওলানা মুহাম্মাদ রাশেদ মুহসিন" },
];

export default function AboutSection() {
  return (
    <section id="about" className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <p className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: "#B8924A" }}>
          পরিচিতি
        </p>
        <h2 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: "var(--font-display)" }}>
          মুমিনপুর মাদরাসা সম্পর্কে
        </h2>
      </div>
      <div className="grid md:grid-cols-5 gap-10 items-start">
        <div className="md:col-span-3 space-y-4 leading-relaxed text-justify" style={{ color: "#3A342A" }}>
          <p>
            তিনদিক থেকে ডাকাতিয়া নদী বেষ্টিত দ্বীপসদৃশ মুমিনপুর গ্রামে অবস্থিত মুমিনপুর মাদরাসা একটি ঐতিহ্যবাহী কওমী শিক্ষা প্রতিষ্ঠান।
            হিফজুল কুরআনের কিংবদন্তি পুরুষ হাফেজ মুহসিন সাহেব রহ. ও তাঁর যোগ্য উত্তরসূরীদের দরদমাখা শাসন ও কঠোর তদারকিতে এই মাদরাসা পরিচালিত হয়ে আসছে।
          </p>
          <p>
            শৈশবের শিক্ষা জীবনের স্মৃতিগুলো মুমিনপুর মাদরাসার শিক্ষার্থীদের মন থেকে কখনো মুছে যায় না বলে আমাদের বিশ্বাস।
          </p>
        </div>

        <div className="md:col-span-2 relative">
          <CornerFlourish className="absolute -top-1 -left-1 w-6 h-6 text-[#B8924A]" />
          <CornerFlourish className="absolute -bottom-1 -right-1 w-6 h-6 text-[#B8924A] rotate-180" />
          <div className="p-6" style={{ backgroundColor: "#EDE1C4", border: "1px solid rgba(184,146,74,0.35)" }}>
            <h3 className="font-bold mb-4" style={{ fontFamily: "var(--font-display)" }}>
              মাদরাসার তথ্য
            </h3>
            <ul className="space-y-3 text-sm">
              {info.map((item, i) => (
                <li
                  key={item.k}
                  className={`flex justify-between gap-4 ${i !== info.length - 1 ? "border-b pb-3" : ""}`}
                  style={{ borderColor: "rgba(184,146,74,0.25)" }}
                >
                  <span style={{ color: "#8A7F65" }}>{item.k}</span>
                  <span className="font-medium text-right" style={{ color: "#2A2620" }}>
                    {item.v}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
