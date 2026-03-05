import axios from 'axios';

const API_URL = '/api/billings';

// Setup axios instance with dynamic token retrieval
const billingApiClient = axios.create({
    baseURL: API_URL
});

billingApiClient.interceptors.request.use((config) => {
    // Assuming admin or other authed user
    const token = localStorage.getItem('token'); 
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const billingService = {
    // Get all billings
    getAllBillings: async () => {
        const response = await billingApiClient.get('');
        return response.data;
    },

    // Get billing by ID
    getBillingById: async (billingId) => {
        const response = await billingApiClient.get(`/${billingId}`);
        return response.data;
    },

    // Create new billing
    createBilling: async (billingData) => {
        const response = await billingApiClient.post('', billingData);
        return response.data;
    },

    // Update existing billing
    updateBilling: async (billingId, billingData) => {
        const response = await billingApiClient.put(`/${billingId}`, billingData);
        return response.data;
    },

    // Delete a billing
    deleteBilling: async (billingId) => {
        const response = await billingApiClient.delete(`/${billingId}`);
        return response.data;
    },

    // Get billings by patient ID
    getBillingsByPatientId: async (patientId) => {
        const response = await billingApiClient.get(`/patient/${patientId}`);
        return response.data;
    },

    // Get billings by doctor ID
    getBillingsByDoctorId: async (doctorId) => {
        const response = await billingApiClient.get(`/doctor/${doctorId}`);
        return response.data;
    },

    // Get billings by appointment ID
    getBillingsByAppointmentId: async (appointmentId) => {
        const response = await billingApiClient.get(`/appointment/${appointmentId}`);
        return response.data;
    },

    // Get billings by status (PENDING, PAID, etc)
    getBillingsByPaymentStatus: async (paymentStatus) => {
        const response = await billingApiClient.get(`/status/${paymentStatus}`);
        return response.data;
    },

    // Update payment status directly
    updatePaymentStatus: async (billingId, paymentStatus) => {
        // According to backend: @PatchMapping("/{billingId}/status") ... @RequestParam String paymentStatus
        const response = await billingApiClient.patch(`/${billingId}/status`, null, {
            params: { paymentStatus }
        });
        return response.data;
    },

    // Calculate total amount via backend logic
    calculateTotalAmount: async (consultationFee, labTestFee, medicationFee, otherFee) => {
        const response = await billingApiClient.post('/calculate', null, {
            params: {
                consultationFee,
                labTestFee,
                medicationFee,
                otherFee
            }
        });
        return response.data;
    }
};

export default billingService;
