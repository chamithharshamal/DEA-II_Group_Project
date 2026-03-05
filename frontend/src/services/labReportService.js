import axios from 'axios';

const BASE_URL = '/api/lab-reports';

const getAuthHeaders = () => {
  const token = localStorage.getItem('labToken');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const labReportService = {
  // Authentication
  login: async (username, password) => {
    const response = await axios.post(`${BASE_URL}/login`, { username, password });
    if (response.data.token) {
      localStorage.setItem('labToken', response.data.token);
      localStorage.setItem('labUser', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('labToken');
    localStorage.removeItem('labUser');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('labToken');
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem('labUser');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  // Lab Report CRUD
  getAllReports: async () => {
    const response = await axios.get(BASE_URL, getAuthHeaders());
    return response.data;
  },

  getReportById: async (reportId) => {
    const response = await axios.get(`${BASE_URL}/${reportId}`, getAuthHeaders());
    return response.data;
  },

  getReportsByStatus: async (status) => {
    const response = await axios.get(`${BASE_URL}/status/${status}`, getAuthHeaders());
    return response.data;
  },

  getReportsByPatient: async (patientId) => {
    const response = await axios.get(`${BASE_URL}/patient/${patientId}`, getAuthHeaders());
    return response.data;
  },

  createReport: async (reportData) => {
    const response = await axios.post(BASE_URL, reportData, getAuthHeaders());
    return response.data;
  },

  updateReport: async (reportId, reportData) => {
    const response = await axios.put(`${BASE_URL}/${reportId}`, reportData, getAuthHeaders());
    return response.data;
  },

  deleteReport: async (reportId) => {
    const response = await axios.delete(`${BASE_URL}/${reportId}`, getAuthHeaders());
    return response.data;
  },

  // Specialized operations
  updateStatus: async (reportId, status) => {
    const response = await axios.patch(`${BASE_URL}/${reportId}/status`, null, {
      params: { status },
      ...getAuthHeaders()
    });
    return response.data;
  },

  submitResults: async (reportId, results, normalRange) => {
    const response = await axios.patch(`${BASE_URL}/${reportId}/results`, null, {
      params: { results, normalRange },
      ...getAuthHeaders()
    });
    return response.data;
  }
};
