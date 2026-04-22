import api from './api';

const notificationService = {
    getAllNotifications: async () => {
        const response = await api.get('/notifications');
        return response.data;
    },

    getByUserId: async (userId) => {
        const response = await api.get(`/notifications/user/${userId}`);
        return response.data;
    },

    getUnreadByUserId: async (userId) => {
        const response = await api.get(`/notifications/user/${userId}/unread`);
        return response.data;
    },

    markAsRead: async (id) => {
        const notification = await notificationService.getNotificationById(id);
        const response = await api.put(`/notifications/${id}`, {
            ...notification,
            read: true
        });
        return response.data;
    },

    getNotificationById: async (id) => {
        const response = await api.get(`/notifications/${id}`);
        return response.data;
    },

    deleteNotification: async (id) => {
        await api.delete(`/notifications/${id}`);
    }
};

export default notificationService;
