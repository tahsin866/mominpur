import { NextResponse, type NextRequest } from "next/server";
import {
  LOCALE_COOKIE,
  defaultLocale,
  isLocale,
  isPublicPath,
  localizePathname,
  type Locale,
} from "./lib/i18n/config";

/**
 * Browser er `Accept-Language` theke English kichu pai ki na dekhay.
 * Jemon UK/America theke ese English dekhay -> /en, noyto /bn.
 */
function preferredLocale(request: NextRequest): Locale {
  const header = request.headers.get("accept-language") || "";
  // "en-GB,en;q=0.9,bn;q=0.8" -> ["en-GB", "en", "bn"]
  const tags = header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.find((p) => p.trim().startsWith("q="));
      return { tag: tag.toLowerCase(), q: q ? Number(q.split("=")[1]) || 0 : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of tags) {
    const base = tag.split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}

function detectLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  if (saved && isLocale(saved)) return saved;
  return preferredLocale(request);
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const [, first = ""] = pathname.split("/");

  // URL e already locale thakle ("/en/status"): eitai asol path — tai
  // public na ki na check korar dorkar nai. Header diye pass korbo.
  if (isLocale(first)) {
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-locale", first);
    const response = NextResponse.next({ request: { headers: requestHeaders } });
    response.cookies.set(LOCALE_COOKIE, first, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
      sameSite: "lax",
    });
    return response;
  }

  // Admin, API, static file — egulor kono locale chay na.
  if (!isPublicPath(pathname)) return NextResponse.next();

  // Locale nai -> detect kore prefix diye redirect ("/" o ekhane dhora).
  const locale = detectLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = localizePathname(pathname, locale);
  return NextResponse.redirect(url);
}

export const config = {
  // Locale-ni URL ar admin chara shob kichu matcher theke bade.
  matcher: [
    "/((?!_next/|api/|dashboard|.*\\.[\\w]+$).*)",
  ],
};