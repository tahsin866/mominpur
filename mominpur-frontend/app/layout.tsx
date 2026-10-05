import type { Metadata } from "next";
import "./globals.css";

// NOTE: Public page er title/description ar `lang` [locale] layout theke ase
// (nesting-e nested value overriding kore). Ekhane shudhu /dashboard er jonno.
//
// ETTO `headers()`/`cookies()` KORTE HOBE NA. Root layout e kono dynamic API
// call korle puro app dynamic hoye jay — /dashboard gulo `○` static theke
// `ƒ` dynamic hoye jay. Tai `lang` hardcoded "bn" (dashboard Bangla, tai thik).
export const metadata: Metadata = {
  title: "আল-মাদরাসাতুল-ইসলামিয়্যাহ মুমিনপুর",
  description: "আল-মাদরাসাতুল-ইসলামিয়্যাহ মুমিনপুর",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className="h-full antialiased">
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