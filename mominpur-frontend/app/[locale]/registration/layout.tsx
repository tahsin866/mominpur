import CountdownBanner from "./countdown-banner";

export default function RegistrationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CountdownBanner />
      {children}
    </>
  );
}
