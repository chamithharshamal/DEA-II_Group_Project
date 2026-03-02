// ─── Doctor Module (Member 3) ─────────────────────────────────
// Service: doctor-service  |  API base: /api/doctors
// TODO: Create DoctorList.jsx, DoctorForm.jsx
import Placeholder from '../../components/Placeholder';

export default function DoctorRoutes() {
  return (
    <Placeholder
      module="Doctor Management"
      member="Member 3"
      routes={[
        'GET    /api/doctors       → DoctorList.jsx',
        'GET    /api/doctors/:id   → DoctorForm.jsx (edit)',
        'POST   /api/doctors       → DoctorForm.jsx (create)',
        'PUT    /api/doctors/:id   → DoctorForm.jsx',
        'DELETE /api/doctors/:id',
      ]}
    />
  );
}
