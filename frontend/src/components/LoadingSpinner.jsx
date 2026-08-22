export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center gap-2 text-ink-500 py-8 justify-center" role="status">
      <span className="h-4 w-4 rounded-full border-2 border-ink-300 border-t-amber-500 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
