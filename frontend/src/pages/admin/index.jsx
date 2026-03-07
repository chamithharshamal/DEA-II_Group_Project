// ─── Admin Panel ────────────────────────────────────────────────────
// Accessible only to Admins, enforcing global authentication.

import { useState } from 'react';
import AdminList from './AdminList';
import DepartmentList from './DepartmentList';
import AdminAppointmentView from './AdminAppointmentView';

const TABS = [
  { id: 'admins', label: '🛡️  Admins' },
  { id: 'departments', label: '🏢  Departments' },
  { id: 'appointments', label: '📅  Appointments' },
];

export default function AdminRoutes() {
  const [tab, setTab] = useState('admins');

  return (
    <div>
      <div className="page-header">
        <h1>Admin Management</h1>
        <p>Manage system administrators, hospital departments, and appointments.</p>
      </div>

      <div className="admin-tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`admin-tab ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: '24px' }}>
        {tab === 'admins' && <AdminList />}
        {tab === 'departments' && <DepartmentList />}
        {tab === 'appointments' && <AdminAppointmentView />}
      </div>
    </div>
  );
}
