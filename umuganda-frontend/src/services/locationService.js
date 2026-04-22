import api from './api';

const locationService = {
    getAllLocations: async () => {
        const response = await api.get('/locations');
        return response.data;
    },

    getLocationById: async (id) => {
        const response = await api.get(`/locations/${id}`);
        return response.data;
    },

    getChildren: async (parentId) => {
        const response = await api.get(`/locations/parent/${parentId}`);
        return response.data;
    },

    getByType: async (type) => {
        const response = await api.get(`/locations/type/${type}`);
        return response.data;
    },

    createLocation: async (locationData) => {
        const response = await api.post('/locations', locationData);
        return response.data;
    },

    updateLocation: async (id, locationData) => {
        const response = await api.put(`/locations/${id}`, locationData);
        return response.data;
    },

    deleteLocation: async (id) => {
        await api.delete(`/locations/${id}`);
    }
};

export default locationService;
