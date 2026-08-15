/* Brand mark + wordmark. The mark mirrors app/icon.svg (the favicon). */

export function LogoMark({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden
      className="shrink-0"
    >
      <rect width="64" height="64" rx="14" fill="#b3402a" />
      <line
        x1="39"
        y1="23"
        x2="52"
        y2="10"
        stroke="#f6efe1"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="52" cy="10" r="3.5" fill="#f6efe1" />
      <rect x="9" y="23" width="46" height="31" rx="7" fill="#f6efe1" />
      <circle cx="24" cy="38.5" r="8.5" fill="#b3402a" />
      <circle cx="24" cy="38.5" r="3.5" fill="#f6efe1" />
      <rect x="38" y="31" width="12" height="5" rx="2.5" fill="#2a2118" />
      <rect x="38" y="41" width="12" height="5" rx="2.5" fill="#e08b2d" />
    </svg>
  );
}

export function Logo({ size = 22 }: { size?: number }) {
  return (
    <span className="flex items-center gap-2">
      <LogoMark size={size} />
      <span className="font-semibold tracking-tight">rediyo</span>
    </span>
  );
}
