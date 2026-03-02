// ─── Patient Module (Member 2) ────────────────────────────────
// Service: patient-service  |  API base: /api/patients
// TODO: Create PatientList.jsx, PatientForm.jsx
import Placeholder from '../../components/Placeholder';

export default function PatientRoutes() {
  return (
    <Placeholder
      module="Patient Management"
      member="Member 2"
      routes={[
        'GET    /api/patients       → PatientList.jsx',
        'GET    /api/patients/:id   → PatientForm.jsx (edit)',
        'POST   /api/patients       → PatientForm.jsx (create)',
        'PUT    /api/patients/:id   → PatientForm.jsx',
        'DELETE /api/patients/:id',
      ]}
    />
  );
}
