"use client";

import Link from "next/link";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { LocalizedText } from "@/lib/i18n/LocalizedText";

// গ্লোবাল ফন্ট কনফিগারেশন
const BANGLA_FONT = "'SolaimanLipi', sans-serif";

export default function Footer() {
  const { t, href } = useLang();

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
              <LocalizedText text={t.footer.title} />
            </h3>
            <p className="text-lg leading-relaxed text-gray-400">
              <LocalizedText text={t.footer.memory} />
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-base md:text-lg" style={{ color: "#E6F4EA" }}>
              <LocalizedText text={t.footer.importantLinks} />
            </h3>
            <ul className="space-y-2 text-lg">
              <li>
                <Link
                  href={href("/registration/reg")}
                  className="hover:text-[#4ADE80] transition-colors duration-200"
                  style={{ color: "#58D385" }}
                >
                  <LocalizedText text={t.nav.registration} />
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-3 text-base md:text-lg" style={{ color: "#E6F4EA" }}>
              <LocalizedText text={t.footer.contactTitle} />
            </h3>
            <p className="text-lg leading-relaxed text-gray-400">
              <LocalizedText text={t.footer.contactBody} />
            </p>
          </div>
        </div>

        {/* বটম সেকশন: কপিরাইট */}
        <div className="pt-8 border-t text-center text-lg md:text-lg" style={{ borderColor: "rgba(10,61,42,0.15)" }}>
          <div className="text-gray-400 font-medium">
            <LocalizedText text={t.footer.copyright} />
          </div>
        </div>
      </div>
    </footer>
  );
}