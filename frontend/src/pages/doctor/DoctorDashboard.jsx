import { useState, useEffect } from 'react';
import { logoutDoctor, getDoctors } from '../../services/doctorService';

export default function DoctorDashboard({ onLogout }) {
  const [profile, setProfile] = useState(null);

  // Note: in a real application the /login response should return the doctor's profile or ID.
  // For now, since we only have a generic token, the dashboard will just show a generic greeting.

  function handleSignOut() {
    logoutDoctor();
    onLogout();
  }

  return (
    <div className="card">
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <h1 style={{ margin: 0 }}>Doctor Dashboard</h1>
        <p>Welcome to your personal dashboard. View appointments, patient reports, and track your daily schedule.</p>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginTop: '32px'
      }}>
        <div style={{ background: 'var(--off-white)', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: '0 0 16px', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📅 Today's Appointments
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            You have no upcoming appointments for today.
          </p>
          <button className="btn btn-primary" style={{ marginTop: '16px' }}>View Schedule</button>
        </div>

        <div style={{ background: 'var(--off-white)', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: '0 0 16px', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🧪 Recent Lab Reports
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            No new lab reports have been assigned to your patients.
          </p>
          <button className="btn btn-outline" style={{ marginTop: '16px' }}>View All Reports</button>
        </div>
        
        <div style={{ background: 'var(--off-white)', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
          <h3 style={{ margin: '0 0 16px', color: 'var(--primary-blue)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔔 Notifications
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            You're all caught up! No active notifications.
          </p>
        </div>
      </div>
    </div>
  );
}
