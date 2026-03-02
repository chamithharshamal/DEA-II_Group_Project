import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const pageTitles = {
  '/':              'Dashboard',
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
  const title = pageTitles[location.pathname] ||
    Object.entries(pageTitles).find(([k]) => location.pathname.startsWith(k + '/'))?.[1] ||
    'Healthcare System';

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <header className="topbar">
          <span className="topbar-title">{title}</span>
          <div className="topbar-right">
            <span className="text-muted text-sm">Group 35</span>
            <div className="avatar">G35</div>
          </div>
        </header>
        <main className="page-body">{children}</main>
      </div>
    </div>
  );
}
