import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" className="border-t" style={{ backgroundColor: "#0B1418", borderColor: "rgba(184,146,74,0.3)", color: "#C9BFA6" }}>
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid sm:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "#F4ECD8" }}>
              ইত্তেহাদে আবনায়ে মুমিনপুর
            </h3>
            <p className="text-sm">
              মুমিনপুর মাদরাসার প্রাক্তন শিক্ষার্থীদের যোগসূত্র ও মিলনমেলার আয়োজনী।
            </p>
          </div>
          <div>
            <h3 className="font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "#F4ECD8" }}>
              গুরুত্বপূর্ণ লিংক
            </h3>
            <ul className="space-y-1 text-sm">
              <li>
                <Link href="/registration/reg" className="hover:underline" style={{ color: "#B8924A" }}>
                  রেজিস্ট্রেশন
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:underline" style={{ color: "#B8924A" }}>
                  লগইন
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2" style={{ fontFamily: "var(--font-display)", color: "#F4ECD8" }}>
              যোগাযোগ
            </h3>
            <p className="text-sm">
              মুমিনপুর, ডাকাতিয়া নদী
              <br />
              বাংলাদেশ
            </p>
          </div>
        </div>
        <div className="pt-6 border-t text-center text-sm" style={{ borderColor: "rgba(184,146,74,0.2)" }}>
          &copy; ২০২৬ ইত্তেহাদে আবনায়ে মুমিনপুর। সর্বস্বত্ব সংরক্ষিত।
        </div>
      </div>
    </footer>
  );
}
