// ─── Staff Service API Client ─────────────────────────────────────────────────
// Uses relative URLs — Vite dev proxy forwards them to localhost:8089.

import axios from 'axios';

const client = axios.create({
  baseURL: '', // Using relative URLs to trigger Vite proxy
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
client.interceptors.request.use((config) => {
  // Using adminToken since staff management is typically an admin function
  const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Get all staff members
 */
export const getStaff = () => client.get('/api/staff').then(r => r.data);

/**
 * Get a single staff member by ID
 */
export const getStaffById = (id) => client.get(`/api/staff/${id}`).then(r => r.data);

/**
 * Create a new staff member
 */
export const createStaff = (dto) => client.post('/api/staff', dto).then(r => r.data);

/**
 * Update an existing staff member
 */
export const updateStaff = (id, dto) => client.put(`/api/staff/${id}`, dto).then(r => r.data);

/**
 * Delete a staff member
 */
export const deleteStaff = (id) => client.delete(`/api/staff/${id}`);

/**
 * Assign a shift to a staff member
 */
export const assignShift = (dto) => client.post('/api/staff/shifts', dto).then(r => r.data);

/**
 * Get shifts for a specific staff member
 */
export const getShiftsByStaff = (id) => client.get(`/api/staff/${id}/shifts`).then(r => r.data);

/**
 * Get shifts for a specific date
 */
export const getShiftsByDate = (date) => client.get('/api/staff/shifts', { params: { date } }).then(r => r.data);
