import {
    LayoutDashboard,
    Users,
    MapPin,
    Calendar,
    CheckSquare,
    Bell,
    BarChart,
    UserCircle
} from 'lucide-react';

export const sidebarConfig = {
    ADMIN: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Users', path: '/admin/users', icon: Users },
        { label: 'Locations', path: '/admin/locations', icon: MapPin },
        { label: 'Umuganda Events', path: '/admin/umuganda', icon: Calendar },
        { label: 'Attendance', path: '/admin/attendance', icon: CheckSquare },
        { label: 'Notifications', path: '/admin/notifications', icon: Bell },
        { label: 'Profile', path: '/admin/profile', icon: UserCircle },
    ],
    VILLAGE_CHEF: [
        { label: 'Dashboard', path: '/chef/dashboard', icon: LayoutDashboard },
        { label: 'Village Users', path: '/chef/users', icon: Users },
        { label: 'Umuganda Events', path: '/chef/umuganda', icon: Calendar },
        { label: 'Attendance Management', path: '/chef/attendance', icon: CheckSquare },
        { label: 'Village Reports', path: '/chef/reports', icon: BarChart },
        { label: 'Profile', path: '/chef/profile', icon: UserCircle },
    ],
    VILLAGE_SOCIAL: [
        { label: 'Dashboard', path: '/social/dashboard', icon: LayoutDashboard },
        { label: 'Umuganda Events', path: '/social/umuganda', icon: Calendar },
        { label: 'Attendance Tracking', path: '/social/attendance', icon: CheckSquare },
        { label: 'Notifications', path: '/social/notifications', icon: Bell },
        { label: 'Profile', path: '/social/profile', icon: UserCircle },
    ],
    VILLAGER: [
        { label: 'Dashboard', path: '/villager/dashboard', icon: LayoutDashboard },
        { label: 'Upcoming Umuganda', path: '/villager/umuganda', icon: Calendar },
        { label: 'My Attendance', path: '/villager/attendance', icon: CheckSquare },
        { label: 'Profile', path: '/villager/profile', icon: UserCircle },
        { label: 'Notifications', path: '/villager/notifications', icon: Bell },
    ],
};
