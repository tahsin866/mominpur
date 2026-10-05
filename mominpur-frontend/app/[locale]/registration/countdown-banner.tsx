"use client";

import { useState, useEffect } from "react";

const DEADLINE = new Date("2026-10-31T00:00:00+06:00").getTime();

const bn = (n: number) =>
  String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

const pad = (n: number) => (n < 10 ? "0" + n : String(n));

export default function CountdownBanner() {
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
        { value: bn(timeLeft!.days), label: "দিন" },
        { value: bn(Number(pad(timeLeft!.hours))), label: "ঘণ্টা" },
        { value: bn(Number(pad(timeLeft!.minutes))), label: "মিনিট" },
        { value: bn(Number(pad(timeLeft!.seconds))), label: "সেকেন্ড" },
      ];

  return (
    <div
      className="py-4 px-4 text-center"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {expired ? (
        <p className="text-xl font-bold" style={{ color: "#064E3B" }}>
          রেজিস্ট্রেশন সময় শেষ
        </p>
      ) : (
        <div className="max-w-md mx-auto">
          <p className="text-lg font-semibold mb-2" style={{ color: "#064E3B" }}>
            রেজিস্ট্রেশন শেষ হতে বাকি
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
