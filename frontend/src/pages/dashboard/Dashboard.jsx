// ─── Dashboard Overview Page (Member 10) ─────────────────────
// Connects to multiple services via API Gateway
// API: GET /api/*/count  (or aggregate endpoint)

import { useState, useEffect } from 'react';
import api from '../../services/api';

const stats = [
  { icon: '🛡️',  label: 'Admins',       key: 'admins',        color: '#4f8ef7' },
  { icon: '🏥', label: 'Patients',      key: 'patients',      color: '#22c55e' },
  { icon: '👨‍⚕️', label: 'Doctors',       key: 'doctors',       color: '#7c5cfc' },
  { icon: '👥', label: 'Staff',         key: 'staff',         color: '#f59e0b' },
  { icon: '📅', label: 'Appointments',  key: 'appointments',  color: '#06b6d4' },
  { icon: '🔬', label: 'Lab Reports',   key: 'labReports',    color: '#ef4444' },
  { icon: '💳', label: 'Invoices',      key: 'invoices',      color: '#10b981' },
  { icon: '💊', label: 'Drugs',         key: 'drugs',         color: '#f97316' },
  { icon: '🔔', label: 'Alerts',        key: 'notifications', color: '#8b5cf6' },
];

export default function Dashboard() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    // TODO: Replace with real API calls per service
    // Example: api.get('/api/patients/count').then(r => setCounts(c => ({...c, patients: r.data})))
    const mock = { admins: 4, patients: 120, doctors: 18, staff: 32,
                   appointments: 54, labReports: 210, invoices: 88, drugs: 340, notifications: 7 };
    setCounts(mock);
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>System Dashboard</h1>
        <p>Overview of all services — Healthcare Group 35</p>
      </div>

      <div className="stat-grid mb-6">
        {stats.map(s => (
          <div className="stat-card" key={s.key}>
            <span className="stat-icon">{s.icon}</span>
            <span className="stat-value" style={{ color: s.color }}>
              {counts[s.key] ?? '—'}
            </span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ marginBottom: 8, fontSize: '1rem' }}>Microservices Status</h2>
        <p className="text-muted text-sm">All services route through API Gateway at <code>localhost:8080</code></p>
        <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {['admin-service','patient-service','doctor-service','staff-service',
            'appointment-service','lab-report-service','billing-service',
            'pharmacy-service','notification-service','discovery-service'].map(svc => (
            <span key={svc} className="badge badge-success">{svc}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
