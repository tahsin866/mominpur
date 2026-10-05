"use client";

import { useState, useEffect } from "react";
import { useLang } from "@/lib/i18n/LanguageProvider";
import { LocalizedText } from "@/lib/i18n/LocalizedText";

const DEADLINE = new Date("2026-10-31T00:00:00+06:00").getTime();

export default function CountdownBanner() {
  const { t, num, locale } = useLang();
  // Bangla page e zero ta Bangla digit dekhay, tai "0" hardcode korle "05" mix hoy.
  const zero = locale === "bn" ? "০" : "0";
  const pad2 = (n: number) => (num(n).length < 2 ? zero + num(n) : num(n));

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    function tick() {
      const diff = DEADLINE - Date.now();
      if (diff <= 0) {
        setExpired(true);
        setTimeLeft(null);
        return;
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (timeLeft === null && !expired) return null;

  const boxes = expired
    ? []
    : [
        { value: num(timeLeft!.days), label: t.registration.countdownDays },
        { value: pad2(timeLeft!.hours), label: t.registration.countdownHours },
        { value: pad2(timeLeft!.minutes), label: t.registration.countdownMinutes },
        { value: pad2(timeLeft!.seconds), label: t.registration.countdownSeconds },
      ];

  return (
    <div
      className="py-4 px-4 text-center"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {expired ? (
        <p className="text-xl font-bold" style={{ color: "#064E3B" }}>
          <LocalizedText text={t.registration.countdownExpired} />
        </p>
      ) : (
        <div className="max-w-md mx-auto">
          <p className="text-lg font-semibold mb-2" style={{ color: "#064E3B" }}>
            <LocalizedText text={t.registration.countdownTitle} />
          </p>
          <div className="grid grid-cols-4 gap-2">
            {boxes.map((b) => (
              <div
                key={b.label}
                className="rounded-lg py-2 px-1"
                style={{ backgroundColor: "#0A3D2A" }}
              >
                <span className="block text-2xl md:text-3xl font-bold text-white">
                  {b.value}
                </span>
                <span className="block text-xs text-emerald-300">
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
