import { useState } from 'react';
import ErrorBanner from './ErrorBanner';

const fieldClasses =
  'w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:border-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500';

export default function CareerHistoryForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({ company: '', title: '', startDate: '', endDate: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(err.message || 'Failed to save entry.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-gray-200 bg-gray-50 p-4">
      {error && <ErrorBanner message={error} />}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Title</label>
          <input required name="title" value={form.title} onChange={handleChange} className={fieldClasses} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Company</label>
          <input required name="company" value={form.company} onChange={handleChange} className={fieldClasses} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Start date</label>
          <input type="date" name="startDate" value={form.startDate} onChange={handleChange} className={fieldClasses} />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">End date</label>
          <input type="date" name="endDate" value={form.endDate} onChange={handleChange} className={fieldClasses} />
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="rounded-md px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100">
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {submitting ? 'Saving…' : 'Add entry'}
        </button>
      </div>
    </form>
  );
}
