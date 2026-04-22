import React, { useState, useEffect } from 'react';
import {
    CheckSquare,
    Search,
    Users,
    Calendar,
    Loader2,
    UserCheck,
    UserX,
    UserMinus,
    Filter,
    Download,
    ChevronDown
} from 'lucide-react';
import attendanceService from '../../services/attendanceService';
import umugandaService from '../../services/umugandaService';
import userService from '../../services/userService';
import locationService from '../../services/locationService';
import { toast } from 'react-toastify';

const AttendanceManagement = () => {
    const [events, setEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [users, setUsers] = useState({});
    const [locationMap, setLocationMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setIsLoading(true);
            const [eventData, userData, locationData] = await Promise.all([
                umugandaService.getAllEvents(),
                userService.getAllUsers(),
                locationService.getAllLocations()
            ]);

            setEvents(eventData);

            // Build user lookup
            const userMap = {};
            userData.forEach(u => userMap[u.id] = u);
            setUsers(userMap);

            // Build location lookup
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
        } catch (error) {
            toast.error("Failed to load data");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAttendanceForEvent = async (eventId) => {
        try {
            const data = await attendanceService.getByUmugandaId(eventId);
            setAttendanceRecords(data);
        } catch (error) {
            toast.error("Failed to load attendance records");
        }
    };

    const handleEventChange = (eventId) => {
        const event = events.find(e => e.id === eventId);
        setSelectedEvent(event);
        if (eventId) {
            fetchAttendanceForEvent(eventId);
        } else {
            setAttendanceRecords([]);
        }
    };

    const handleStatusChange = async (attendanceId, newStatus) => {
        try {
            const record = attendanceRecords.find(r => r.id === attendanceId);
            await attendanceService.updateAttendance(attendanceId, {
                ...record,
                attendance: newStatus
            });
            toast.success("Attendance updated");
            fetchAttendanceForEvent(selectedEvent.id);
        } catch (error) {
            toast.error("Failed to update attendance");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'ATTENDED': return 'bg-green-50 text-green-700 border-green-200';
            case 'ABSENT': return 'bg-red-50 text-red-700 border-red-200';
            case 'EXCUSED': return 'bg-amber-50 text-amber-700 border-amber-200';
            default: return 'bg-gray-50 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'ATTENDED': return <UserCheck className="w-4 h-4" />;
            case 'ABSENT': return <UserX className="w-4 h-4" />;
            case 'EXCUSED': return <UserMinus className="w-4 h-4" />;
            default: return <Users className="w-4 h-4" />;
        }
    };

    const filteredRecords = attendanceRecords.filter(record => {
        const user = users[record.userId];
        if (!user) return false;

        const matchesSearch = searchTerm === '' ||
            user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = statusFilter === 'ALL' || record.attendance === statusFilter;

        return matchesSearch && matchesStatus;
    });

    const stats = {
        total: attendanceRecords.length,
        attended: attendanceRecords.filter(r => r.attendance === 'ATTENDED').length,
        absent: attendanceRecords.filter(r => r.attendance === 'ABSENT').length,
        excused: attendanceRecords.filter(r => r.attendance === 'EXCUSED').length
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-12 h-12 text-rwanda-blue animate-spin" />
                <p className="text-gray-500 font-medium">Loading attendance data...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
                    <p className="text-gray-500 text-sm">Track and manage citizen participation in Umuganda events.</p>
                </div>
                <button className="flex items-center justify-center gap-2 bg-rwanda-green text-white px-5 py-2.5 rounded-xl hover:bg-green-600 transition-all font-semibold shadow-lg shadow-green-500/10">
                    <Download className="w-5 h-5" />
                    Export Report
                </button>
            </div>

            {/* Event Selector */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <label className="block text-sm font-bold text-gray-700 mb-2">Select Umuganda Event</label>
                <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <select
                        value={selectedEvent?.id || ''}
                        onChange={(e) => handleEventChange(e.target.value)}
                        className="w-full pl-12 pr-10 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all font-medium text-gray-700 appearance-none cursor-pointer"
                    >
                        <option value="">Choose an event to view attendance...</option>
                        {events.map(event => (
                            <option key={event.id} value={event.id}>
                                {new Date(event.date).toLocaleDateString()} - {event.description}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {selectedEvent && (
                <>
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
                                </div>
                                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                                    <Users className="w-6 h-6 text-rwanda-blue" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Attended</p>
                                    <p className="text-3xl font-bold text-green-600 mt-1">{stats.attended}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                                    <UserCheck className="w-6 h-6 text-green-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Absent</p>
                                    <p className="text-3xl font-bold text-red-600 mt-1">{stats.absent}</p>
                                </div>
                                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center">
                                    <UserX className="w-6 h-6 text-red-600" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Excused</p>
                                    <p className="text-3xl font-bold text-amber-600 mt-1">{stats.excused}</p>
                                </div>
                                <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center">
                                    <UserMinus className="w-6 h-6 text-amber-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters Bar */}
                    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-rwanda-blue/20 outline-none"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">All Status</option>
                            <option value="ATTENDED">Attended</option>
                            <option value="ABSENT">Absent</option>
                            <option value="EXCUSED">Excused</option>
                        </select>
                    </div>

                    {/* Attendance Table */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-widest font-bold">
                                    <tr>
                                        <th className="px-6 py-4">Citizen</th>
                                        <th className="px-6 py-4">Location</th>
                                        <th className="px-6 py-4">Contact</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {filteredRecords.map((record) => {
                                        const user = users[record.userId];
                                        if (!user) return null;

                                        return (
                                            <tr key={record.id} className="hover:bg-gray-50/30 transition-colors">
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-rwanda-blue/10 flex items-center justify-center text-rwanda-blue font-bold">
                                                            {user.firstName[0]}{user.lastName[0]}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-800">{user.firstName} {user.lastName}</p>
                                                            <p className="text-xs text-gray-400">{user.role}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-sm text-gray-600">{locationMap[user.locationId] || 'N/A'}</p>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <p className="text-sm text-gray-600">{user.email}</p>
                                                    {user.phone && <p className="text-xs text-gray-400">{user.phone}</p>}
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-bold text-xs ${getStatusColor(record.attendance)}`}>
                                                        {getStatusIcon(record.attendance)}
                                                        {record.attendance}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <select
                                                        value={record.attendance}
                                                        onChange={(e) => handleStatusChange(record.id, e.target.value)}
                                                        className="px-3 py-1.5 bg-gray-50 border-none rounded-lg text-sm font-medium focus:ring-2 focus:ring-rwanda-blue/20 cursor-pointer"
                                                    >
                                                        <option value="ATTENDED">Mark Attended</option>
                                                        <option value="ABSENT">Mark Absent</option>
                                                        <option value="EXCUSED">Mark Excused</option>
                                                    </select>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                            {filteredRecords.length === 0 && (
                                <div className="py-20 text-center text-gray-400">
                                    <CheckSquare className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                    <p>No attendance records found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}

            {!selectedEvent && (
                <div className="bg-white rounded-3xl border border-dashed border-gray-200 p-20 text-center">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                    <h3 className="text-lg font-bold text-gray-400">No Event Selected</h3>
                    <p className="text-gray-400 text-sm">Please select an Umuganda event to view and manage attendance.</p>
                </div>
            )}
        </div>
    );
};

export default AttendanceManagement;
