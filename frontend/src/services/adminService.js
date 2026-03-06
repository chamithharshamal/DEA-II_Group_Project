// ─── Admin Service API Client ─────────────────────────────────────────────────
// Uses relative URLs — Vite dev proxy forwards them to localhost:8082.
// In production, point VITE_ADMIN_API_URL to the actual gateway/service.

import axios from 'axios';

const BASE = import.meta.env.VITE_ADMIN_API_URL || '';   // empty = relative (proxy)

const client = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function loginAdmin(email, password) {
  const { data } = await client.post('/api/admins/login', { email, password });
  if (data.token) localStorage.setItem('adminToken', data.token);
  return data;
}

export function logoutAdmin() {
  // Clear all auth-related keys so PrivateRoute redirects to /login
  localStorage.removeItem('adminToken');
  localStorage.removeItem('token');
  localStorage.removeItem('activeRole');
}

// ── Admins ────────────────────────────────────────────────────────────────────
export const getAdmins    = ()          => client.get('/api/admins').then(r => r.data);
export const createAdmin  = (dto)       => client.post('/api/admins', dto).then(r => r.data);
export const updateAdmin  = (id, dto)   => client.put(`/api/admins/${id}`, dto).then(r => r.data);
export const deleteAdmin  = (id)        => client.delete(`/api/admins/${id}`);

// ── Departments ───────────────────────────────────────────────────────────────
export const getDepartments    = ()        => client.get('/api/departments').then(r => r.data);
export const createDepartment  = (dto)     => client.post('/api/departments', dto).then(r => r.data);
export const updateDepartment  = (id, dto) => client.put(`/api/departments/${id}`, dto).then(r => r.data);
export const deleteDepartment  = (id)      => client.delete(`/api/departments/${id}`);
