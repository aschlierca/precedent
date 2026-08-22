import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

const isConfigured =
  domain && clientId && !domain.startsWith('your-') && !clientId.startsWith('your-');

function NotConfiguredScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 px-6">
      <div className="max-w-md text-center space-y-3">
        <h1 className="text-2xl font-semibold text-ink-900">Auth0 isn't configured yet</h1>
        <p className="text-ink-600">
          Set <code className="bg-ink-100 px-1 py-0.5 rounded">VITE_AUTH0_DOMAIN</code> and{' '}
          <code className="bg-ink-100 px-1 py-0.5 rounded">VITE_AUTH0_CLIENT_ID</code> in a{' '}
          <code className="bg-ink-100 px-1 py-0.5 rounded">.env</code> file (see{' '}
          <code className="bg-ink-100 px-1 py-0.5 rounded">.env.example</code>) to enable login.
        </p>
      </div>
    </div>
  );
}

export default function Auth0ProviderWithNavigate({ children }) {
  const navigate = useNavigate();

  if (!isConfigured) {
    return <NotConfiguredScreen />;
  }

  const onRedirectCallback = (appState) => {
    navigate(appState?.returnTo || '/dashboard');
  };

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience,
      }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  );
}
