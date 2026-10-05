/**
 * Bangla bodh-lekhar number (০-৯, U+09E6-U+09EF) ar English digit duto alada
 * font-e chinte hoy. Eta render korar jonno ekta font jode hoy — body font
 * (SolaimanLipi) e to English digit khub k核准 dekhay na, Bangla bodh-lekhar
 * o gurutto purno dekhay na.
 *
 * Protita sentence e ja-i number thakuk (tarikha, phone, gout), eo text theke
 * number gulo chule componentsengulo nite parbe. Number na thakle kono
 * wrapper resn hoy na, tai banano component-e use kora nirdokkho.
 */
const LATIN_FONT = "'Inter', system-ui, -apple-system, sans-serif";

// ASCII digit (0-9) ar Bangla bodh-lekhar (০-৯) duto-i dhora.
const DIGIT_RUN = /([0-9০-৯]+)/;

export function isDigitRun(part: string): boolean {
  return /^[0-9০-৯]+$/.test(part);
}

export function LocalizedText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts = text.split(DIGIT_RUN);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} style={{ fontFamily: LATIN_FONT }}>
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
}