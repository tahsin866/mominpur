"use client";

export const inputClass =
  "w-full text-sm px-3 py-2.5 border border-zinc-200 rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors";

export const labelClass = "block text-xs font-semibold text-zinc-500 dark:text-zinc-400 mb-1.5";

export const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];

export const DEPARTMENTS = ["নাজেরা", "হিফজ", "কিতাব"];

export const OCCUPATIONS = [
  "শিক্ষক", "ব্যবসায়ী", "চিকিৎসক", "ইঞ্জিনিয়ার", "আইনজীবী",
  "কৃষক", "সরকারি চাকুরি", "বেসরকারি চাকুরি", "অবসরপ্রাপ্ত", "অন্যান্য",
];

export const START_YEAR = 1963;
export const CURRENT_YEAR = 2026;
export const YEARS = Array.from(
  { length: CURRENT_YEAR - START_YEAR + 1 },
  (_, i) => String(CURRENT_YEAR - i)
);

export function bn(n: number | string): string {
  const digits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return String(n).replace(/\d/g, (d) => digits[parseInt(d)]);
}

export function formatDate(value?: string | null): string {
  if (!value) return "-";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("bn-BD", { day: "numeric", month: "short", year: "numeric" });
}

export function findYears(from?: string, to?: string): string {
  if (!from && !to) return "-";
  return `${from || "?"} - ${to || "?"}`;
}
