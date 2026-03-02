// ─── Appointment Module (Member 4) ───────────────────────────
// Service: appointment-service  |  API base: /api/appointments
// TODO: Create AppointmentList.jsx, BookAppointment.jsx
import Placeholder from '../../components/Placeholder';

export default function AppointmentRoutes() {
  return (
    <Placeholder
      module="Appointment Management"
      member="Member 4"
      routes={[
        'GET    /api/appointments       → AppointmentList.jsx',
        'GET    /api/appointments/:id   → AppointmentDetail.jsx',
        'POST   /api/appointments       → BookAppointment.jsx',
        'PUT    /api/appointments/:id   → BookAppointment.jsx (reschedule)',
        'DELETE /api/appointments/:id  (cancel)',
      ]}
    />
  );
}
