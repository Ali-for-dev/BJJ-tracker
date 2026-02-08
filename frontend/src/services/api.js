import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.51:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data)
};

// User API
export const userAPI = {
    getProfile: () => api.get('/users/profile'),
    updateProfile: (data) => api.put('/users/profile', data)
};

// Training API
export const trainingAPI = {
    getAll: () => api.get('/trainings'),
    getOne: (id) => api.get(`/trainings/${id}`),
    create: (data) => api.post('/trainings', data),
    update: (id, data) => api.put(`/trainings/${id}`, data),
    delete: (id) => api.delete(`/trainings/${id}`),
    getStats: () => api.get('/trainings/stats')
};

// Technique API
export const techniqueAPI = {
    getAll: (params) => api.get('/techniques', { params }),
    getOne: (id) => api.get(`/techniques/${id}`),
    create: (data) => api.post('/techniques', data),
    update: (id, data) => api.put(`/techniques/${id}`, data),
    delete: (id) => api.delete(`/techniques/${id}`)
};

// Competition API
export const competitionAPI = {
    getAll: (params) => api.get('/competitions', { params }),
    getOne: (id) => api.get(`/competitions/${id}`),
    create: (data) => api.post('/competitions', data),
    update: (id, data) => api.put(`/competitions/${id}`, data),
    delete: (id) => api.delete(`/competitions/${id}`)
};

// Stats API
export const statsAPI = {
    getOverview: () => api.get('/stats/overview'),
    getTrainingFrequency: (period) => api.get('/stats/training-frequency', { params: { period } }),
    getTechniquesMastery: () => api.get('/stats/techniques-mastery'),
    getCompetitionPerformance: () => api.get('/stats/competition-performance'),
    getTechniqueCategories: () => api.get('/stats/technique-categories'),
    getBeltProgression: () => api.get('/stats/belt-progression')
};

export default api;
