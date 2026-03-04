import axios from 'axios';

// Create an Axios instance
const apiClient = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
});

// Intercept requests to add the JWT token
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('pharmacistToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const pharmacyService = {
    // Auth
    loginPharmacist: async (credentials) => {
        const response = await axios.post('/api/pharmacists/login', credentials);
        return response.data;
    },

    // Medications
    getMedications: async () => {
        const response = await apiClient.get('/api/medications');
        return response.data;
    },
    getMedicationById: async (id) => {
        const response = await apiClient.get(`/api/medications/${id}`);
        return response.data;
    },
    searchMedications: async (name) => {
        const response = await apiClient.get(`/api/medications/search`, { params: { name } });
        return response.data;
    },
    addMedication: async (medication) => {
        const response = await apiClient.post('/api/medications', medication);
        return response.data;
    },
    updateMedication: async (id, medication) => {
        const response = await apiClient.put(`/api/medications/${id}`, medication);
        return response.data;
    },
    deleteMedication: async (id) => {
        const response = await apiClient.delete(`/api/medications/${id}`);
        return response.data;
    },
    updateStock: async (id, quantity) => {
        const response = await apiClient.put(`/api/medications/${id}/stock`, null, { params: { quantity } });
        return response.data;
    },
    getLowStock: async (threshold = 10) => {
        const response = await apiClient.get('/api/medications/low-stock', { params: { threshold } });
        return response.data;
    },

    // Prescriptions
    getPrescriptions: async () => {
        const response = await apiClient.get('/api/prescriptions');
        return response.data;
    },
    getPrescriptionById: async (id) => {
        const response = await apiClient.get(`/api/prescriptions/${id}`);
        return response.data;
    },
    getPrescriptionsByPatient: async (patientId) => {
        const response = await apiClient.get(`/api/prescriptions/patient/${patientId}`);
        return response.data;
    },
    getPendingPrescriptions: async (patientId) => {
        const response = await apiClient.get(`/api/prescriptions/patient/${patientId}/pending`);
        return response.data;
    },
    createPrescription: async (prescription) => {
        const response = await apiClient.post('/api/prescriptions', prescription);
        return response.data;
    },
    dispensePrescription: async (id) => {
        const response = await apiClient.post(`/api/prescriptions/${id}/dispense`);
        return response.data;
    }
};

export default pharmacyService;
