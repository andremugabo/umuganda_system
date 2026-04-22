import React, { useState, useEffect } from 'react';
import {

    Users,
    MapPin,
    Calendar,
    Plus,
    MoreHorizontal,
    ArrowUpRight,
    TrendingUp,
    PieChart as PieIcon,
    LineChart as LineIcon,
} from 'lucide-react';
import {
    ResponsiveContainer,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';
import dashboardService from '../../services/dashboardService';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalLocations: 0,
        totalEvents: 0,
        recentUsers: [],
        upcomingEvents: [],
        allUsers: [],
        allEvents: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await dashboardService.getAdminStats();
                setStats(data);
            } catch (error) {
                toast.error("Failed to load dashboard data");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchStats();
    }, []);

    // Process data for charts
    const getRoleDistribution = () => {
        const counts = {};
        stats.allUsers.forEach(u => {
            counts[u.role] = (counts[u.role] || 0) + 1;
        });
        return Object.keys(counts).map(role => ({
            name: role.replace('_', ' '),
            value: counts[role]
        }));
    };

    const getRegistrationTrend = () => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();
        
        // Initialize last 6 months
        const trendData = [];
        for (let i = 5; i >= 0; i--) {
            const m = (currentMonth - i + 12) % 12;
            trendData.push({ name: months[m], count: 0 });
        }

        stats.allUsers.forEach(u => {
            if (u.createdAt) {
                const date = new Date(u.createdAt);
                const monthName = months[date.getMonth()];
                const dataPoint = trendData.find(d => d.name === monthName);
                if (dataPoint) dataPoint.count++;
            }
        });

        // If no data yet, provide some baseline for visualization if it's a new system
        if (stats.allUsers.length > 0 && trendData.every(d => d.count === 0)) {
            trendData[5].count = stats.allUsers.length;
        }

        return trendData;
    };

    const COLORS = ['#00A3E0', '#007A33', '#FAD201', '#EF3340', '#722F37'];

    const statCards = [

        { label: 'Total Citizens', value: stats.totalUsers, icon: Users, color: 'text-rwanda-blue', bg: 'bg-rwanda-blue/10', trend: '+12%' },
        { label: 'Registered Locations', value: stats.totalLocations, icon: MapPin, color: 'text-rwanda-green', bg: 'bg-rwanda-green/10', trend: '+3%' },
        { label: 'Umuganda Planned', value: stats.totalEvents, icon: Calendar, color: 'text-rwanda-yellow', bg: 'bg-rwanda-yellow/10', trend: '+5%' },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rwanda-blue"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Welcome Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Overview</h1>
                    <p className="text-gray-500 mt-1">Monitor all national activities and users across Rwanda.</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-rwanda-blue text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 font-semibold active:scale-95">
                    <Plus className="w-5 h-5" />
                    Plan New Umuganda
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((card, idx) => {
                    const Icon = card.icon;
                    return (
                        <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`${card.bg} p-3 rounded-xl`}>
                                    <Icon className={`w-6 h-6 ${card.color}`} />
                                </div>
                                <div className="flex items-center gap-1 text-green-500 bg-green-50 px-2 py-1 rounded-full text-xs font-bold">
                                    <TrendingUp className="w-3 h-3" />
                                    {card.trend}
                                </div>
                            </div>
                            <p className="text-gray-500 text-sm font-medium">{card.label}</p>
                            <div className="flex items-end justify-between mt-1">
                                <h3 className="text-3xl font-bold text-gray-900">{card.value}</h3>
                                <ArrowUpRight className="w-5 h-5 text-gray-300 group-hover:text-rwanda-blue transition-colors" />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Registration Trend */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Registration Trend</h3>
                            <p className="text-sm text-gray-500">Citizen enrollment over the last 6 months</p>
                        </div>
                        <div className="p-2 bg-blue-50 rounded-xl">
                            <LineIcon className="w-5 h-5 text-rwanda-blue" />
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={getRegistrationTrend()}>
                                <defs>
                                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#00A3E0" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#00A3E0" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94A3B8', fontSize: 12}}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#94A3B8', fontSize: 12}}
                                />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area 
                                    type="monotone" 
                                    dataKey="count" 
                                    stroke="#00A3E0" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorCount)" 
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Role Distribution */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">User Roles</h3>
                            <p className="text-sm text-gray-500">Breakdown of system users by role</p>
                        </div>
                        <div className="p-2 bg-green-50 rounded-xl">
                            <PieIcon className="w-5 h-5 text-rwanda-green" />
                        </div>
                    </div>
                    <div className="h-[300px] w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={getRoleDistribution()}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {getRoleDistribution().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip 
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent Users Table */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="font-bold text-gray-800 text-lg">Newest Citizens</h2>
                        <button className="text-rwanda-blue hover:text-blue-700 text-sm font-bold flex items-center gap-1">
                            View All
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider font-semibold">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Email</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {stats.recentUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-gray-700">{user.firstName} {user.lastName}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500 text-sm">{user.email}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Upcoming Events */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-bold text-gray-800 text-lg">Upcoming Umuganda</h2>
                        <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400">
                            <MoreHorizontal className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="space-y-4">
                        {stats.upcomingEvents.length > 0 ? (
                            stats.upcomingEvents.map((event) => (
                                <div key={event.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 hover:border-rwanda-blue/20 hover:bg-gray-50/30 transition-all cursor-pointer">
                                    <div className="w-12 h-12 rounded-xl bg-rwanda-yellow/10 flex flex-col items-center justify-center text-rwanda-yellow leading-tight">
                                        <span className="text-[10px] font-bold uppercase">Oct</span>
                                        <span className="text-lg font-black">28</span>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-800 text-sm">{event.title || "Monthly Community Work"}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5">{event.description?.substring(0, 40) || "Clean-up and gardening in the sector."}...</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="px-2 py-1 rounded-lg bg-green-50 text-green-600 text-[10px] font-bold">Planned</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8">
                                <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-2" />
                                <p className="text-gray-400 text-sm">No upcoming events planned.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
