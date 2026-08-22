import { useEffect, useState } from 'react';
import Modal from './Modal';
import ErrorBanner from './ErrorBanner';
import LoadingSpinner from './LoadingSpinner';
import useApi from '../hooks/useApi';
import { getErrorMessage } from '../api/errors';

export default function GroupContactPicker({ groupId, memberIds, onClose, onChange }) {
  const request = useApi();
  const [allContacts, setAllContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pendingId, setPendingId] = useState(null);
  const [selected, setSelected] = useState(new Set(memberIds));

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const data = await request({ method: 'get', url: '/contacts' });
        setAllContacts(data);
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    })();
  }, [request]);

  const toggle = async (contact) => {
    setPendingId(contact.id);
    setError('');
    const isMember = selected.has(contact.id);
    try {
      if (isMember) {
        await request({ method: 'delete', url: `/groups/${groupId}/contacts/${contact.id}` });
        setSelected((prev) => {
          const next = new Set(prev);
          next.delete(contact.id);
          return next;
        });
      } else {
        await request({ method: 'post', url: `/groups/${groupId}/contacts/${contact.id}` });
        setSelected((prev) => new Set(prev).add(contact.id));
      }
      onChange();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setPendingId(null);
    }
  };

  return (
    <Modal title="Manage members" onClose={onClose}>
      {error && <div className="mb-3"><ErrorBanner message={error} /></div>}
      {loading ? (
        <LoadingSpinner label="Loading contacts…" />
      ) : allContacts.length === 0 ? (
        <p className="text-sm text-ink-500">You don't have any contacts yet.</p>
      ) : (
        <ul className="max-h-80 space-y-1 overflow-y-auto">
          {allContacts.map((contact) => (
            <li key={contact.id}>
              <label className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-ink-100">
                <input
                  type="checkbox"
                  checked={selected.has(contact.id)}
                  disabled={pendingId === contact.id}
                  onChange={() => toggle(contact)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-ink-800">
                  {contact.firstName} {contact.lastName}
                  <span className="text-ink-400"> · {contact.currentTitle || 'No title'}</span>
                </span>
              </label>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-4 flex justify-end">
        <button
          onClick={onClose}
          className="rounded-md bg-ink-900 px-4 py-2 text-sm font-medium text-white hover:bg-ink-800"
        >
          Done
        </button>
      </div>
    </Modal>
  );
}
