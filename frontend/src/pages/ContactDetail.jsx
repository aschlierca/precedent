import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { getErrorMessage } from '../api/errors';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import ContactForm from '../components/ContactForm';
import CareerHistoryList from '../components/CareerHistoryList';
import CareerHistoryForm from '../components/CareerHistoryForm';

export default function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const request = useApi();

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(false);
  const [addingHistory, setAddingHistory] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await request({ method: 'get', url: `/contacts/${id}` });
      setContact(data);
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
    const updated = await request({ method: 'put', url: `/contacts/${id}`, data: values });
    setContact({ ...contact, ...updated });
    setEditing(false);
  };

  const handleDeleteContact = async () => {
    if (!window.confirm('Delete this contact?')) return;
    await request({ method: 'delete', url: `/contacts/${id}` });
    navigate('/dashboard');
  };

  const handleAddHistory = async (values) => {
    await request({ method: 'post', url: `/contacts/${id}/career-history`, data: values });
    setAddingHistory(false);
    await load();
  };

  const handleDeleteHistory = async (entry) => {
    if (!window.confirm('Remove this career history entry?')) return;
    try {
      await request({ method: 'delete', url: `/career-history/${entry.id}` });
      await load();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (loading) return <LoadingSpinner label="Loading contact…" />;
  if (error && !contact) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-8">
        <ErrorBanner message={error} onRetry={load} />
      </div>
    );
  }
  if (!contact) return null;

  return (
    <div className="mx-auto max-w-2xl px-6 py-8 space-y-6">
      <Link to="/dashboard" className="text-sm text-gray-500 hover:text-gray-800">
        &larr; Back to contacts
      </Link>

      {error && <ErrorBanner message={error} onRetry={load} />}

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        {editing ? (
          <ContactForm
            initialValues={contact}
            onSubmit={handleUpdate}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {contact.firstName} {contact.lastName}
              </h1>
              <p className="text-gray-600">
                {contact.currentTitle || 'No title'}
                {contact.currentCompany ? ` at ${contact.currentCompany}` : ''}
              </p>
              {contact.linkedinUrl && (
                <a
                  href={contact.linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-600 hover:underline"
                >
                  LinkedIn profile
                </a>
              )}
              {contact.notes && <p className="mt-2 text-sm text-gray-500">{contact.notes}</p>}
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => setEditing(true)}
                className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit
              </button>
              <button
                onClick={handleDeleteContact}
                className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Career history</h2>
          {!addingHistory && (
            <button
              onClick={() => setAddingHistory(true)}
              className="text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              + Add entry
            </button>
          )}
        </div>
        {addingHistory && (
          <div className="mb-4">
            <CareerHistoryForm onSubmit={handleAddHistory} onCancel={() => setAddingHistory(false)} />
          </div>
        )}
        <CareerHistoryList
          entries={contact.CareerHistoryEntries || []}
          onDelete={handleDeleteHistory}
        />
      </div>
    </div>
  );
}
