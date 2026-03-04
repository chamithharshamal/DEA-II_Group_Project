// ─── Notification Service API Client ──────────────────────────────────────────
// Uses relative URLs — Vite dev proxy forwards them to localhost:8090.

import axios from 'axios';

const BASE = import.meta.env.VITE_NOTIFICATION_API_URL || ''; 

const client = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request if present
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('adminToken'); // Check standard token or admin token
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Notifications ─────────────────────────────────────────────────────────────
export const createNotification = (dto) => client.post('/api/notifications', dto).then(r => r.data);
export const getAllNotifications = () => client.get('/api/notifications').then(r => r.data);
export const getNotificationById = (id) => client.get(`/api/notifications/${id}`).then(r => r.data);
export const getNotificationsByRecipientId = (recipientId) => client.get(`/api/notifications/recipient/${recipientId}`).then(r => r.data);
export const getNotificationsByRecipientIdAndStatus = (recipientId, status) => client.get(`/api/notifications/recipient/${recipientId}/status/${status}`).then(r => r.data);
export const getNotificationsByType = (type) => client.get(`/api/notifications/type/${type}`).then(r => r.data);
export const getNotificationsByRecipientType = (recipientType) => client.get(`/api/notifications/recipient-type/${recipientType}`).then(r => r.data);
export const getUnreadNotifications = (recipientId) => client.get(`/api/notifications/recipient/${recipientId}/unread`).then(r => r.data);
export const getUnreadCount = (recipientId) => client.get(`/api/notifications/recipient/${recipientId}/unread/count`).then(r => r.data);

export const markAsRead = (id) => client.patch(`/api/notifications/${id}/read`).then(r => r.data);
export const updateNotification = (id, dto) => client.put(`/api/notifications/${id}`, dto).then(r => r.data);
export const deleteNotification = (id) => client.delete(`/api/notifications/${id}`);
