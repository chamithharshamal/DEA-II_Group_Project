import { NavLink } from 'react-router-dom';

const navItems = [
  { section: 'Management' },
  { path: '/app/admin',         icon: '🛡️',  label: 'Admin' },
  { path: '/app/patients',      icon: '🏥',  label: 'Patients' },
  { path: '/app/doctors',       icon: '👨‍⚕️', label: 'Doctors' },
  { path: '/app/staff',         icon: '👥',  label: 'Staff' },
  { section: 'Clinical' },
  { path: '/app/appointments',  icon: '📅',  label: 'Appointments' },
  { path: '/app/lab-reports',   icon: '🔬',  label: 'Lab Reports' },
  { section: 'Finance & Ops' },
  { path: '/app/billing',       icon: '💳',  label: 'Billing' },
  { path: '/app/pharmacy',      icon: '💊',  label: 'Pharmacy' },
  { section: 'System' },
  { path: '/app/notifications', icon: '🔔',  label: 'Notifications' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>✚</span>
        <div>
          HealthCare
          <span className="logo-sub">Hospital Management</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item, i) =>
          item.section ? (
            <div key={i} className="nav-section-label">{item.section}</div>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </NavLink>
          )
        )}
      </nav>

      <div className="sidebar-footer">
        <div style={{ marginBottom: 2, fontWeight: 600, fontSize: '0.73rem', color: 'var(--color-text)' }}>HealthCare HMS</div>
        <div>123 Hospital Rd, Colombo · v1.0</div>
      </div>
    </aside>
  );
}
