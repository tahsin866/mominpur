import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/bn";
import bn from "./dictionaries/bn";
import en from "./dictionaries/en";

const dictionaries: Record<Locale, Dictionary> = { bn, en };

export default function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };