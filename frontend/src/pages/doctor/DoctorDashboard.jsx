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
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ margin: 0, color: '#0f5550' }}>Doctor Dashboard</h1>
        <button onClick={handleSignOut} className="btn btn-outline" style={{ borderColor: '#2ec4b6', color: '#2ec4b6' }}>
          Sign Out
        </button>
      </div>

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px'
      }}>
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e2f7f4' }}>
          <h3 style={{ margin: '0 0 16px', color: '#1a6fba', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📅 Today's Appointments
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            You have no upcoming appointments for today.
          </p>
        </div>

        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e2f7f4' }}>
          <h3 style={{ margin: '0 0 16px', color: '#1a6fba', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🧪 Recent Lab Reports
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            No new lab reports have been assigned to your patients.
          </p>
        </div>
        
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #e2f7f4' }}>
          <h3 style={{ margin: '0 0 16px', color: '#1a6fba', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🔔 Notifications
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
            You're all caught up!
          </p>
        </div>
      </div>
    </div>
  );
}
