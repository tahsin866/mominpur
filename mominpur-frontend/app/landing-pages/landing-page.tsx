"use client";

import { Noto_Serif_Bengali, Hind_Siliguri } from "next/font/google";
import Navbar from "./navbar";
import HeroSection from "./hero-section";
import StatsSection from "./stats-section";
import AboutSection from "./about-section";
import HighlightsSection from "./highlights-section";
import CtaSection from "./cta-section";
import Footer from "./footer";
import DawatnamaModal from "./dawatnama-modal";
import { RiverDivider } from "./components";

const display = Noto_Serif_Bengali({
  subsets: ["bengali"],
  weight: ["600", "700", "800"],
  variable: "--font-display",
});

const body = Hind_Siliguri({
  subsets: ["bengali"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export default function LandingPage() {
  return (
    <div
      className={`${display.variable} ${body.variable} min-h-screen antialiased`}
      style={{ fontFamily: "var(--font-body)", backgroundColor: "#F4ECD8", color: "#2A2620" }}
    >
      <DawatnamaModal />
      <Navbar />
      <HeroSection />

      <div style={{ backgroundColor: "#0B1418" }}>
        <RiverDivider tone="gold" />
      </div>

      <StatsSection />
      <AboutSection />

      <RiverDivider tone="gold" />

      <HighlightsSection />
      <CtaSection />
      <Footer />
    </div>
  );
}
