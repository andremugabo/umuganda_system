import api from './api';

const authService = {
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    forgotPassword: async (email) => {
        const response = await api.post(`/users/forgot-password?email=${email}`);
        return response.data;
    },

    verifyResetOtp: async (email, otp) => {
        const response = await api.post(`/users/verify-reset-otp?email=${email}&otp=${otp}`);
        return response.data;
    },

    resetPassword: async (email, otp, newPassword) => {
        const response = await api.post(`/users/reset-password?email=${email}&otp=${otp}&newPassword=${newPassword}`);
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post('/users/register', userData);
        return response.data;
    },

    verifyAccount: async (email, otp) => {
        const response = await api.get(`/users/verify?email=${email}&otp=${otp}`);
        return response.data;
    }
};

export default authService;
