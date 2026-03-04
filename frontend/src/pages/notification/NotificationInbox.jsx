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
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Notification Inbox</h1>
          <p className="text-gray-500 mt-1">Manage your alerts and messages system-wide.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg shadow-sm font-semibold">
          You have {unreadCount} unread messages
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button 
          onClick={() => setFilter('ALL')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${filter === 'ALL' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          All Messages
        </button>
        <button 
          onClick={() => setFilter('UNREAD')}
          className={`px-4 py-2 rounded-md font-medium transition-colors ${filter === 'UNREAD' ? 'bg-blue-600 text-white shadow' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
        >
          Unread Only
        </button>
        <button 
          onClick={fetchNotifications}
          className="ml-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          ↻ Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="bg-gray-50 text-center py-16 rounded-xl border border-gray-100">
          <div className="text-gray-400 mb-3 text-5xl">📭</div>
          <h3 className="text-lg font-medium text-gray-900">No notifications found</h3>
          <p className="text-gray-500 mt-1">You're all caught up!</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {notifications.map((notif) => (
              <li 
                key={notif.notificationId} 
                className={`p-5 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${notif.status === 'UNREAD' ? 'bg-blue-50/30' : 'bg-white hover:bg-gray-50'}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    {notif.status === 'UNREAD' && (
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse"></span>
                    )}
                    <h3 className={`text-lg ${notif.status === 'UNREAD' ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {notif.title || 'Untitled Notification'}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md uppercase tracking-wide font-medium"> // notification type, eg SYSTEM/ALERT
                      {notif.type || 'SYSTEM'}
                    </span>
                  </div>
                  <p className={`text-sm mb-2 ${notif.status === 'UNREAD' ? 'text-gray-700' : 'text-gray-500'}`}>
                    {notif.message}
                  </p>
                  <div className="text-xs text-gray-400 font-mono">
                    {new Date(notif.createdAt).toLocaleString()} • Recipient ID: {notif.recipientId || 'N/A'}
                  </div>
                </div>
                
                <div className="flex shrink-0 gap-2">
                  {notif.status === 'UNREAD' && (
                    <button 
                      onClick={() => handleMarkAsRead(notif.notificationId)}
                      className="px-3 py-1.5 text-sm bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 rounded-md font-medium transition"
                    >
                      ✓ Mark Read
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(notif.notificationId)}
                    className="px-3 py-1.5 text-sm bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-md font-medium transition"
                  >
                    🗑 Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
