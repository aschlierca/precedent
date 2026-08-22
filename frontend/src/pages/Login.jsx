import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';

export default function Login() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink-50 px-6">
      <div className="max-w-lg text-center space-y-6">
        <h1 className="text-4xl font-semibold text-ink-900">
          Precedent<span className="text-amber-500">.</span>
        </h1>
        <p className="text-lg text-ink-600">
          Your network already found the way — see the pattern, follow the path.
        </p>
        <p className="text-ink-500">
          Import your LinkedIn connections, group them by field or company, and let AI surface the
          career patterns already sitting in your network.
        </p>
        <button
          onClick={() => loginWithRedirect()}
          className="rounded-lg bg-ink-900 px-6 py-3 text-white font-medium hover:bg-ink-800 transition-colors"
        >
          Log in to get started
        </button>
      </div>
    </div>
  );
}
