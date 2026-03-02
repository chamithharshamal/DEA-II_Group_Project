import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';

// Dashboard (Member 10) — shared overview page
import Dashboard from './pages/dashboard/Dashboard';

// Module stubs — each member implements their own pages inside their folder
import AdminRoutes       from './pages/admin';
import PatientRoutes     from './pages/patient';
import DoctorRoutes      from './pages/doctor';
import AppointmentRoutes from './pages/appointment';
import BillingRoutes     from './pages/billing';
import PharmacyRoutes    from './pages/pharmacy';
import LabReportRoutes   from './pages/lab-report';
import StaffRoutes       from './pages/staff';
import NotificationRoutes from './pages/notification';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"                 element={<Dashboard />} />
        <Route path="/admin/*"          element={<AdminRoutes />} />
        <Route path="/patients/*"       element={<PatientRoutes />} />
        <Route path="/doctors/*"        element={<DoctorRoutes />} />
        <Route path="/appointments/*"   element={<AppointmentRoutes />} />
        <Route path="/billing/*"        element={<BillingRoutes />} />
        <Route path="/pharmacy/*"       element={<PharmacyRoutes />} />
        <Route path="/lab-reports/*"    element={<LabReportRoutes />} />
        <Route path="/staff/*"          element={<StaffRoutes />} />
        <Route path="/notifications/*"  element={<NotificationRoutes />} />
      </Routes>
    </Layout>
  );
}
