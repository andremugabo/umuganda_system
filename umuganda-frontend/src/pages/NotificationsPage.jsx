import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
    Bell, 
    CheckCircle2, 
    Trash2, 
    Filter, 
    Search,
    AlertTriangle,
    Info,
    Calendar,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import notificationService from '../services/notificationService';
import { toast } from 'react-toastify';
import Skeleton, { TableRowSkeleton } from '../components/ui/Skeleton';

const NotificationsPage = () => {
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unread, critical
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user?.id) {
            fetchNotifications();
        }
    }, [user]);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const data = await notificationService.getByUserId(user.id);
            setNotifications(data);
        } catch (error) {
            toast.error("Failed to load notifications");
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
        } catch (error) {
            toast.error("Failed to update notification");
        }
    };

    const handleMarkAllRead = async () => {
        try {
            // Bulk update logic would go here
            toast.success("All notifications marked as read");
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (error) {
            toast.error("Operation failed");
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'CRITICAL': return <AlertTriangle className="w-5 h-5 text-red-500" />;
            case 'SUCCESS': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
            default: return <Info className="w-5 h-5 text-blue-500" />;
        }
    };

    const filteredNotifications = notifications.filter(n => {
        const matchesFilter = filter === 'all' || (filter === 'unread' && !n.read) || (filter === 'critical' && n.type === 'CRITICAL');
        const matchesSearch = n.message.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-400" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight">Notification Center</h1>
                        <p className="text-gray-500 mt-1 font-medium">Manage your updates and alerts.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-2 px-6 py-3 bg-rwanda-blue text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        Mark All as Read
                    </button>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                {/* Search & Filter Bar */}
                <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/30">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search notifications..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border-2 border-gray-100 rounded-2xl focus:border-rwanda-blue transition-all outline-none text-sm font-medium"
                        />
                    </div>
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                        {['all', 'unread', 'critical'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                                    filter === f 
                                    ? 'bg-white text-rwanda-blue shadow-sm' 
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* List */}
                <div className="divide-y divide-gray-50">
                    {isLoading ? (
                        Array(6).fill(0).map((_, i) => <TableRowSkeleton key={i} />)
                    ) : filteredNotifications.length > 0 ? (
                        filteredNotifications.map((n) => (
                            <div 
                                key={n.id} 
                                className={`group flex items-start gap-4 p-6 transition-all hover:bg-blue-50/30 ${!n.read ? 'bg-blue-50/50' : ''}`}
                            >
                                <div className={`p-3 rounded-2xl shadow-sm bg-white border border-gray-50 group-hover:scale-110 transition-transform`}>
                                    {getIcon(n.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-4 mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${!n.read ? 'bg-rwanda-blue animate-pulse' : 'bg-transparent'}`} />
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(n.date).toLocaleDateString()} at {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        {!n.read && (
                                            <button 
                                                onClick={() => handleMarkAsRead(n.id)}
                                                className="text-[10px] font-black text-rwanda-blue hover:underline uppercase tracking-widest"
                                            >
                                                Mark as Read
                                            </button>
                                        )}
                                    </div>
                                    <p className={`text-base leading-relaxed ${!n.read ? 'font-bold text-gray-900' : 'text-gray-600 font-medium'}`}>
                                        {n.message}
                                    </p>
                                </div>
                                <button className="p-2 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 transition-all rounded-lg hover:bg-red-50">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="py-20 flex flex-col items-center justify-center text-center">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                                <Bell className="w-10 h-10 text-gray-200" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">No notifications found</h3>
                            <p className="text-gray-500 mt-2 max-w-xs font-medium">We couldn't find any notifications matching your current filters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;
