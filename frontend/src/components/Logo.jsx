// Brand mark: one starting point branching into multiple career possibilities.
export default function Logo({ className = 'h-6 w-6', markClassName = 'text-blue-600' }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M5 16H14M14 16L25 7M14 16L25 25"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className={markClassName}
      />
      <circle cx="5" cy="16" r="3" fill="currentColor" className={markClassName} />
      <circle cx="14" cy="16" r="2.5" fill="currentColor" className={markClassName} />
      <circle cx="25" cy="7" r="2.5" fill="currentColor" className="text-teal-500" />
      <circle cx="25" cy="25" r="2.5" fill="currentColor" className="text-teal-500" />
    </svg>
  );
}
