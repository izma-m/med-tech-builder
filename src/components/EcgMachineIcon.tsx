const EcgMachineIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 160 120" className={className} fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
    {/* console body */}
    <rect x="14" y="14" width="132" height="78" rx="4" fill="hsl(var(--card))" />
    {/* screen */}
    <rect x="22" y="22" width="96" height="58" rx="2" fill="hsl(var(--accent))" />
    {/* ECG trace */}
    <polyline
      points="26,58 40,58 44,54 48,62 52,32 56,76 60,52 64,58 78,58 82,54 86,62 90,40 94,72 98,52 102,58 116,58"
      stroke="hsl(var(--primary))"
      strokeWidth={1.3}
    />
    {/* side controls panel */}
    <rect x="124" y="22" width="16" height="58" rx="1.5" fill="hsl(var(--muted))" />
    <circle cx="132" cy="32" r="2.5" fill="hsl(var(--primary))" />
    <circle cx="132" cy="42" r="2" />
    <circle cx="132" cy="52" r="2" />
    <line x1="127" y1="62" x2="137" y2="62" />
    <line x1="127" y1="68" x2="137" y2="68" />
    <line x1="127" y1="74" x2="137" y2="74" />
    {/* cart base + wheels */}
    <line x1="20" y1="92" x2="140" y2="92" />
    <line x1="34" y1="92" x2="34" y2="104" />
    <line x1="126" y1="92" x2="126" y2="104" />
    <circle cx="34" cy="108" r="4" fill="hsl(var(--card))" />
    <circle cx="126" cy="108" r="4" fill="hsl(var(--card))" />
    {/* cable to electrode */}
    <path d="M14 50 Q 4 60 8 80" />
    <circle cx="8" cy="84" r="3" fill="hsl(var(--primary))" />
  </svg>
);

export default EcgMachineIcon;
