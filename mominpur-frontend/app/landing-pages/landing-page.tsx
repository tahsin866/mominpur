"use client";

import { Noto_Serif_Bengali, Hind_Siliguri } from "next/font/google";
import HeroSection from "./hero-section";
import StatsSection from "./stats-section";
import AboutSection from "./about-section";
import HighlightsSection from "./highlights-section";
// import CtaSection from "./cta-section";
import ContactSection from "./contact-section";
import Footer from "./footer";
import Navbar from "./navbar";
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
      style={{ fontFamily: "var(--font-body)", backgroundColor: "#FFFFFF", color: "#064E3B" }}
    >
      <Navbar />
      <DawatnamaModal />
      <HeroSection />

      <div style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid rgba(10,61,42,0.15)" }}>
        <RiverDivider tone="green" />
      </div>

      {/* <StatsSection /> */}
      <AboutSection />

      <RiverDivider tone="green" />

      <HighlightsSection />
      {/* <CtaSection /> */}
      <ContactSection />
      <Footer />
    </div>
  );
}
