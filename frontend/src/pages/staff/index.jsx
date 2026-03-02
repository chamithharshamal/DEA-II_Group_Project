// ─── Staff Module (Member 8) ──────────────────────────────────
// Service: staff-service  |  API base: /api/staff
// TODO: Create StaffList.jsx, StaffForm.jsx
import Placeholder from '../../components/Placeholder';

export default function StaffRoutes() {
  return (
    <Placeholder
      module="Staff Management"
      member="Member 8"
      routes={[
        'GET    /api/staff        → StaffList.jsx',
        'GET    /api/staff/:id   → StaffForm.jsx (edit)',
        'POST   /api/staff       → StaffForm.jsx (create)',
        'PUT    /api/staff/:id   → StaffForm.jsx',
        'DELETE /api/staff/:id',
      ]}
    />
  );
}
