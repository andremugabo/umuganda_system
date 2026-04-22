import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://umuganda-backend-k32m.onrender.com/api',
    // fallback to Render URL for convenience, but configurable via VITE_API_BASE_URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token if it exists
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
