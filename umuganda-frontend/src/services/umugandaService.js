import api from './api';

const umugandaService = {
    getAllEvents: async () => {
        const response = await api.get('/umuganda');
        return response.data;
    },

    getEventById: async (id) => {
        const response = await api.get(`/umuganda/${id}`);
        return response.data;
    },

    getEventsByLocation: async (locationId) => {
        const response = await api.get(`/umuganda/location/${locationId}`);
        return response.data;
    },

    createEvent: async (eventData) => {
        const response = await api.post('/umuganda', eventData);
        return response.data;
    },

    updateEvent: async (id, eventData) => {
        const response = await api.put(`/umuganda/${id}`, eventData);
        return response.data;
    },

    deleteEvent: async (id) => {
        await api.delete(`/umuganda/${id}`);
    }
};

export default umugandaService;
