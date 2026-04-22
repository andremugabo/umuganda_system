import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    CheckCircle,
    Clock,
    MapPin,
    Calendar,
    Bell,
    ArrowRight,
    UserCheck,
    UserX,
    TrendingUp,
    Loader2,
    CalendarDays,
    Target
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    RadialBarChart,
    RadialBar,
} from 'recharts';
import umugandaService from '../../services/umugandaService';
import attendanceService from '../../services/attendanceService';
import notificationService from '../../services/notificationService';
import locationService from '../../services/locationService';
import { toast } from 'react-toastify';


const VillagerDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [recentAttendance, setRecentAttendance] = useState([]);
    const [unreadNotifications, setUnreadNotifications] = useState([]);
    const [locationMap, setLocationMap] = useState({});
    const [stats, setStats] = useState({
        totalEvents: 0,
        attendedCount: 0,
        attendanceRate: 0,
        upcomingCount: 0
    });
    const [attendanceHistory, setAttendanceHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        if (user?.id && user?.locationId) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);

            // Fetch all data in parallel
            const [eventsData, attendanceData, notificationsData, locationData] = await Promise.all([
                umugandaService.getEventsByLocation(user.locationId),
                attendanceService.getByUserId(user.id),
                notificationService.getUnreadByUserId(user.id),
                locationService.getAllLocations()
            ]);

            // Build location map
            const lookup = {};
            locationData.forEach(loc => lookup[loc.id] = loc);
            const map = {};
            locationData.forEach(loc => {
                const parts = [];
                let curr = loc;
                while (curr) {
                    parts.unshift(curr.name);
                    curr = lookup[curr.parentId];
                }
                map[loc.id] = parts.join(' > ');
            });
            setLocationMap(map);

            // Filter upcoming events (future dates)
            const now = new Date();
            const upcoming = eventsData
                .filter(event => new Date(event.date) > now)
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .slice(0, 3);
            setUpcomingEvents(upcoming);

            // Get recent attendance (last 5)
            const recent = attendanceData
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .slice(0, 5);
            setRecentAttendance(recent);

            // Set notifications
            setUnreadNotifications(notificationsData.slice(0, 3));

            // Calculate statistics
            const attendedCount = attendanceData.filter(a => a.attendance === 'ATTENDED').length;
            const totalEvents = attendanceData.length;
            const attendanceRate = totalEvents > 0 ? Math.round((attendedCount / totalEvents) * 100) : 0;

            setStats({
                totalEvents,
                attendedCount,
                attendanceRate,
                upcomingCount: upcoming.length
            });

            // Process attendance trend (last 6 months)
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const currentMonth = new Date().getMonth();
            const trend = [];
            for (let i = 5; i >= 0; i--) {
                const m = (currentMonth - i + 12) % 12;
                trend.push({ name: months[m], attended: 0, total: 0 });
            }

            attendanceData.forEach(a => {
                const date = a.createdAt ? new Date(a.createdAt) : new Date(); // Fallback to now if missing
                const monthName = months[date.getMonth()];
                const point = trend.find(p => p.name === monthName);
                if (point) {
                    point.total++;
                    if (a.attendance === 'ATTENDED') point.attended++;
                }
            });
            setAttendanceHistory(trend);


        } catch (error) {
            toast.error('Failed to load dashboard data');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getAttendanceColor = (status) => {
        switch (status) {
            case 'ATTENDED': return 'text-green-600 bg-green-50';
            case 'ABSENT': return 'text-red-600 bg-red-50';
            case 'EXCUSED': return 'text-amber-600 bg-amber-50';
            default: return 'text-gray-600 bg-gray-50';
        }
    };

    const getAttendanceIcon = (status) => {
        switch (status) {
            case 'ATTENDED': return <UserCheck className="w-4 h-4" />;
            case 'ABSENT': return <UserX className="w-4 h-4" />;
            default: return <Clock className="w-4 h-4" />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-12 h-12 text-rwanda-blue animate-spin" />
                <p className="text-gray-500 font-medium">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Banner */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rwanda-blue to-blue-700 p-8 lg:p-12 text-white shadow-xl shadow-blue-500/20">
                <div className="relative z-10">
                    <h1 className="text-3xl lg:text-4xl font-bold">Muraho, {user?.firstName}! 👋</h1>
                    <p className="text-blue-100 mt-2 text-lg max-w-xl opacity-90">
                        Welcome to your Umuganda portal. Stay updated with your community activities and track your participation.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-4">
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                            <p className="text-xs text-blue-200 font-medium uppercase tracking-wider">Attendance Rate</p>
                            <p className="text-2xl font-bold mt-1">
                                {stats.attendanceRate}%
                                <span className="text-sm font-normal text-blue-200 ml-2">
                                    {stats.attendanceRate >= 80 ? 'Excellent' : stats.attendanceRate >= 60 ? 'Good' : 'Needs Improvement'}
                                </span>
                            </p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                            <p className="text-xs text-blue-200 font-medium uppercase tracking-wider">Total Participated</p>
                            <p className="text-2xl font-bold mt-1">{stats.attendedCount} <span className="text-sm font-normal text-blue-200">Events</span></p>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20">
                            <p className="text-xs text-blue-200 font-medium uppercase tracking-wider">Upcoming</p>
                            <p className="text-2xl font-bold mt-1">{stats.upcomingCount} <span className="text-sm font-normal text-blue-200">Events</span></p>
                        </div>
                    </div>
                </div>
                {/* Decorative Circles */}
                <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[-20%] left-[20%] w-48 h-48 bg-rwanda-yellow/20 rounded-full blur-3xl" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming Umuganda Events */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-800">Upcoming Community Work</h2>
                        <button
                            onClick={() => navigate('/villager/umuganda')}
                            className="text-rwanda-blue text-sm font-bold flex items-center gap-1 hover:underline"
                        >
                            View All <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {upcomingEvents.length > 0 ? (
                            upcomingEvents.map((event) => {
                                const eventDate = new Date(event.date);
                                return (
                                    <div key={event.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex items-start gap-6">
                                            <div className="flex-shrink-0 w-16 h-16 bg-rwanda-green/10 rounded-2xl flex flex-col items-center justify-center text-rwanda-green">
                                                <span className="text-xs font-bold uppercase">{eventDate.toLocaleDateString('en-US', { month: 'short' })}</span>
                                                <span className="text-2xl font-black">{eventDate.getDate()}</span>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-gray-400 text-xs flex items-center gap-1">
                                                        <Clock className="w-3 h-3" /> {formatTime(event.date)}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-rwanda-blue transition-colors">
                                                    {event.description}
                                                </h3>
                                                <div className="flex items-center gap-4 mt-3 text-gray-500 text-sm">
                                                    <span className="flex items-center gap-1.5 font-medium">
                                                        <MapPin className="w-4 h-4 text-rwanda-blue" /> {locationMap[event.locationId] || 'Your Village'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
                                <Calendar className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                                <h4 className="text-lg font-bold text-gray-800">No upcoming events</h4>
                                <p className="text-gray-500 mt-2">Check back soon for newly planned activities.</p>
                            </div>
                        )}
                    </div>

                    {/* Recent Attendance History */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-800">Recent Attendance</h3>
                            <button
                                onClick={() => navigate('/villager/attendance')}
                                className="text-rwanda-blue text-sm font-bold hover:underline"
                            >
                                View All
                            </button>
                        </div>
                        <div className="space-y-3">
                            {recentAttendance.length > 0 ? (
                                recentAttendance.map((record) => (
                                    <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-gray-800">{record.eventDescription || 'Umuganda Event'}</p>
                                            <p className="text-xs text-gray-400 mt-0.5">Date unavailable</p>
                                        </div>
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs ${getAttendanceColor(record.attendance)}`}>
                                            {getAttendanceIcon(record.attendance)}
                                            {record.attendance}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 text-center py-4">No attendance records yet</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Side Actions & Stats */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>

                    {/* Attendance Analysis */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                        <div className="bg-gradient-to-r from-rwanda-blue to-blue-600 p-6 text-white">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold">Attendance Analytics</h3>
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                                    <Target className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="h-40 flex items-center justify-center relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadialBarChart 
                                        cx="50%" 
                                        cy="50%" 
                                        innerRadius="60%" 
                                        outerRadius="100%" 
                                        barSize={10} 
                                        data={[{ name: 'Rate', value: stats.attendanceRate, fill: '#FFFFFF' }]}
                                        startAngle={180}
                                        endAngle={0}
                                    >
                                        <RadialBar
                                            minAngle={15}
                                            background={{ fill: 'rgba(255,255,255,0.1)' }}
                                            clockWise
                                            dataKey="value"
                                            cornerRadius={5}
                                        />
                                    </RadialBarChart>
                                </ResponsiveContainer>
                                <div className="absolute inset-x-0 bottom-8 flex flex-col items-center">
                                    <span className="text-3xl font-black">{stats.attendanceRate}%</span>
                                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Goal Reached</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-400 font-bold uppercase">Total Events</p>
                                    <p className="text-xl font-black text-gray-800">{stats.totalEvents}</p>
                                </div>
                                <div className="h-10 w-1 bg-gray-200 rounded-full" />
                                <div className="text-right">
                                    <p className="text-xs text-gray-400 font-bold uppercase">Participated</p>
                                    <p className="text-xl font-black text-rwanda-blue">{stats.attendedCount}</p>
                                </div>
                            </div>

                            <div className="h-48 w-full pt-4">
                                <p className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-tighter">Participation Trend</p>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={attendanceHistory}>
                                        <defs>
                                            <linearGradient id="colorAttended" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#00A3E0" stopOpacity={0.3} />
                                                <stop offset="95%" stopColor="#00A3E0" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                        <XAxis 
                                            dataKey="name" 
                                            axisLine={false} 
                                            tickLine={false} 
                                            tick={{fill: '#94A3B8', fontSize: 10}}
                                        />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
                                        />
                                        <Area 
                                            type="monotone" 
                                            dataKey="attended" 
                                            stroke="#00A3E0" 
                                            strokeWidth={2}
                                            fillOpacity={1} 
                                            fill="url(#colorAttended)" 
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>


                    {/* Notifications Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center justify-between">
                            Recent Notifications
                            {unreadNotifications.length > 0 && (
                                <span className="bg-rwanda-yellow text-[10px] font-black px-2 py-0.5 rounded-full">
                                    {unreadNotifications.length} NEW
                                </span>
                            )}
                        </h3>
                        <div className="space-y-4">
                            {unreadNotifications.length > 0 ? (
                                unreadNotifications.map((notification) => (
                                    <div key={notification.id} className="flex gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                            <Bell className="w-4 h-4 text-rwanda-blue" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-800 leading-tight line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1 font-medium italic">
                                                {new Date(notification.date).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400 text-center py-4">No new notifications</p>
                            )}
                        </div>
                        {unreadNotifications.length > 0 && (
                            <button
                                onClick={() => navigate('/villager/notifications')}
                                className="w-full mt-4 text-rwanda-blue text-sm font-bold hover:underline"
                            >
                                View All Notifications
                            </button>
                        )}
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/villager/umuganda')}
                            className="w-full bg-rwanda-blue text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/10 flex items-center justify-center gap-2"
                        >
                            <CalendarDays className="w-5 h-5" />
                            View All Events
                        </button>
                        <button
                            onClick={() => navigate('/villager/attendance')}
                            className="w-full bg-white border-2 border-rwanda-blue text-rwanda-blue py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-2"
                        >
                            <CheckCircle className="w-5 h-5" />
                            My Attendance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VillagerDashboard;
