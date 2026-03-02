// ─── Pharmacy Module (Member 6) ───────────────────────────────
// Service: pharmacy-service  |  API base: /api/pharmacy
// TODO: Create DrugList.jsx, PrescriptionList.jsx
import Placeholder from '../../components/Placeholder';

export default function PharmacyRoutes() {
  return (
    <Placeholder
      module="Pharmacy"
      member="Member 6"
      routes={[
        'GET    /api/pharmacy/drugs             → DrugList.jsx',
        'POST   /api/pharmacy/drugs             → DrugForm.jsx (add drug)',
        'PUT    /api/pharmacy/drugs/:id         → DrugForm.jsx (edit)',
        'GET    /api/pharmacy/prescriptions     → PrescriptionList.jsx',
        'POST   /api/pharmacy/prescriptions     → PrescriptionForm.jsx',
      ]}
    />
  );
}
