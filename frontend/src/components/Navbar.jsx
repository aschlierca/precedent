import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const linkClasses = ({ isActive }) =>
  `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
    isActive ? 'bg-ink-900 text-white' : 'text-ink-600 hover:bg-ink-100'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth0();

  return (
    <header className="border-b border-ink-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <span className="text-lg font-semibold text-ink-900">
            Precedent<span className="text-amber-500">.</span>
          </span>
          <nav className="flex items-center gap-1">
            <NavLink to="/dashboard" className={linkClasses}>
              Contacts
            </NavLink>
            <NavLink to="/groups" className={linkClasses}>
              Groups
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {user && <span className="text-sm text-ink-500">{user.name || user.email}</span>}
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="text-sm font-medium text-ink-600 hover:text-ink-900"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
