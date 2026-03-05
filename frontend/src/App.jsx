import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/landing/LandingPage';

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

export default function App() {
  return (
    <Routes>
      {/* ── Public Landing Page (no sidebar) ── */}
      <Route path="/" element={<LandingPage />} />

      {/* ── Internal HMS (with sidebar layout) ── */}
      <Route
        path="/app/*"
        element={
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
        }
      />
    </Routes>
  );
}
