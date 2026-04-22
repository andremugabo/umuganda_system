import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
    Users, 
    Calendar, 
    Bell, 
    Target, 
    Heart, 
    Clock,
    UserCircle,
    Zap,
    ArrowRight
} from 'lucide-react';
import { toast } from 'react-toastify';
import Skeleton, { CardSkeleton } from '../../components/ui/Skeleton';

const SocialDashboard = () => {
    const { user } = useSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(true);
    const [socialStats, setSocialStats] = useState({
        vulnerableGroups: 0,
        activeCampaigns: 0,
        newNotifications: 0,
        communityEngagement: 0
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            // Simulate fetching specific social data
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSocialStats({
                vulnerableGroups: 15,
                activeCampaigns: 4,
                newNotifications: 12,
                communityEngagement: 92
            });
        } catch (error) {
            toast.error('Failed to load social statistics');
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
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-[32px] p-8 lg:p-12 text-white shadow-xl shadow-indigo-500/10 relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl lg:text-4xl font-black tracking-tight">Social Welfare Hub</h1>
                    <p className="text-indigo-100 mt-2 font-medium opacity-90 max-w-lg text-lg">
                        Connecting your community. Review new alerts and social welfare campaigns in **{user?.locationName || 'Your Village'}**.
                    </p>
                </div>
                <Heart className="absolute right-[-20px] bottom-[-20px] w-64 h-64 text-white/5" />
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Families Tracked', value: socialStats.vulnerableGroups, icon: Users, color: 'indigo' },
                    { label: 'Social Tasks', value: socialStats.activeCampaigns, icon: Zap, color: 'emerald' },
                    { label: 'New Alerts', value: socialStats.newNotifications, icon: Bell, color: 'red' },
                    { label: 'Engagement', value: `${socialStats.communityEngagement}%`, icon: Heart, color: 'rose' },
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Placeholder for Campaigns */}
                <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                            <Target className="w-5 h-5 text-indigo-600" />
                            Active Social Campaigns
                        </h3>
                        <button className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline flex items-center gap-1">
                            Explore <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 opacity-60">
                            <p className="text-sm font-bold text-gray-500 italic">Campaign tracking module initializing with provincial database.</p>
                        </div>
                    </div>
                </div>

                {/* Helper Card */}
                <div className="bg-slate-900 p-8 rounded-3xl text-white">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-rwanda-yellow">
                            <UserCircle className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-bold">Officer Status</h4>
                            <p className="text-xs text-slate-400">Verified & Active</p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed font-medium">
                        Your role as a Social Welfare Officer involves direct intervention tracking and community health reporting.
                    </p>
                    <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                        <div className="flex items-center gap-3 text-xs text-slate-400 font-bold uppercase tracking-widest">
                            <Clock className="w-4 h-4" />
                            Session Active
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SocialDashboard;
