import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    Calendar,
    Clock,
    MapPin,
    Loader2,
    CalendarDays,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import umugandaService from '../../services/umugandaService';
import locationService from '../../services/locationService';
import attendanceService from '../../services/attendanceService';
import { toast } from 'react-toastify';

const VillagerUmuganda = () => {
    const { user } = useSelector((state) => state.auth);
    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [attendanceMap, setAttendanceMap] = useState({});
    const [locationMap, setLocationMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user?.id && user?.locationId) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [eventsData, attendanceData, locationData] = await Promise.all([
                umugandaService.getEventsByLocation(user.locationId),
                attendanceService.getByUserId(user.id),
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

            // Filter upcoming events
            const now = new Date();
            const upcoming = eventsData
                .filter(event => new Date(event.date) > now)
                .sort((a, b) => new Date(a.date) - new Date(b.date));
            setUpcomingEvents(upcoming);

            // Build attendance map
            const attMap = {};
            attendanceData.forEach(att => {
                attMap[att.umugandaId] = att.attendance;
            });
            setAttendanceMap(attMap);

        } catch (error) {
            toast.error('Failed to load events');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
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

    const getTimeUntil = (dateString) => {
        const eventDate = new Date(dateString);
        const now = new Date();
        const diff = eventDate - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} away`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} away`;
        } else {
            return 'Starting soon';
        }
    };

    const getAttendanceStatus = (eventId) => {
        const status = attendanceMap[eventId];
        if (!status) return null;

        const colors = {
            'ATTENDED': 'bg-green-50 text-green-700 border-green-200',
            'ABSENT': 'bg-red-50 text-red-700 border-red-200',
            'EXCUSED': 'bg-amber-50 text-amber-700 border-amber-200'
        };

        return (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-bold text-xs ${colors[status] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                {status === 'ATTENDED' && <CheckCircle className="w-3.5 h-3.5" />}
                {status === 'ABSENT' && <AlertCircle className="w-3.5 h-3.5" />}
                {status}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-12 h-12 text-rwanda-blue animate-spin" />
                <p className="text-gray-500 font-medium">Loading upcoming events...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Upcoming Umuganda</h1>
                    <p className="text-gray-500 text-sm mt-1">View all scheduled community work activities in your village</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl border-2 border-rwanda-blue/20 shadow-sm">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total Upcoming</p>
                    <p className="text-3xl font-black text-rwanda-blue mt-1">{upcomingEvents.length}</p>
                </div>
            </div>

            {/* Events List */}
            {upcomingEvents.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                    {upcomingEvents.map((event) => {
                        const eventDate = new Date(event.date);
                        const isThisWeek = (eventDate - new Date()) < (7 * 24 * 60 * 60 * 1000);

                        return (
                            <div
                                key={event.id}
                                className={`bg-white rounded-3xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group ${isThisWeek ? 'border-rwanda-blue bg-gradient-to-br from-blue-50/50 to-white' : 'border-gray-100 hover:border-rwanda-blue/30'
                                    }`}
                            >
                                {/* Top Banner for This Week Events */}
                                {isThisWeek && (
                                    <div className="bg-gradient-to-r from-rwanda-blue to-blue-600 px-4 sm:px-6 py-2.5 flex items-center justify-between">
                                        <span className="text-white text-xs sm:text-sm font-bold flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            Happening This Week
                                        </span>
                                        <span className="text-white/90 text-xs font-medium">{getTimeUntil(event.date)}</span>
                                    </div>
                                )}

                                <div className="p-4 sm:p-6 lg:p-8">
                                    <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                                        {/* Date Badge - Responsive */}
                                        <div className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 bg-gradient-to-br from-rwanda-green to-green-600 rounded-3xl flex flex-col items-center justify-center text-white shadow-lg shadow-green-500/20 transform group-hover:scale-105 transition-transform">
                                            <span className="text-[10px] sm:text-xs font-bold uppercase opacity-90">
                                                {eventDate.toLocaleDateString('en-US', { month: 'short' })}
                                            </span>
                                            <span className="text-3xl sm:text-4xl lg:text-5xl font-black">{eventDate.getDate()}</span>
                                            <span className="text-[10px] sm:text-xs font-medium opacity-90">
                                                {eventDate.toLocaleDateString('en-US', { year: 'numeric' })}
                                            </span>
                                        </div>

                                        {/* Event Details */}
                                        <div className="flex-1 w-full">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                                                <div className="flex-1">
                                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 leading-tight mb-2 group-hover:text-rwanda-blue transition-colors">
                                                        {event.description}
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-gray-500">
                                                        {formatDate(event.date)}
                                                    </p>
                                                </div>
                                                <div className="flex-shrink-0">
                                                    {getAttendanceStatus(event.id)}
                                                </div>
                                            </div>

                                            {/* Info Grid - Fully Responsive */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4">
                                                <div className="flex items-center gap-3 p-3 sm:p-4 bg-blue-50/50 rounded-xl sm:rounded-2xl border border-blue-100 hover:bg-blue-50 transition-colors">
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rwanda-blue rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase">Time</p>
                                                        <p className="text-sm sm:text-base font-bold text-gray-900 truncate">{formatTime(event.date)}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 p-3 sm:p-4 bg-amber-50/50 rounded-xl sm:rounded-2xl border border-amber-100 hover:bg-amber-50 transition-colors">
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase">Location</p>
                                                        <p className="text-sm sm:text-base font-bold text-gray-900 truncate" title={locationMap[event.locationId]}>
                                                            {locationMap[event.locationId]?.split(' > ').pop() || 'Your Village'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3 p-3 sm:p-4 bg-green-50/50 rounded-xl sm:rounded-2xl border border-green-100 hover:bg-green-50 transition-colors sm:col-span-2 lg:col-span-1">
                                                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rwanda-green rounded-xl flex items-center justify-center flex-shrink-0">
                                                        <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[10px] sm:text-xs text-gray-500 font-medium uppercase">Attendance</p>
                                                        <p className="text-sm sm:text-base font-bold text-rwanda-green">Compulsory</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Countdown Banner */}
                                            {!isThisWeek && (
                                                <div className="mt-4 p-3 sm:p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl border border-gray-200">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-rwanda-blue" />
                                                            <span className="text-xs sm:text-sm font-bold text-gray-700">
                                                                {getTimeUntil(event.date)}
                                                            </span>
                                                        </div>
                                                        <span className="text-[10px] sm:text-xs text-gray-500 hidden sm:inline">Mark your calendar!</span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="bg-white rounded-3xl border-2 border-dashed border-gray-200 p-12 sm:p-20 text-center">
                    <Calendar className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-gray-200" />
                    <h3 className="text-lg sm:text-xl font-bold text-gray-400">No Upcoming Events</h3>
                    <p className="text-gray-400 text-sm mt-2 max-w-md mx-auto">There are no scheduled Umuganda events in your village at the moment. Check back soon for newly planned activities.</p>
                </div>
            )}

            {/* Info Card */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 border-2 border-blue-100 rounded-3xl p-4 sm:p-6">
                <div className="flex items-start gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rwanda-blue rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Important Reminder</h4>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                            Participation in Umuganda is compulsory for all able-bodied citizens aged 18-65.
                            Please ensure you attend all scheduled events in your village. If you cannot attend,
                            you must provide a valid excuse to your village chief.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VillagerUmuganda;
