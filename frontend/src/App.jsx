import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ContactDetail from './pages/ContactDetail';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';

function AuthenticatedLayout({ children }) {
  return (
    <div className="min-h-screen bg-offwhite">
      <Navbar />
      {children}
    </div>
  );
}

function DashboardPage() {
  return (
    <AuthenticatedLayout>
      <Dashboard />
    </AuthenticatedLayout>
  );
}

function ContactDetailPage() {
  return (
    <AuthenticatedLayout>
      <ContactDetail />
    </AuthenticatedLayout>
  );
}

function GroupsPage() {
  return (
    <AuthenticatedLayout>
      <Groups />
    </AuthenticatedLayout>
  );
}

function GroupDetailPage() {
  return (
    <AuthenticatedLayout>
      <GroupDetail />
    </AuthenticatedLayout>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<ProtectedRoute component={DashboardPage} />} />
      <Route path="/contacts/:id" element={<ProtectedRoute component={ContactDetailPage} />} />
      <Route path="/groups" element={<ProtectedRoute component={GroupsPage} />} />
      <Route path="/groups/:id" element={<ProtectedRoute component={GroupDetailPage} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
