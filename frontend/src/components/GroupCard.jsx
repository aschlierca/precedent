import { Link } from 'react-router-dom';

export default function GroupCard({ group }) {
  return (
    <Link
      to={`/groups/${group.id}`}
      className="block rounded-lg border border-ink-200 bg-white p-4 hover:border-ink-300"
    >
      <p className="font-medium text-ink-900">{group.name}</p>
      {group.description && <p className="mt-1 text-sm text-ink-500">{group.description}</p>}
      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-ink-400">
        {group.contactCount} {group.contactCount === 1 ? 'contact' : 'contacts'}
      </p>
    </Link>
  );
}
