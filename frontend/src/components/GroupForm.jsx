import { useState } from 'react';
import ErrorBanner from './ErrorBanner';

const fieldClasses =
  'w-full rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-ink-500 focus:outline-none focus:ring-1 focus:ring-ink-500';

export default function GroupForm({ initialValues, onSubmit, onCancel }) {
  const [form, setForm] = useState({ name: '', description: '', ...initialValues });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message || 'Failed to save group.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <ErrorBanner message={error} />}
      <div>
        <label className="mb-1 block text-xs font-medium text-ink-600">Name</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className={fieldClasses}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-ink-600">Description</label>
        <textarea
          value={form.description || ''}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className={fieldClasses}
        />
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md px-4 py-2 text-sm font-medium text-ink-600 hover:bg-ink-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-ink-900 px-4 py-2 text-sm font-medium text-white hover:bg-ink-800 disabled:opacity-60"
        >
          {submitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
}
