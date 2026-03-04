import { Routes, Route } from 'react-router-dom';
import NotificationInbox from './NotificationInbox';

export default function NotificationRoutes() {
  return (
    <Routes>
      <Route index element={<NotificationInbox />} />
    </Routes>
  );
}
