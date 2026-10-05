import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";
import { defaultLocale, isLocale } from "@/lib/i18n/config";

// NOTE: Public page er title/description locale-anusar bodlay [locale] layout er
// generateMetadata theke ase (nesting-e nested value overriding kore). Ekhane
// shudhu admin/dashboard er jonno fallback.
export const metadata: Metadata = {
  title: "আল-মাদরাসাতুল-ইসলামিয়্যাহ মুমিনপুর",
  description: "Admin Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // proxy.ts ei header-ta set kore (public URL e locale prefix theke).
  // Admin page e header thake na -> default.
  const headerList = await headers();
  const headerLocale = headerList.get("x-locale") ?? "";
  const lang = isLocale(headerLocale) ? headerLocale : defaultLocale;

  return (
    <html lang={lang} className="h-full antialiased">
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