const stats = [
  { value: "১৯৬৩", label: "প্রতিষ্ঠা সাল" },
  { value: "৬০+", label: "বছরের ঐতিহ্য" },
  { value: "১০০০+", label: "প্রাক্তন শিক্ষার্থী" },
  { value: "১", label: "ঐতিহ্যবাহী মাদরাসা" },
];

export default function StatsSection() {
  return (
    <section className="border-b" style={{ backgroundColor: "#EDE1C4", borderColor: "rgba(184,146,74,0.3)" }}>
      <div className="max-w-4xl mx-auto px-4 py-8 flex flex-wrap justify-center">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`px-8 py-2 text-center ${i !== 0 ? "border-l" : ""}`}
            style={{ borderColor: "rgba(184,146,74,0.35)" }}
          >
            <p className="text-2xl font-bold" style={{ fontFamily: "var(--font-display)", color: "#7C2D2D" }}>
              {s.value}
            </p>
            <p className="text-xs mt-1 tracking-wide" style={{ color: "#5C5544" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
