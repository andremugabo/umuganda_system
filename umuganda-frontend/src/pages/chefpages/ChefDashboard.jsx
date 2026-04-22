import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
    Users, 
    Calendar, 
    CheckSquare, 
    TrendingUp, 
    MapPin, 
    Clock,
    UserCheck,
    BarChart3,
    ArrowRight
} from 'lucide-react';
import umugandaService from '../../services/umugandaService';
import locationService from '../../services/locationService';
import { toast } from 'react-toastify';
import Skeleton, { CardSkeleton } from '../../components/ui/Skeleton';

const ChefDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [villageStats, setVillageStats] = useState({
        totalCitizens: 0,
        activeEvents: 0,
        pendingReports: 0,
        overallAttendance: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            // Simulate fetching specific village data
            await new Promise(resolve => setTimeout(resolve, 1000));
            setVillageStats({
                totalCitizens: 124,
                activeEvents: 3,
                pendingReports: 1,
                overallAttendance: 85
            });
        } catch (error) {
            toast.error('Failed to load village statistics');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-8 animate-in fade-in duration-500">
                <Skeleton className="h-48 rounded-3xl w-full" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <CardSkeleton /> <CardSkeleton /> <CardSkeleton /> <CardSkeleton />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header / Banner */}
            <div className="bg-gradient-to-br from-rwanda-blue to-blue-700 rounded-[32px] p-8 lg:p-12 text-white shadow-xl shadow-blue-500/10 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Chef's Console</h1>
                    <p className="text-blue-100 mt-2 font-medium opacity-90 max-w-lg text-lg">
                        Managing **{user?.locationName || 'Village'}**. Monitor your community's progress and attendance records.
                    </p>
                </div>
                <Users className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/5" />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Citizens', value: villageStats.totalCitizens, icon: Users, color: 'blue' },
                    { label: 'Active Events', value: villageStats.activeEvents, icon: Calendar, color: 'emerald' },
                    { label: 'Reports Pending', value: villageStats.pendingReports, icon: BarChart3, color: 'amber' },
                    { label: 'Attendance Rate', value: `${villageStats.overallAttendance}%`, icon: UserCheck, color: 'indigo' },
                ].map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                            <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center text-${stat.color}-600 mb-4 group-hover:scale-110 transition-transform`}>
                                <Icon className="w-6 h-6" />
                            </div>
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                            <p className="text-3xl font-black text-gray-900 mt-1">{stat.value}</p>
                        </div>
                    );
                })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Placeholder for Village Activity */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-rwanda-blue" />
                            Village Activities
                        </h3>
                        <button className="text-rwanda-blue text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1">
                            Full Calendar <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 opacity-60">
                            <p className="text-sm font-bold text-gray-500 italic">Village-level activity module coming soon in next update.</p>
                        </div>
                    </div>
                </div>

                {/* Placeholder for Community Health */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-3xl text-white shadow-xl shadow-slate-900/10">
                    <h3 className="text-xl font-bold flex items-center gap-3">
                        <TrendingUp className="w-5 h-5 text-rwanda-green" />
                        Community Insights
                    </h3>
                    <p className="text-slate-400 text-sm mt-2 font-medium">Strategic overview of your village's participation trends.</p>
                    
                    <div className="mt-12 space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-4">
                                <CheckSquare className="w-5 h-5 text-rwanda-blue" />
                                <span className="font-bold">Last Umuganda Success</span>
                            </div>
                            <span className="text-rwanda-green font-black">+12%</span>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium italic">
                            Integrated village analytics engine is currently synchronizing with the national registry.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChefDashboard;
