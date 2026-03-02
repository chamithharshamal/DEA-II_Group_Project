import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { section: 'Overview' },
  { path: '/',             icon: '📊', label: 'Dashboard' },
  { section: 'Management' },
  { path: '/admin',        icon: '🛡️',  label: 'Admin' },
  { path: '/patients',     icon: '🏥', label: 'Patients' },
  { path: '/doctors',      icon: '👨‍⚕️', label: 'Doctors' },
  { path: '/staff',        icon: '👥', label: 'Staff' },
  { section: 'Clinical' },
  { path: '/appointments', icon: '📅', label: 'Appointments' },
  { path: '/lab-reports',  icon: '🔬', label: 'Lab Reports' },
  { section: 'Finance & Ops' },
  { path: '/billing',      icon: '💳', label: 'Billing' },
  { path: '/pharmacy',     icon: '💊', label: 'Pharmacy' },
  { section: 'System' },
  { path: '/notifications', icon: '🔔', label: 'Notifications' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span>🏨</span> HealthCare
      </div>
      <nav className="sidebar-nav">
        {navItems.map((item, i) =>
          item.section ? (
            <div key={i} className="nav-section-label">{item.section}</div>
          ) : (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="icon">{item.icon}</span>
              {item.label}
            </NavLink>
          )
        )}
      </nav>
    </aside>
  );
}
