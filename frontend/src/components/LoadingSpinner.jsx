export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div className="flex items-center gap-2 text-gray-500 py-8 justify-center" role="status">
      <span className="h-4 w-4 rounded-full border-2 border-gray-300 border-t-blue-600 animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}
