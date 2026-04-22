import axios from 'axios';

const api = axios.create({
    baseURL: 'https://umuganda-backend-k32m.onrender.com/api', // Adjust if you have a proxy or different backend URL
    // baseURL: 'http://localhost:9090/api', // Adjust if you have a proxy or different backend URL
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
