import { Routes, Route } from 'react-router-dom';
import AppointmentList from './AppointmentList';
import AppointmentDetail from './AppointmentDetail';
import BookAppointment from './BookAppointment';

export default function AppointmentRoutes() {
  return (
    <Routes>
      {/* Renders AppointmentList when you visit /appointments */}
      <Route index element={<AppointmentList />} />

      {/* Renders BookAppointment when you visit /appointments/book */}
      <Route path="book" element={<BookAppointment />} />

      {/* Renders AppointmentDetail when you visit /appointments/:id */}
      <Route path=":id" element={<AppointmentDetail />} />
    </Routes>
  );
}