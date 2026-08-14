import Link from "next/link";

// গ্লোবাল ফন্ট কনফিগারেশন
const BANGLA_FONT = "'SolaimanLipi', sans-serif";

export default function Footer() {
  return (
    <footer
      className="border-t select-none"
      style={{
        backgroundColor: "#061A13",
        borderColor: "rgba(10,61,42,0.25)",
        color: "#99AF9E",
        fontFamily: BANGLA_FONT
      }}
    >
      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* মেইন ফুটার কন্টেন্ট */}
        <div className="grid sm:grid-cols-3 gap-10 mb-10">
          <div>
            <h3 className="font-bold mb-3 text-base md:text-lg" style={{ color: "#E6F4EA" }}>
              ইত্তেহাদে আবনায়ে মুমিনপুর
            </h3>
            <p className="text-lg leading-relaxed text-gray-400">
              স্মৃতির টানে, চেনা প্রাঙ্গণে... <span style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>১৯৬৪</span> সাল থেকে <span style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>২০২৫</span> সকল প্রাক্তনের স্মৃতিচারণ ও পুনর্মিলনী।
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-base md:text-lg" style={{ color: "#E6F4EA" }}>
              গুরুত্বপূর্ণ লিংক
            </h3>
            <ul className="space-y-2 text-lg">
              <li>
                <Link
                  href="/registration/reg"
                  className="hover:text-[#4ADE80] transition-colors duration-200"
                  style={{ color: "#58D385" }}
                >
                  রেজিস্ট্রেশন
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-base md:text-lg" style={{ color: "#E6F4EA" }}>
              যোগাযোগ
            </h3>
            <p className="text-lg leading-relaxed text-gray-400">
              <span className="font-semibold" style={{ color: "#E6F4EA" }}>আল-মাদরাসাতুল-ইসলামিয়্যাহ মুমিনপুর</span>
              <br />
              পোঃ শাহ্তলী, উপজেলাঃ চাঁদপুর সদর, জেলাঃ চাঁদপুর, বাংলাদেশ।
            </p>
          </div>
        </div>

        {/* বটম সেকশন: কপিরাইট */}
        <div className="pt-8 border-t text-center text-lg md:text-lg" style={{ borderColor: "rgba(10,61,42,0.15)" }}>
          <div className="text-gray-400 font-medium">
            &copy; ২০২৬ ইত্তেহাদে আবনায়ে মুমিনপুর। সর্বস্বত্ব সংরক্ষিত।
          </div>
        </div>
      </div>
    </footer>
  );
}
