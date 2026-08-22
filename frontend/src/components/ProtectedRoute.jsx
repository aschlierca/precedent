import { useMemo } from 'react';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import LoadingSpinner from './LoadingSpinner';

export default function ProtectedRoute({ component }) {
  const Component = useMemo(
    () =>
      withAuthenticationRequired(component, {
        onRedirecting: () => (
          <div className="min-h-screen flex items-center justify-center">
            <LoadingSpinner label="Checking login…" />
          </div>
        ),
      }),
    [component]
  );
  return <Component />;
}
