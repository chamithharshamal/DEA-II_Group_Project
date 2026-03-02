// ─── Admin Module (Member 1) ──────────────────────────────────
// Service: admin-service  |  API base: /api/admin
// TODO: Create AdminList.jsx, AdminForm.jsx, DepartmentList.jsx
import Placeholder from '../../components/Placeholder';

export default function AdminRoutes() {
  return (
    <Placeholder
      module="Admin Management"
      member="Member 1"
      routes={[
        'GET    /api/admin/admins         → AdminList.jsx',
        'GET    /api/admin/admins/:id     → AdminForm.jsx (edit)',
        'POST   /api/admin/admins         → AdminForm.jsx (create)',
        'PUT    /api/admin/admins/:id     → AdminForm.jsx',
        'DELETE /api/admin/admins/:id',
        'GET    /api/admin/departments    → DepartmentList.jsx',
        'POST   /api/admin/departments',
      ]}
    />
  );
}
