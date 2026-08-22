import { useCallback, useEffect, useState } from 'react';
import useApi from '../hooks/useApi';
import { getErrorMessage } from '../api/errors';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import ContactCard from '../components/ContactCard';
import ContactForm from '../components/ContactForm';
import CsvImportModal from '../components/CsvImportModal';
import Modal from '../components/Modal';

export default function Dashboard() {
  const request = useApi();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await request({ method: 'get', url: '/contacts' });
      setContacts(data);
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
    await request({ method: 'post', url: '/contacts', data: values });
    setShowAddForm(false);
    await load();
  };

  const handleDelete = async (contact) => {
    if (!window.confirm(`Delete ${contact.firstName} ${contact.lastName}?`)) return;
    try {
      await request({ method: 'delete', url: `/contacts/${contact.id}` });
      setContacts((prev) => prev.filter((c) => c.id !== contact.id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-ink-900">Contacts</h1>
          <p className="text-ink-500">{contacts.length} people in your network</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowImport(true)}
            className="rounded-md border border-ink-300 px-4 py-2 text-sm font-medium text-ink-700 hover:bg-ink-100"
          >
            Import LinkedIn CSV
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="rounded-md bg-ink-900 px-4 py-2 text-sm font-medium text-white hover:bg-ink-800"
          >
            Add contact
          </button>
        </div>
      </div>

      {error && <div className="mb-4"><ErrorBanner message={error} onRetry={load} /></div>}

      {loading ? (
        <LoadingSpinner label="Loading contacts…" />
      ) : contacts.length === 0 ? (
        <div className="rounded-lg border border-dashed border-ink-300 py-16 text-center text-ink-500">
          No contacts yet. Import your LinkedIn connections or add one manually to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {contacts.map((contact) => (
            <ContactCard key={contact.id} contact={contact} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showAddForm && (
        <Modal title="Add contact" onClose={() => setShowAddForm(false)}>
          <ContactForm onSubmit={handleCreate} onCancel={() => setShowAddForm(false)} />
        </Modal>
      )}

      {showImport && (
        <CsvImportModal onClose={() => setShowImport(false)} onImported={load} />
      )}
    </div>
  );
}
