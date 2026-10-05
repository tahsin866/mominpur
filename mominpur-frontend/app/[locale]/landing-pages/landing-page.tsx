"use client";

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

export default function LandingPage() {
  return (
    <div
      className="min-h-screen antialiased"
      style={{ fontFamily: "'SolaimanLipi', sans-serif", backgroundColor: "#FFFFFF", color: "#064E3B" }}
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
