// ─── Admin Panel (Member 1) ────────────────────────────────────────────────────
// Shows a login gate first; after successful login the JWT is in localStorage
// and all subsequent API calls are authenticated.

import { useState } from 'react';
import AdminList      from './AdminList';
import DepartmentList from './DepartmentList';
import AdminLogin     from './AdminLogin';
import { logoutAdmin } from '../../services/adminService';

const TABS = [
  { id: 'admins',      label: '🛡️  Admins' },
  { id: 'departments', label: '🏢  Departments' },
];

export default function AdminRoutes() {
  const [tab,       setTab]       = useState('admins');
  // Check if a token already exists so the user isn't asked to log in again after a page refresh
  const [loggedIn, setLoggedIn]  = useState(() => Boolean(localStorage.getItem('adminToken')));

  function handleLogout() {
    logoutAdmin();
    setLoggedIn(false);
  }

  if (!loggedIn) {
    return <AdminLogin onSuccess={() => setLoggedIn(true)} />;
  }

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1>Admin Management</h1>
          <p>Manage system administrators and hospital departments.</p>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={handleLogout}
          style={{ marginTop: 4 }}
        >
          🔓 Logout
        </button>
      </div>

      <div className="admin-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`admin-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'admins'      && <AdminList />}
      {tab === 'departments' && <DepartmentList />}
    </div>
  );
}
