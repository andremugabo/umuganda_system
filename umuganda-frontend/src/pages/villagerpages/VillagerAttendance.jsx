import React, { useState, useEffect } from 'react';
import Pagination from '../../components/ui/Pagination';
import { useSelector } from 'react-redux';
import {
    CheckCircle,
    XCircle,
    AlertCircle,
    Calendar,
    TrendingUp,
    Loader2,
    Filter,
    Award
} from 'lucide-react';
import attendanceService from '../../services/attendanceService';
import { toast } from 'react-toastify';

const VillagerAttendance = () => {
    const { user } = useSelector((state) => state.auth);
    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const [filter, setFilter] = useState('ALL'); // ALL, ATTENDED, ABSENT, EXCUSED
    const [isLoading, setIsLoading] = useState(true);
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [stats, setStats] = useState({
        total: 0,
        attended: 0,
        absent: 0,
        excused: 0,
        attendanceRate: 0
    });

    useEffect(() => {
        if (user?.id) {
            fetchAttendance();
        }
    }, [user]);

    useEffect(() => {
        applyFilter();
    }, [filter, attendanceRecords]);

    const fetchAttendance = async () => {
        try {
            setIsLoading(true);
            const data = await attendanceService.getByUserId(user.id);

            // Sort by date (newest first)
            const sorted = data.sort((a, b) => {
                // Since we don't have date in attendance, we'll sort by ID (assuming newer IDs are more recent)
                return b.id?.localeCompare(a.id) || 0;
            });

            setAttendanceRecords(sorted);

            // Calculate statistics
            const attended = sorted.filter(r => r.attendance === 'ATTENDED').length;
            const absent = sorted.filter(r => r.attendance === 'ABSENT').length;
            const excused = sorted.filter(r => r.attendance === 'EXCUSED').length;
            const total = sorted.length;
            const attendanceRate = total > 0 ? Math.round((attended / total) * 100) : 0;

            setStats({
                total,
                attended,
                absent,
                excused,
                attendanceRate
            });

        } catch (error) {
            toast.error('Failed to load attendance records');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const applyFilter = () => {
        if (filter === 'ALL') {
            setFilteredRecords(attendanceRecords);
        } else {
            setFilteredRecords(attendanceRecords.filter(r => r.attendance === filter));
        }
        setCurrentPage(1); // Reset to first page on filter change
    };

    // Calculate pagination slice
    const paginatedRecords = filteredRecords.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

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
            case 'ATTENDED': return <CheckCircle className="w-5 h-5" />;
            case 'ABSENT': return <XCircle className="w-5 h-5" />;
            case 'EXCUSED': return <AlertCircle className="w-5 h-5" />;
            default: return null;
        }
    };

    const getRateColor = (rate) => {
        if (rate >= 80) return 'text-green-600';
        if (rate >= 60) return 'text-amber-600';
        return 'text-red-600';
    };

    const getRateLabel = (rate) => {
        if (rate >= 80) return 'Excellent';
        if (rate >= 60) return 'Good';
        return 'Needs Improvement';
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-12 h-12 text-rwanda-blue animate-spin" />
                <p className="text-gray-500 font-medium">Loading your attendance history...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Attendance History</h1>
                <p className="text-gray-500 text-sm mt-1">Track your participation in Umuganda community work</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-3xl border-2 border-blue-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-rwanda-blue rounded-2xl flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Total Events</p>
                    <p className="text-4xl font-black text-gray-900 mt-1">{stats.total}</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-3xl border-2 border-green-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-rwanda-green rounded-2xl flex items-center justify-center">
                            <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Attended</p>
                    <p className="text-4xl font-black text-gray-900 mt-1">{stats.attended}</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-3xl border-2 border-red-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center">
                            <XCircle className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Missed</p>
                    <p className="text-4xl font-black text-gray-900 mt-1">{stats.absent}</p>
                </div>

                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-6 rounded-3xl border-2 border-amber-200 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                        <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center">
                            <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                    </div>
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wider">Excused</p>
                    <p className="text-4xl font-black text-gray-900 mt-1">{stats.excused}</p>
                </div>
            </div>

            {/* Attendance Rate Card */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-lg p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-rwanda-blue to-blue-600 rounded-2xl flex items-center justify-center">
                            <TrendingUp className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 font-medium">Your Attendance Rate</p>
                            <p className={`text-5xl font-black mt-1 ${getRateColor(stats.attendanceRate)}`}>
                                {stats.attendanceRate}%
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Award className={`w-12 h-12 ${getRateColor(stats.attendanceRate)}`} />
                        <div>
                            <p className="text-sm text-gray-500">Performance</p>
                            <p className={`text-xl font-bold ${getRateColor(stats.attendanceRate)}`}>
                                {getRateLabel(stats.attendanceRate)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-rwanda-blue/20 outline-none"
                    >
                        <option value="ALL">All Records ({attendanceRecords.length})</option>
                        <option value="ATTENDED">Attended ({stats.attended})</option>
                        <option value="ABSENT">Absent ({stats.absent})</option>
                        <option value="EXCUSED">Excused ({stats.excused})</option>
                    </select>
                </div>
            </div>

            {/* Attendance Records List */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {filteredRecords.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                        {paginatedRecords.map((record, index) => (
                            <div
                                key={record.id}
                                className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                                <Calendar className="w-5 h-5 text-rwanda-blue" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                                                    {record.eventDescription || 'Umuganda Event'}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                                    Event #{index + 1}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 font-bold text-sm ${getStatusColor(record.attendance)}`}>
                                        {getStatusIcon(record.attendance)}
                                        {record.attendance}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center text-gray-400">
                        <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
                        <h3 className="text-lg font-bold">No records found</h3>
                        <p className="text-sm mt-2">No attendance records match your filter criteria.</p>
                    </div>
                )}

                {/* Pagination Controls */}
                {filteredRecords.length > 0 && (
                    <div className="border-t border-gray-50 px-4">
                        <Pagination
                            currentPage={currentPage}
                            totalItems={filteredRecords.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                            onItemsPerPageChange={setItemsPerPage}
                        />
                    </div>
                )}
            </div>

            {/* Info Card */}
            {stats.attendanceRate < 80 && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-3xl p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-500 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                            <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Improve Your Attendance</h4>
                            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                Your attendance rate is below the recommended 80%. Regular participation in Umuganda is important for
                                community development and is required by law. Try to attend all upcoming events to improve your record.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VillagerAttendance;
