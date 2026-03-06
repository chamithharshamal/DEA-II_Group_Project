import api from './api'; // Import the team's shared Axios instance

// ── Appointments ──────────────────────────────────────────────────────────────
export const getAllAppointments = () => api.get('/api/appointments').then(r => r.data);

export const getAppointmentsByPatient = (patientId) => api.get(`/api/appointments/patient/${patientId}`).then(r => r.data);

export const getAppointmentsByDoctor = (doctorId) => api.get(`/api/appointments/doctor/${doctorId}`).then(r => r.data);

export const getAppointmentById = (id) => api.get(`/api/appointments/${id}`).then(r => r.data);

export const bookAppointment   = (dto) => api.post('/api/appointments', dto).then(r => r.data);
export const createAppointment = (dto) => api.post('/api/appointments', dto).then(r => r.data); // alias used by AppointmentModal

export const cancelAppointment = (id) => api.patch(`/api/appointments/${id}/cancel`).then(r => r.data);

export const completeAppointment = (id) => api.patch(`/api/appointments/${id}/complete`).then(r => r.data);

export const getTodaysAppointments = (doctorId) => api.get(`/api/appointments/doctor/${doctorId}/today`).then(r => r.data);