import Navbar from "../landing-pages/navbar";

export default function StatusLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
