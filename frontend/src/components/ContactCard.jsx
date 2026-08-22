import { Link } from 'react-router-dom';

export default function ContactCard({ contact, onDelete }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-ink-200 bg-white px-4 py-3 hover:border-ink-300">
      <Link to={`/contacts/${contact.id}`} className="min-w-0 flex-1">
        <p className="font-medium text-ink-900">
          {contact.firstName} {contact.lastName}
        </p>
        <p className="truncate text-sm text-ink-500">
          {contact.currentTitle || 'No title'}
          {contact.currentCompany ? ` · ${contact.currentCompany}` : ''}
        </p>
      </Link>
      <button
        onClick={() => onDelete(contact)}
        className="ml-4 shrink-0 text-sm text-ink-400 hover:text-red-600"
      >
        Delete
      </button>
    </div>
  );
}
