export function CornerFlourish({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path d="M2 46V22C2 10.954 10.954 2 22 2H46" stroke="currentColor" strokeWidth="1" />
      <path d="M10 46V30C10 18.954 18.954 10 30 10H46" stroke="currentColor" strokeWidth="1" opacity="0.55" />
      <circle cx="2" cy="46" r="2" fill="currentColor" />
    </svg>
  );
}

export function OrnateFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <CornerFlourish className="absolute -top-2 -left-2 w-9 h-9 text-[#B8924A]" />
      <CornerFlourish className="absolute -top-2 -right-2 w-9 h-9 text-[#B8924A] rotate-90" />
      <CornerFlourish className="absolute -bottom-2 -left-2 w-9 h-9 text-[#B8924A] -rotate-90" />
      <CornerFlourish className="absolute -bottom-2 -right-2 w-9 h-9 text-[#B8924A] rotate-180" />
      {children}
    </div>
  );
}

export function RiverDivider({ tone = "gold" }: { tone?: "gold" | "ink" }) {
  const stroke = tone === "gold" ? "#B8924A" : "#16232C";
  return (
    <svg viewBox="0 0 1200 48" preserveAspectRatio="none" className="w-full h-8" aria-hidden="true">
      <path
        d="M0 24 C 150 -2, 300 50, 450 24 S 750 -2, 900 24 S 1150 50, 1200 24"
        stroke={stroke}
        strokeWidth="1"
        fill="none"
        opacity="0.5"
      />
    </svg>
  );
}

export function StarMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
    </svg>
  );
}
