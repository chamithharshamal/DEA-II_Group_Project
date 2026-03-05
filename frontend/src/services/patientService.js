// ─── Patient Service API Client ───────────────────────────────────────────────
// Uses relative URLs — Vite dev proxy forwards them to localhost:8087.
// In production, point VITE_PATIENT_API_URL to the actual gateway/service.

import axios from 'axios';

const BASE = import.meta.env.VITE_PATIENT_API_URL || '';   // empty = relative (proxy)

const client = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT on every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('patientToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Auth ──────────────────────────────────────────────────────────────────────
export async function loginPatient(email, password) {
  const { data } = await client.post('/api/patients/login', { email, password });
  if (data.token) localStorage.setItem('patientToken', data.token);
  return data;
}

export function logoutPatient() {
  localStorage.removeItem('patientToken');
}

// ── Patients ──────────────────────────────────────────────────────────────────
export const getPatients     = ()          => client.get('/api/patients').then(r => r.data);
export const getPatientById  = (id)        => client.get(`/api/patients/${id}`).then(r => r.data);
export const createPatient   = (dto)       => client.post('/api/patients', dto).then(r => r.data);
export const updatePatient   = (id, dto)   => client.put(`/api/patients/${id}`, dto).then(r => r.data);
export const deletePatient   = (id)        => client.delete(`/api/patients/${id}`);
