import React, { useState, useEffect } from 'react';
import {
    Users,
    MapPin,
    Calendar,
    Plus,
    MoreHorizontal,
    ArrowUpRight,
    TrendingUp
} from 'lucide-react';
import dashboardService from '../../services/dashboardService';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalLocations: 0,
        totalEvents: 0,
        recentUsers: [],
        upcomingEvents: []
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
