import api from './api';

const attendanceService = {
    getAllAttendance: async () => {
        const response = await api.get('/attendance');
        return response.data;
    },

    getAttendanceById: async (id) => {
        const response = await api.get(`/attendance/${id}`);
        return response.data;
    },

    getByUserId: async (userId) => {
        const response = await api.get(`/attendance/user/${userId}`);
        return response.data;
    },

    getByUmugandaId: async (umugandaId) => {
        const response = await api.get(`/attendance/umuganda/${umugandaId}`);
        return response.data;
    },

    createAttendance: async (attendanceData) => {
        const response = await api.post('/attendance', attendanceData);
        return response.data;
    },

    updateAttendance: async (id, attendanceData) => {
        const response = await api.put(`/attendance/${id}`, attendanceData);
        return response.data;
    },

    deleteAttendance: async (id) => {
        await api.delete(`/attendance/${id}`);
    }
};

export default attendanceService;
