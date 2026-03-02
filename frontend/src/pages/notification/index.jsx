// ─── Notification Module (Member 9) ──────────────────────────
// Service: notification-service  |  API base: /api/notifications
// TODO: Create NotificationInbox.jsx, AlertSettings.jsx
import Placeholder from '../../components/Placeholder';

export default function NotificationRoutes() {
  return (
    <Placeholder
      module="Notifications"
      member="Member 9"
      routes={[
        'GET    /api/notifications           → NotificationInbox.jsx',
        'PUT    /api/notifications/:id/read  (mark as read)',
        'DELETE /api/notifications/:id',
        'GET    /api/notifications/settings  → AlertSettings.jsx',
        'PUT    /api/notifications/settings  (update preferences)',
      ]}
    />
  );
}
