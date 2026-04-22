import React, { useState, useEffect } from 'react';
import Pagination from '../components/ui/Pagination';
import { Bell, Check, CheckCheck, Trash2, Loader2, Filter } from 'lucide-react';
import notificationService from '../services/notificationService';
import { toast } from 'react-toastify';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('ALL'); // ALL, UNREAD, READ

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        fetchNotifications();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [filter, notifications]);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            if (!currentUser.id) return;
            const data = await notificationService.getByUserId(currentUser.id);
            setNotifications(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
        } catch (error) {
            toast.error('Failed to load notifications');
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilter = () => {
        let filtered = notifications;
        if (filter === 'UNREAD') {
            filtered = notifications.filter(n => !n.read);
        } else if (filter === 'READ') {
            filtered = notifications.filter(n => n.read);
        }
        setFilteredNotifications(filtered);
        setCurrentPage(1); // Reset to first page on filter change
    };

    // Calculate pagination slice
    const paginatedNotifications = filteredNotifications.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            toast.success('Marked as read');
            fetchNotifications();
        } catch (error) {
            toast.error('Failed to mark as read');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const unread = notifications.filter(n => !n.read);
            await Promise.all(unread.map(n => notificationService.markAsRead(n.id)));
            toast.success('All notifications marked as read');
            fetchNotifications();
        } catch (error) {
            toast.error('Failed to mark all as read');
        }
    };

    const handleDelete = async (id) => {
        try {
            await notificationService.deleteNotification(id);
            toast.success('Notification deleted');
            fetchNotifications();
        } catch (error) {
            toast.error('Failed to delete notification');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const stats = {
        total: notifications.length,
        unread: notifications.filter(n => !n.read).length,
        read: notifications.filter(n => n.read).length
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-12 h-12 text-rwanda-blue animate-spin" />
                <p className="text-gray-500 font-medium">Loading notifications...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                    <p className="text-gray-500 text-sm">Stay updated with your Umuganda events and community activities.</p>
                </div>
                {stats.unread > 0 && (
                    <button
                        onClick={handleMarkAllAsRead}
                        className="flex items-center justify-center gap-2 bg-rwanda-blue text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-all font-semibold shadow-lg shadow-blue-500/10"
                    >
                        <CheckCheck className="w-5 h-5" />
                        Mark All as Read
                    </button>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Bell className="w-6 h-6 text-rwanda-blue" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Unread</p>
                            <p className="text-3xl font-bold text-rwanda-blue mt-1">{stats.unread}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                            <Bell className="w-6 h-6 text-rwanda-blue" />
                        </div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Read</p>
                            <p className="text-3xl font-bold text-green-600 mt-1">{stats.read}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                            <CheckCheck className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-rwanda-blue/20 outline-none"
                >
                    <option value="ALL">All Notifications</option>
                    <option value="UNREAD">Unread Only</option>
                    <option value="READ">Read Only</option>
                </select>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {filteredNotifications.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">
                        <Bell className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-bold">No notifications found</h3>
                        <p className="text-sm">You're all caught up!</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {paginatedNotifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`p-6 hover:bg-gray-50 transition-colors group ${!notification.read ? 'bg-blue-50/30' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${!notification.read ? 'bg-rwanda-blue' : 'bg-gray-300'
                                        }`} />
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm leading-relaxed ${!notification.read ? 'text-gray-900 font-medium' : 'text-gray-600'
                                            }`}>
                                            {notification.message}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {formatDate(notification.date)}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {!notification.read && (
                                            <button
                                                onClick={() => handleMarkAsRead(notification.id)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                                                title="Mark as read"
                                            >
                                                <Check className="w-5 h-5" />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleDelete(notification.id)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Pagination Controls */}
                {filteredNotifications.length > 0 && (
                    <div className="border-t border-gray-50 px-4">
                        <Pagination
                            currentPage={currentPage}
                            totalItems={filteredNotifications.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPage;
