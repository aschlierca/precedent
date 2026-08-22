import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { getErrorMessage } from '../api/errors';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import GroupForm from '../components/GroupForm';
import GroupContactPicker from '../components/GroupContactPicker';
import InsightPanel from '../components/InsightPanel';

export default function GroupDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const request = useApi();

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [managingMembers, setManagingMembers] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await request({ method: 'get', url: `/groups/${id}` });
      setGroup(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [request, id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleUpdate = async (values) => {
    const updated = await request({ method: 'put', url: `/groups/${id}`, data: values });
    setGroup({ ...group, ...updated });
    setEditing(false);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this group? This does not delete the contacts in it.')) return;
    await request({ method: 'delete', url: `/groups/${id}` });
    navigate('/groups');
  };

  if (loading) return <LoadingSpinner label="Loading group…" />;
  if (error && !group) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-8">
        <ErrorBanner message={error} onRetry={load} />
      </div>
    );
  }
  if (!group) return null;

  const members = group.Contacts || [];

  return (
    <div className="mx-auto max-w-2xl px-6 py-8 space-y-6">
      <Link to="/groups" className="text-sm text-ink-500 hover:text-ink-800">
        &larr; Back to groups
      </Link>

      {error && <ErrorBanner message={error} onRetry={load} />}

      <div className="rounded-lg border border-ink-200 bg-white p-6">
        {editing ? (
          <GroupForm initialValues={group} onSubmit={handleUpdate} onCancel={() => setEditing(false)} />
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-ink-900">{group.name}</h1>
              {group.description && <p className="text-ink-600">{group.description}</p>}
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => setEditing(true)}
                className="rounded-md border border-ink-300 px-3 py-1.5 text-sm text-ink-700 hover:bg-ink-100"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-lg border border-ink-200 bg-white p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink-900">Members ({members.length})</h2>
          <button
            onClick={() => setManagingMembers(true)}
            className="text-sm font-medium text-ink-700 hover:text-ink-900"
          >
            Manage members
          </button>
        </div>
        {members.length === 0 ? (
          <p className="text-sm text-ink-500">No members yet. Add some to generate an insight.</p>
        ) : (
          <ul className="space-y-1">
            {members.map((contact) => (
              <li key={contact.id}>
                <Link
                  to={`/contacts/${contact.id}`}
                  className="block rounded-md px-2 py-1.5 text-sm text-ink-800 hover:bg-ink-100"
                >
                  {contact.firstName} {contact.lastName}
                  <span className="text-ink-400"> · {contact.currentTitle || 'No title'}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <InsightPanel groupId={group.id} memberCount={members.length} />

      {managingMembers && (
        <GroupContactPicker
          groupId={group.id}
          memberIds={members.map((c) => c.id)}
          onClose={() => setManagingMembers(false)}
          onChange={load}
        />
      )}
    </div>
  );
}
