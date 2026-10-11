// Signature brand element: a faint career-map pattern (nodes + pathways) used as a
// backdrop, never as decoration that competes with content — see brand spec §15.
export default function CareerMapBackdrop() {
  return (
    <svg
      viewBox="0 0 1200 800"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <g stroke="#111827" strokeOpacity="0.08" strokeWidth="1.5" fill="none">
        <path d="M120 620 L340 520 L560 560 L760 420 L980 460 L1120 340" />
        <path d="M340 520 L420 340" />
        <path d="M560 560 L640 700" />
        <path d="M760 420 L860 260" />
        <path d="M980 460 L1080 600" />
      </g>
      <g fill="#3B82F6" fillOpacity="0.35">
        <circle cx="120" cy="620" r="4" />
        <circle cx="560" cy="560" r="4" />
        <circle cx="980" cy="460" r="4" />
      </g>
      <g fill="#14B8A6" fillOpacity="0.35">
        <circle cx="340" cy="520" r="4" />
        <circle cx="760" cy="420" r="4" />
        <circle cx="1120" cy="340" r="4" />
        <circle cx="420" cy="340" r="3" />
        <circle cx="640" cy="700" r="3" />
        <circle cx="860" cy="260" r="3" />
        <circle cx="1080" cy="600" r="3" />
      </g>
    </svg>
  );
}
