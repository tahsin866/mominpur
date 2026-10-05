export const locales = ["bn", "en"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "bn";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Eshudhu public page gulor prefix. Eigulor age locale boste hobe
 * (/bn/status, /en/status). Admin ar API er prefix ENA dhore badha —
 * oigulo chhoto hoye jay na.
 */
export const PUBLIC_PREFIXES = [
  "/registration",
  "/status",
  "/verify",
  "/login",
  "/auth",
] as const;

/** Admin/API/static — egulo locale prefix pabe na. */
export function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

export const LOCALE_COOKIE = "locale";

/**
 * "/status" -> "/bn/status"
 * "/en/status" -> "/en/status" (age locale thakle chhali)
 */
export function localizePathname(pathname: string, locale: Locale): string {
  const [, first = ""] = pathname.split("/");
  if (isLocale(first)) {
    const rest = pathname.slice(first.length + 1) || "/";
    return `/${locale}${rest === "/" ? "" : rest}`;
  }
  return pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
}

/** "/en/registration/reg" -> "/bn/registration/reg" */
export function switchLocaleInPath(pathname: string, locale: Locale): string {
  return localizePathname(pathname, locale);
}