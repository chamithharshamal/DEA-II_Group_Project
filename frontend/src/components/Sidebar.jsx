import { NavLink } from 'react-router-dom';

const navItems = [
  { section: 'Management', roles: ['admin', 'staff'] },
  { path: '/app/admin',         icon: '🛡️',  label: 'Admin', roles: ['admin'] },
  { path: '/app/staff',         icon: '👥',  label: 'Staff', roles: ['admin', 'staff'] },
  { path: '/app/patients',      icon: '🏥',  label: 'Patients', roles: ['admin', 'doctor', 'staff'] },
  { path: '/app/doctors',       icon: '👨‍⚕️', label: 'Doctors', roles: ['admin'] },
  { section: 'Clinical', roles: ['admin', 'doctor', 'lab_tech', 'staff'] },
  { path: '/app/appointments',  icon: '📅',  label: 'Appointments', roles: ['admin', 'doctor', 'staff'] },
  { path: '/app/lab-reports',   icon: '🔬',  label: 'Lab Reports', roles: ['admin', 'doctor', 'lab_tech'] },
  { section: 'Finance & Ops', roles: ['admin', 'pharmacist', 'staff'] },
  { path: '/app/billing',       icon: '💳',  label: 'Billing', roles: ['admin', 'staff'] },
  { path: '/app/pharmacy',      icon: '💊',  label: 'Pharmacy', roles: ['admin', 'pharmacist'] },
  { section: 'System', roles: ['admin', 'doctor', 'staff', 'pharmacist', 'lab_tech'] },
  { path: '/app/notifications', icon: '🔔',  label: 'Notifications', roles: ['admin', 'doctor', 'staff', 'pharmacist', 'lab_tech'] },
];

export default function Sidebar({ isOpen, closeSidebar }) {
  const activeRole = localStorage.getItem('activeRole') || 'guest';

  // Filter items based on role
  const filteredNav = navItems.filter(item => {
    if (!item.roles) return true; // Show if no roles specified
    return item.roles.includes(activeRole) || activeRole === 'admin';
  });

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-logo">
        <span style={{ filter: 'drop-shadow(0 2px 4px rgba(37,99,235,0.3))' }}>✚</span>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '1.35rem', lineHeight: '1.2', color: 'var(--primary-blue-darker)', fontWeight: 800 }}>HealthCare</span>
          <span className="logo-sub" style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.05em', marginTop: '2px' }}>Hospital System</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {filteredNav.map((item, i) =>
          item.section ? (
            <div key={i} className="nav-section-label">{item.section}</div>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </NavLink>
          )
        )}
      </nav>

      <div className="sidebar-footer">
        <div style={{ marginBottom: 2, fontWeight: 600, fontSize: '0.73rem', color: 'var(--text-primary)' }}>HealthCare HMS</div>
        <div style={{ fontSize: '0.75rem', color: 'var(--primary-blue)', marginBottom: 4, textTransform: 'capitalize' }}>
          Role: {activeRole.replace('_', ' ')}
        </div>
        <div>123 Hospital Rd, Colombo · v1.0</div>
      </div>
    </aside>
  );
}
