import { useAuth0 } from '@auth0/auth0-react';
import { Navigate } from 'react-router-dom';
import Logo from '../components/Logo';
import CareerMapBackdrop from '../components/CareerMapBackdrop';

export default function Login() {
  const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-offwhite px-6">
      <CareerMapBackdrop />
      <div className="relative max-w-lg text-center">
        <div className="mb-6 flex justify-center">
          <Logo className="h-10 w-10" />
        </div>
        <h1 className="font-serif text-6xl italic text-gray-900">Precedent</h1>
        <p className="mt-6 text-2xl font-medium text-gray-900">
          See your career from a bigger picture.
        </p>
        <p className="mx-auto mt-4 max-w-md text-base text-gray-500">
          Career intelligence that connects your experience, skills, and goals to where the
          market is going — built from the people already in your network.
        </p>
        <button
          onClick={() => loginWithRedirect()}
          className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Log in to get started
        </button>
      </div>
    </div>
  );
}
