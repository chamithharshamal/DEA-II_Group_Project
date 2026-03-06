import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/landing/LandingPage';
import DoctorsPage from './pages/landing/DoctorsPage';
import UnifiedLogin from './pages/auth/UnifiedLogin';

// Internal HMS pages
import AdminRoutes        from './pages/admin';
import PatientRoutes      from './pages/patient';
import DoctorRoutes       from './pages/doctor';
import AppointmentRoutes  from './pages/appointment';
import BillingRoutes      from './pages/billing';
import PharmacyRoutes     from './pages/pharmacy';
import LabReportRoutes    from './pages/lab';
import StaffRoutes        from './pages/staff';
import NotificationRoutes from './pages/notification';

const PrivateRoute = ({ children }) => {
  const activeRole = localStorage.getItem('activeRole');
  if (!activeRole) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <Routes>
      {/* ── Public Landing Page (no sidebar) ── */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/our-doctors" element={<DoctorsPage />} />
      <Route path="/login" element={<UnifiedLogin />} />

      {/* ── Internal HMS (with sidebar layout) ── */}
      <Route
        path="/app/*"
        element={
          <PrivateRoute>
            <Layout>
              <Routes>
                <Route path="admin/*"          element={<AdminRoutes />} />
                <Route path="patients/*"       element={<PatientRoutes />} />
                <Route path="doctors/*"        element={<DoctorRoutes />} />
                <Route path="appointments/*"   element={<AppointmentRoutes />} />
                <Route path="billing/*"        element={<BillingRoutes />} />
                <Route path="pharmacy/*"       element={<PharmacyRoutes />} />
                <Route path="lab-reports/*"    element={<LabReportRoutes />} />
                <Route path="staff/*"          element={<StaffRoutes />} />
                <Route path="notifications/*"  element={<NotificationRoutes />} />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
