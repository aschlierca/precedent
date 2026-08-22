import { useCallback, useEffect, useState } from 'react';
import useApi from '../hooks/useApi';
import { getErrorMessage } from '../api/errors';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import GroupCard from '../components/GroupCard';
import GroupForm from '../components/GroupForm';
import Modal from '../components/Modal';

export default function Groups() {
  const request = useApi();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await request({ method: 'get', url: '/groups' });
      setGroups(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [request]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (values) => {
    await request({ method: 'post', url: '/groups', data: values });
    setShowForm(false);
    await load();
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Groups</h1>
          <p className="text-ink-500">Organize your network to see the patterns inside it.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-md bg-ink-900 px-4 py-2 text-sm font-medium text-white hover:bg-ink-800"
        >
          New group
        </button>
      </div>

      {error && <div className="mb-4"><ErrorBanner message={error} onRetry={load} /></div>}

      {loading ? (
        <LoadingSpinner label="Loading groups…" />
      ) : groups.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink-300 py-16 text-center text-ink-500">
          No groups yet. Create one (e.g. "UX people," "Grad school friends") to start grouping
          your contacts.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard key={group.id} group={group} />
          ))}
        </div>
      )}

      {showForm && (
        <Modal title="New group" onClose={() => setShowForm(false)}>
          <GroupForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </Modal>
      )}
    </div>
  );
}
