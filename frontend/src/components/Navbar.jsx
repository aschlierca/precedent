import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import Logo from './Logo';

const linkClasses = ({ isActive }) =>
  `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
    isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
  }`;

export default function Navbar() {
  const { user, logout } = useAuth0();

  return (
    <header className="border-b border-coolgray bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-6">
          <span className="flex items-center gap-2">
            <Logo className="h-6 w-6" />
            <span className="font-serif text-xl italic text-gray-900">Precedent</span>
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
          {user && <span className="text-sm text-gray-500">{user.name || user.email}</span>}
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  );
}
