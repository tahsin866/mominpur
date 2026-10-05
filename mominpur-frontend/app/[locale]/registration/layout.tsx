import Navbar from "../landing-pages/navbar";
import CountdownBanner from "./countdown-banner";

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <CountdownBanner />
      {children}
    </>
  );
}
