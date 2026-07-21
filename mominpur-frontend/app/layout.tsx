import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "আল-মাদরাসাতুল-ইসলামিয়্যাহ মুমিনপুরে",
  description: "তাহসিন ও জামি",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.cdnfonts.com/css/solaimanlipi"
        />
        <link
          rel="stylesheet"
          href="https://fonts.cdnfonts.com/css/hind-siliguri"
        />
        <link
          rel="stylesheet"
          href="https://fonts.cdnfonts.com/css/noto-serif-bengali"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
