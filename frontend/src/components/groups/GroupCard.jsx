import { Link } from 'react-router-dom';

export default function GroupCard({ group }) {
  return (
    <Link
      to={`/groups/${group.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-gray-300"
    >
      <p className="font-medium text-gray-900">{group.name}</p>
      {group.description && <p className="mt-1 text-sm text-gray-500">{group.description}</p>}
      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-400">
        {group.contactCount} {group.contactCount === 1 ? 'contact' : 'contacts'}
      </p>
    </Link>
  );
}
