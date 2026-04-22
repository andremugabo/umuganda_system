import React, { useState, useEffect } from 'react';
import { 
    Shield, 
    History, 
    User, 
    Clock, 
    Monitor, 
    Search, 
    Filter, 
    Download,
    Eye,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import { toast } from 'react-toastify';
import Skeleton, { TableRowSkeleton } from '../../components/ui/Skeleton';
import { exportToCSV } from '../../utils/exportUtils';
import Pagination from '../../components/ui/Pagination';


const AuditLogsPage = () => {
    const navigate = useNavigate();
    const [logs, setLogs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState('ALL');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);


    useEffect(() => {
        fetchAuditLogs();
    }, []);

    const fetchAuditLogs = async () => {
        try {
            setIsLoading(true);
            const data = await userService.getAuditLogs();
            setLogs(data);
        } catch (error) {
            toast.error("Failed to load audit logs");
        } finally {
            setIsLoading(false);
        }
    };


    const getFilteredLogs = () => {
        return logs.filter(log => {
            const matchesFilter = filter === 'ALL' || log.action === filter;
            const matchesSearch = 
                log.performedBy.toLowerCase().includes(searchQuery.toLowerCase()) || 
                log.details.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesFilter && matchesSearch;
        });
    };

    const filteredLogs = getFilteredLogs();
    const paginatedLogs = filteredLogs.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const getActionColor = (action) => {

        switch (action) {
            case 'CREATE': return 'bg-green-50 text-green-600 border-green-100';
            case 'UPDATE': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'DELETE': return 'bg-red-50 text-red-600 border-red-100';
            default: return 'bg-gray-50 text-gray-600 border-gray-100';
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
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
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <Shield className="w-8 h-8 text-rwanda-blue" />
                            System Audit Logs
                        </h1>
                        <p className="text-gray-500 mt-1 font-medium">Accountability tracking for all administrative actions.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => exportToCSV(logs, 'system_audit_logs')}
                        className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-100 text-gray-700 rounded-xl font-bold hover:border-rwanda-blue hover:text-rwanda-blue transition-all active:scale-95"
                    >
                        <Download className="w-5 h-5" />
                        Export Log History
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search by user or detail..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all outline-none text-sm font-medium"
                    />
                </div>
                <div className="flex gap-2">
                    <select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-4 py-3 bg-gray-50 border-none rounded-2xl text-sm font-bold text-gray-600 outline-none"
                    >
                        <option value="ALL">All Actions</option>
                        <option value="CREATE">Creation Only</option>
                        <option value="UPDATE">Updates Only</option>
                    </select>
                </div>
            </div>

            {/* Log Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-black tracking-widest border-b border-gray-50">
                                <th className="px-8 py-5">Timestamp</th>
                                <th className="px-8 py-5">Performed By</th>
                                <th className="px-8 py-5">Action</th>
                                <th className="px-8 py-5">Details</th>
                                <th className="px-8 py-5">Origin IP</th>
                                <th className="px-8 py-5"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => <TableRowSkeleton key={i} />)
                            ) : paginatedLogs.length > 0 ? (
                                paginatedLogs.map((log) => (
                                    <tr key={log.id} className="hover:bg-blue-50/20 transition-colors group">

                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Clock className="w-4 h-4" />
                                                <div className="text-xs">
                                                    <p className="font-bold text-gray-900">{new Date(log.timestamp).toLocaleDateString()}</p>
                                                    <p>{new Date(log.timestamp).toLocaleTimeString()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-rwanda-blue border border-blue-100">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm font-bold text-gray-800">{log.performedBy}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-5">
                                            <span className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-widest ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-8 py-5">
                                            <p className="text-sm font-medium text-gray-700">{log.details}</p>
                                            {log.entityId && log.entityId !== "N/A" && (
                                              <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">{log.entityName} ID: {log.entityId.substring(0,8)}</p>
                                            )}
                                        </td>
                                        <td className="px-8 py-5">
                                            <div className="flex items-center gap-2 text-gray-400 text-xs font-mono">
                                                <Monitor className="w-3 h-3" />
                                                {log.ipAddress}
                                            </div>
                                        </td>
                                        <td className="px-8 py-5 text-right">
                                            <button className="p-2 text-gray-300 hover:text-rwanda-blue transition-colors rounded-xl hover:bg-blue-50">
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center">
                                        <History className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                                        <h3 className="text-lg font-bold text-gray-400">No activity logs found.</h3>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {!isLoading && (
                    <div className="border-t border-gray-50 p-4">
                        <Pagination 
                            currentPage={currentPage}
                            totalItems={filteredLogs.length}
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

export default AuditLogsPage;
