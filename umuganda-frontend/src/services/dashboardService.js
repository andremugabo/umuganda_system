import api from './api';

const dashboardService = {
    // Admin Stats
    getAdminStats: async () => {
        const [users, locations, events] = await Promise.all([
            api.get('/users'),
            api.get('/locations'),
            api.get('/umuganda')
        ]);

        return {
            totalUsers: users.data.length,
            totalLocations: locations.data.length,
            totalEvents: events.data.length,
            recentUsers: users.data.slice(0, 5),
            upcomingEvents: events.data.slice(0, 5)
        };
    },

    // Villager Stats
    getVillagerDashboard: async (userId, locationId) => {
        const requests = [
            api.get(`/attendance/user/${userId}`),
            api.get(`/notifications/user/${userId}/unread`)
        ];

        if (locationId) {
            requests.push(api.get(`/umuganda/location/${locationId}`));
        }

        const [attendance, notifications, events] = await Promise.all(requests);

        return {
            attendanceCount: attendance.data.length,
            unreadNotifications: notifications.data.length,
            upcomingEvents: events ? events.data : [],
            recentAttendance: attendance.data.slice(0, 5)
        };
    }
};

export default dashboardService;
