// ─── Doctor Service API Client ────────────────────────────────────────────────
// Uses relative URLs — Vite dev proxy forwards them to localhost:8084.

import axios from 'axios';

const BASE = import.meta.env.VITE_DOCTOR_API_URL || '';

const client = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('doctorToken');
  // Alternatively fallback to admin token if admin is managing doctors
  const adminToken = localStorage.getItem('adminToken');
  
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  } else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
  }
  
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function loginDoctor(email, password) {
  const { data } = await client.post('/api/doctors/login', { email, password });
  if (data.token) localStorage.setItem('doctorToken', data.token);
  return data;
}

export function logoutDoctor() {
  localStorage.removeItem('doctorToken');
}

// ── Doctors ───────────────────────────────────────────────────────────────────
export const getDoctors          = ()          => client.get('/api/doctors').then(r => r.data);
export const getDoctorById       = (id)        => client.get(`/api/doctors/${id}`).then(r => r.data);
export const createDoctor        = (dto)       => client.post('/api/doctors', dto).then(r => r.data);
export const updateDoctor        = (id, dto)   => client.put(`/api/doctors/${id}`, dto).then(r => r.data);
export const deleteDoctor        = (id)        => client.delete(`/api/doctors/${id}`);
export const getDoctorsBySpec    = (spec)      => client.get(`/api/doctors/specialization/${spec}`).then(r => r.data);
