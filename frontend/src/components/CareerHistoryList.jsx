export default function CareerHistoryList({ entries, onDelete }) {
  if (entries.length === 0) {
    return <p className="text-sm text-ink-500">No career history recorded yet.</p>;
  }

  return (
    <ul className="space-y-2">
      {entries.map((entry) => (
        <li
          key={entry.id}
          className="flex items-start justify-between rounded-md border border-ink-200 bg-white px-3 py-2"
        >
          <div>
            <p className="text-sm font-medium text-ink-900">{entry.title}</p>
            <p className="text-sm text-ink-500">
              {entry.company} · {entry.startDate || '?'} – {entry.endDate || 'present'}
            </p>
          </div>
          <button
            onClick={() => onDelete(entry)}
            className="shrink-0 text-sm text-ink-400 hover:text-red-600"
          >
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
