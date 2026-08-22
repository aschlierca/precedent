import { useCallback, useEffect, useState } from 'react';
import useApi from '../hooks/useApi';
import { getErrorMessage } from '../api/errors';
import LoadingSpinner from './LoadingSpinner';
import ErrorBanner from './ErrorBanner';

export default function InsightPanel({ groupId, memberCount }) {
  const request = useApi();
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');

  const loadInsight = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await request({ method: 'get', url: `/groups/${groupId}/insight` });
      setInsight(data || null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [request, groupId]);

  useEffect(() => {
    loadInsight();
  }, [loadInsight]);

  const handleGenerate = async () => {
    setGenerating(true);
    setError('');
    try {
      const data = await request({ method: 'post', url: `/groups/${groupId}/insight/generate` });
      setInsight(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="rounded-lg border border-ink-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ink-900">AI Group Insight</h2>
        <button
          onClick={handleGenerate}
          disabled={generating || memberCount === 0}
          title={memberCount === 0 ? 'Add contacts to this group first' : undefined}
          className="rounded-md bg-amber-500 px-4 py-2 text-sm font-medium text-white hover:bg-amber-600 disabled:opacity-50"
        >
          {generating ? 'Generating…' : insight ? 'Regenerate' : 'Generate insight'}
        </button>
      </div>

      {error && <div className="mb-4"><ErrorBanner message={error} onRetry={handleGenerate} /></div>}

      {loading ? (
        <LoadingSpinner label="Loading insight…" />
      ) : generating ? (
        <LoadingSpinner label="AI is analyzing this group's career patterns…" />
      ) : insight ? (
        <div className="space-y-4">
          <p className="text-ink-700">{insight.summaryText}</p>
          {insight.suggestedRoles?.length > 0 && (
            <div>
              <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-ink-500">
                Suggested titles to search for
              </h3>
              <div className="flex flex-wrap gap-2">
                {insight.suggestedRoles.map((role) => (
                  <span
                    key={role}
                    className="rounded-full bg-amber-100 px-3 py-1 text-sm text-amber-800"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-ink-400">
            Generated {new Date(insight.generatedAt).toLocaleString()}
          </p>
        </div>
      ) : (
        <p className="text-sm text-ink-500">
          No insight generated yet. Click "Generate insight" to have AI analyze this group's
          career patterns.
        </p>
      )}
    </div>
  );
}
