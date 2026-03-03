// ─── Staff Module (Member 8) ──────────────────────────────────
// Service: staff-service  |  API base: /api/staff

import { useState } from 'react';
import StaffList from './StaffList';

const TABS = [
  { id: 'directory', label: '👥  Staff Directory' },
  { id: 'shifts', label: '📅  Shift Schedule' },
];

export default function StaffRoutes() {
  const [tab, setTab] = useState('directory');

  return (
    <div>
      <div className="page-header">
        <h1>Staff Management</h1>
        <p>Manage hospital staff members and their work shifts.</p>
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

      {tab === 'directory' && <StaffList />}

      {tab === 'shifts' && (
        <div style={{ padding: 48, textAlign: 'center', background: '#f8fafc', borderRadius: 12, border: '2px dashed #e2e8f0' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🗓️</div>
          <h3 style={{ fontWeight: 600, color: 'var(--color-text)' }}>Shift Schedule Coming Soon</h3>
          <p style={{ color: 'var(--color-muted)', maxWidth: 400, margin: '0 auto' }}>
            We're building a powerful shift management system. You'll soon be able to assign and track staff working hours here.
          </p>
        </div>
      )}
    </div>
  );
}
