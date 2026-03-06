import axios from 'axios';

// The appointment-service runs on 8086, we will proxy `/api/appointments` to it in Vite config
const client = axios.create({
  baseURL: import.meta.env.VITE_APPOINTMENT_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

// Since patients/guests book appointments, we optionally attach a token
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('patientToken') || localStorage.getItem('adminToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const createAppointment = async (dto) => {
  const { data } = await client.post('/api/appointments', dto);
  return data;
};

export const getAppointments = async () => {
    const { data } = await client.get('/api/appointments');
    return data;
}
