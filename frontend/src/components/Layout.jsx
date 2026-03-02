import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';

const pageTitles = {
  '/':              'Landing Page',
  '/admin':         'Admin Management',
  '/patients':      'Patient Management',
  '/doctors':       'Doctor Management',
  '/staff':         'Staff Management',
  '/appointments':  'Appointment Management',
  '/lab-reports':   'Lab Reports',
  '/billing':       'Billing & Invoices',
  '/pharmacy':      'Pharmacy',
  '/notifications': 'Notifications',
};

export default function Layout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const title =
    pageTitles[location.pathname] ||
    Object.entries(pageTitles).find(([k]) => location.pathname.startsWith(k + '/'))?.[1] ||
    'Healthcare System';

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <span className="topbar-title">{title}</span>
          <div className="topbar-right">
            <div className="topbar-badge" onClick={() => navigate('/notifications')} title="Notifications">
              🔔
              <span className="dot" />
            </div>
            <span className="text-muted text-sm">Admin</span>
            <div className="avatar" title="Admin">ADM</div>
          </div>
        </header>
        <main className="page-body">{children}</main>
      </div>
    </div>
  );
}
