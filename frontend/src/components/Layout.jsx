import { useState } from 'react';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const title =
    pageTitles[location.pathname] ||
    Object.entries(pageTitles).find(([k]) => location.pathname.startsWith(k + '/'))?.[1] ||
    'Healthcare System';

  const activeRole = localStorage.getItem('activeRole') || 'guest';
  const roleDisplay = activeRole.replace('_', ' ');
  const avatarInitials = activeRole.substring(0, 3).toUpperCase();

  return (
    <div className="app-shell">
      {/* Mobile Overlay Backdrop */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />
      
      <div className="main-content">
        <header className="topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              className="hamburger-btn"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open Menu"
            >
              ☰
            </button>
            <span className="topbar-title">{title}</span>
          </div>
          <div className="topbar-right">
            <div className="topbar-badge" onClick={() => navigate('/app/notifications')} title="Notifications">
              🔔
              <span className="dot" />
            </div>
            <span className="topbar-role">{roleDisplay}</span>
            <div className="avatar" title={roleDisplay}>{avatarInitials}</div>
          </div>
        </header>
        <main className="page-body">{children}</main>
      </div>
    </div>
  );
}
