import { useState } from 'react';
import Modal from './Modal';
import ErrorBanner from './ErrorBanner';
import useApi from '../hooks/useApi';
import { getErrorMessage } from '../api/errors';

export default function CsvImportModal({ onClose, onImported }) {
  const request = useApi();
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | uploading | done
  const [error, setError] = useState('');
  const [importedCount, setImportedCount] = useState(0);

  const handleUpload = async () => {
    if (!file) return;
    setError('');
    setStatus('uploading');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const result = await request({
        method: 'post',
        url: '/contacts/import',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setImportedCount(result.imported);
      setStatus('done');
      onImported();
    } catch (err) {
      setError(getErrorMessage(err));
      setStatus('idle');
    }
  };

  return (
    <Modal title="Import LinkedIn connections" onClose={onClose}>
      <div className="space-y-4">
        {status === 'done' ? (
          <p className="text-sm text-gray-700">
            Imported <strong>{importedCount}</strong> connections. You can close this and refine
            them below.
          </p>
        ) : (
          <>
            <p className="text-sm text-gray-500">
              Upload the <code className="bg-gray-100 px-1 py-0.5 rounded">Connections.csv</code>{' '}
              file from your LinkedIn data export (Settings &rarr; Data privacy &rarr; Get a copy
              of your data).
            </p>
            {error && <ErrorBanner message={error} />}
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full text-sm"
            />
          </>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
          >
            {status === 'done' ? 'Close' : 'Cancel'}
          </button>
          {status !== 'done' && (
            <button
              onClick={handleUpload}
              disabled={!file || status === 'uploading'}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {status === 'uploading' ? 'Importing…' : 'Import'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
