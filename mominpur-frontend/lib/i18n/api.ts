import type { Locale } from "./config";

/**
 * Backend er message gulo locale-aware korte `Accept-Language` pathate hoy.
 * Backend ekhon Bangla plain text pathay; eita add korar por oi gulo
 * `Accept-Language` value anushare English/Bangla message return korte hobe.
 *
 * Bangla text ke Bangla-r bhabe pathale double encode hoy, tai value-ta
 * direct diye patha jay (browser encode kore dey).
 */
export function apiHeaders(locale: Locale): Record<string, string> {
  return locale === "bn" ? { "Accept-Language": "bn" } : { "Accept-Language": "en" };
}
