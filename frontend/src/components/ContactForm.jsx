import { useState } from 'react';
import ErrorBanner from './ErrorBanner';

const emptyForm = {
  firstName: '',
  lastName: '',
  linkedinUrl: '',
  currentCompany: '',
  currentTitle: '',
  connectedOn: '',
  notes: '',
};

const fieldClasses =
  'w-full rounded-md border border-ink-200 px-3 py-2 text-sm focus:border-ink-500 focus:outline-none focus:ring-1 focus:ring-ink-500';

export default function ContactForm({ initialValues, onSubmit, onCancel }) {
  const [form, setForm] = useState({ ...emptyForm, ...initialValues });
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
      setError(err.message || 'Failed to save contact.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && <ErrorBanner message={error} />}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-600">First name</label>
          <input
            required
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            className={fieldClasses}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-ink-600">Last name</label>
          <input
            required
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            className={fieldClasses}
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-ink-600">Current title</label>
        <input
          name="currentTitle"
          value={form.currentTitle}
          onChange={handleChange}
          className={fieldClasses}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-ink-600">Current company</label>
        <input
          name="currentCompany"
          value={form.currentCompany}
          onChange={handleChange}
          className={fieldClasses}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-ink-600">LinkedIn URL</label>
        <input
          name="linkedinUrl"
          value={form.linkedinUrl}
          onChange={handleChange}
          className={fieldClasses}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-ink-600">Connected on</label>
        <input
          type="date"
          name="connectedOn"
          value={form.connectedOn || ''}
          onChange={handleChange}
          className={fieldClasses}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-ink-600">Notes</label>
        <textarea
          name="notes"
          value={form.notes || ''}
          onChange={handleChange}
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
