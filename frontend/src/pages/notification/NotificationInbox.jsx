import React, { useState, useEffect } from 'react';
import { 
  getAllNotifications, 
  markAsRead, 
  deleteNotification 
} from '../../services/notificationService';

export default function NotificationInbox() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL'); // ALL or UNREAD
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError('');
    try {
      // In a fully integrated system we would use getNotificationsByRecipientId(currentRecipientId)
      // For now we get all to ensure we see the data
      let data = await getAllNotifications();
      
      // Update unread count manually if doing client side, or call getUnreadCount via api
      const unread = data.filter(n => n.status === 'UNREAD').length;
      setUnreadCount(unread);

      if (filter === 'UNREAD') {
        data = data.filter(n => n.status === 'UNREAD');
      }
      
      // Sort by newest first
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch notifications.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      fetchNotifications(); // Refresh list to update UI
    } catch (err) {
      console.error(err);
      alert('Failed to mark as read.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) return;
    try {
      await deleteNotification(id);
      fetchNotifications(); // Refresh list
    } catch (err) {
      console.error(err);
      alert('Failed to delete notification.');
    }
  };

  return (
    <div className="card" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div className="flex-between mb-4 mt-2" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1 style={{ margin: 0 }}>Notification Inbox</h1>
          <p>Manage your alerts and messages system-wide.</p>
        </div>
        <div style={{ background: 'var(--primary-blue-light)', color: '#fff', padding: '8px 16px', borderRadius: 'var(--radius-pill)', fontWeight: 600, fontSize: '0.9rem', boxShadow: '0 4px 12px rgba(37,99,235,0.2)' }}>
          {unreadCount} Unread Message{unreadCount !== 1 ? 's' : ''}
        </div>
      </div>

      <div className="admin-tabs" style={{ marginBottom: '24px', display: 'flex', gap: '8px', width: '100%' }}>
        <button 
          onClick={() => setFilter('ALL')}
          className={`admin-tab ${filter === 'ALL' ? 'active' : ''}`}
        >
          All Messages
        </button>
        <button 
          onClick={() => setFilter('UNREAD')}
          className={`admin-tab ${filter === 'UNREAD' ? 'active' : ''}`}
        >
          Unread Only
        </button>
        <button 
          onClick={fetchNotifications}
          className="admin-tab"
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div style={{ background: 'var(--danger-bg)', color: 'var(--danger)', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
          <strong>Error: </strong> {error}
        </div>
      )}

      {loading ? (
        <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-tertiary)' }}>
          ⏳ Loading notifications...
        </div>
      ) : notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', border: '1px dashed var(--border)', borderRadius: '12px', background: 'var(--off-white)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
          <h3 style={{ margin: '0 0 8px', color: 'var(--text-primary)' }}>No notifications found</h3>
          <p className="text-muted" style={{ margin: 0 }}>You're all caught up!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {notifications.map((notif) => (
            <div 
              key={notif.notificationId} 
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '16px',
                padding: '24px',
                borderRadius: '12px',
                border: `1px solid ${notif.status === 'UNREAD' ? 'var(--primary-blue-light)' : 'var(--border)'}`,
                background: notif.status === 'UNREAD' ? 'rgba(37, 99, 235, 0.03)' : '#fff',
                transition: 'var(--transition)',
                boxShadow: notif.status === 'UNREAD' ? '0 4px 12px rgba(37, 99, 235, 0.05)' : 'none'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  {notif.status === 'UNREAD' && (
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary-blue)', display: 'inline-block', flexShrink: 0 }}></span>
                  )}
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: notif.status === 'UNREAD' ? 700 : 600, color: notif.status === 'UNREAD' ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {notif.title || 'Untitled Notification'}
                  </h3>
                  <span className={`status ${notif.type === 'ALERT' ? 'danger' : 'info'}`} style={{ fontSize: '0.7rem', padding: '4px 10px' }}>
                    {notif.type || 'SYSTEM'}
                  </span>
                </div>
                <p style={{ color: notif.status === 'UNREAD' ? 'var(--text-secondary)' : 'var(--text-tertiary)', marginBottom: '16px', fontSize: '1rem', lineHeight: '1.5' }}>
                  {notif.message}
                </p>
                <div className="text-muted text-sm" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                  {new Date(notif.createdAt).toLocaleString()} • Recipient ID: {notif.recipientId || 'Global'}
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                {notif.status === 'UNREAD' && (
                  <button 
                    onClick={() => handleMarkAsRead(notif.notificationId)}
                    className="btn btn-sm btn-outline"
                    title="Mark as Read"
                  >
                    ✓ Mark Read
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(notif.notificationId)}
                  className="btn btn-sm btn-danger"
                  title="Delete Notification"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
