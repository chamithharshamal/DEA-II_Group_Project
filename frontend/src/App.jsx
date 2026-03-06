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

// ── General auth guard — redirects to /login if no role is stored ──────────────
const PrivateRoute = ({ children }) => {
  const activeRole = localStorage.getItem('activeRole');
  if (!activeRole) return <Navigate to="/login" replace />;
  return children;
};

// ── Role-specific guard — redirects to /login if the current role isn't allowed ─
const RoleRoute = ({ allowedRoles, children }) => {
  const activeRole = localStorage.getItem('activeRole');
  if (!activeRole) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(activeRole)) return <Navigate to="/login" replace />;
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
                {/* Each route is wrapped in RoleRoute to enforce RBAC */}
                <Route path="admin/*"        element={<RoleRoute allowedRoles={['admin']}><AdminRoutes /></RoleRoute>} />
                <Route path="patients/*"     element={<RoleRoute allowedRoles={['patient', 'admin', 'doctor']}><PatientRoutes /></RoleRoute>} />
                <Route path="doctors/*"      element={<RoleRoute allowedRoles={['doctor', 'admin']}><DoctorRoutes /></RoleRoute>} />
                <Route path="appointments/*" element={<RoleRoute allowedRoles={['patient', 'doctor', 'admin', 'staff']}><AppointmentRoutes /></RoleRoute>} />
                <Route path="billing/*"      element={<RoleRoute allowedRoles={['admin', 'staff']}><BillingRoutes /></RoleRoute>} />
                <Route path="pharmacy/*"     element={<RoleRoute allowedRoles={['pharmacist', 'admin']}><PharmacyRoutes /></RoleRoute>} />
                <Route path="lab-reports/*"  element={<RoleRoute allowedRoles={['lab', 'doctor', 'admin']}><LabReportRoutes /></RoleRoute>} />
                <Route path="staff/*"        element={<RoleRoute allowedRoles={['staff', 'admin']}><StaffRoutes /></RoleRoute>} />
                <Route path="notifications/*" element={<RoleRoute allowedRoles={['patient', 'doctor', 'admin', 'staff', 'pharmacist', 'lab']}><NotificationRoutes /></RoleRoute>} />
              </Routes>
            </Layout>
          </PrivateRoute>
        }
      />
    </Routes>
  );
}
