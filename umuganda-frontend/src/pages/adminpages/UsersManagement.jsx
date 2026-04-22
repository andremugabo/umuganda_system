import React, { useState, useEffect } from 'react';
import Pagination from '../../components/ui/Pagination';
import {
    Users,
    Search,
    Filter,
    Edit2,
    Trash2,
    MoreVertical,
    UserPlus,
    Mail,
    Phone,
    Shield,
    Loader2,
    MapPin,
    Download
} from 'lucide-react';
import userService from '../../services/userService';
import locationService from '../../services/locationService';
import { toast } from 'react-toastify';
import EditUserModal from '../../components/ui/EditUserModal';
import AssignLocationModal from '../../components/ui/AssignLocationModal';
import AddUserModal from '../../components/ui/AddUserModal';
import { exportToCSV } from '../../utils/exportUtils';


const UsersManagement = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [villages, setVillages] = useState([]); // This might still be needed for initial map
    const [locationMap, setLocationMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('ALL');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Modal State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    const handleExport = () => {
        setIsExporting(true);
        try {
            const dataToExport = filteredUsers.map(u => ({
                id: u.id,
                firstName: u.firstName,
                lastName: u.lastName,
                email: u.email,
                phone: u.phone || '',
                role: u.role,
                location: locationMap[u.locationId] || 'No Village'
            }));
            exportToCSV(dataToExport, 'citizen_registry');
            toast.success("Registry exported successfully");
        } catch (error) {
            toast.error("Failed to export registry");
        } finally {
            setIsExporting(false);
        }
    };



    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setIsLoading(true);
            const [userData, locationData] = await Promise.all([
                userService.getAllUsers(),
                locationService.getAllLocations()
            ]);

            setUsers(userData);
            setFilteredUsers(userData);

            const map = {};
            // Build a lookup map for quick access
            const lookup = {};
            locationData.forEach(loc => lookup[loc.id] = loc);

            // Function to build hierarchical path
            const getPath = (id) => {
                const parts = [];
                let current = lookup[id];
                while (current) {
                    parts.unshift(current.name);
                    current = lookup[current.parentId];
                }
                return parts.join(' > ');
            };

            locationData.forEach(loc => {
                map[loc.id] = getPath(loc.id);
            });
            setLocationMap(map);
        } catch (error) {
            toast.error("Failed to load initial data");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await userService.getAllUsers();
            setUsers(data);
        } catch (error) {
            toast.error("Failed to refresh users");
        }
    };

    const handleAssignClick = (user) => {
        setSelectedUser(user);
        setIsAssignModalOpen(true);
    };

    const handleAssignResult = async (userId, locationId) => {
        try {
            // Find current user object to maintain state if needed, though backend fix now handles partial updates
            const user = users.find(u => u.id === userId);
            await userService.updateUser(userId, { ...user, locationId });
            toast.success("Location assigned successfully");
            fetchUsers();
        } catch (error) {
            toast.error("Failed to assign location");
        }
    };


    useEffect(() => {
        let result = users;
        if (searchTerm) {
            result = result.filter(u =>
                u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                u.email.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (roleFilter !== 'ALL') {
            result = result.filter(u => u.role === roleFilter);
        }
        setFilteredUsers(result);
        setCurrentPage(1); // Reset to page 1 on filter change
    }, [searchTerm, roleFilter, users]);

    // Compute current page slice
    const paginatedUsers = filteredUsers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await userService.deleteUser(id);
                toast.success("User deleted successfully");
                fetchUsers();
            } catch (error) {
                toast.error("Failed to delete user");
            }
        }
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const handleUpdate = async (id, data) => {
        try {
            await userService.updateUser(id, data);
            toast.success("User updated successfully");
            setIsEditModalOpen(false);
            fetchInitialData(); // Refresh both to be safe
        } catch (error) {
            toast.error("Failed to update user");
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-12 h-12 text-rwanda-blue animate-spin" />
                <p className="text-gray-500 font-medium">Loading citizen registry...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Citizen Management</h1>
                    <p className="text-gray-500 text-sm">Manage all users, roles, and community access.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="flex items-center justify-center gap-2 bg-white border border-gray-100 text-gray-700 px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-all font-semibold shadow-sm active:scale-95 disabled:opacity-50"
                    >
                        {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5 text-rwanda-blue" />}
                        Export
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-rwanda-blue text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-all font-semibold shadow-lg shadow-blue-500/10 active:scale-95"
                    >
                        <UserPlus className="w-5 h-5" />
                        Add Member
                    </button>
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
                <div className="flex gap-2">
                    <select
                        className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-rwanda-blue/20 outline-none"
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="ALL">All Roles</option>
                        <option value="ADMIN">Admin</option>
                        <option value="VILLAGE_CHEF">Village Chef</option>
                        <option value="VILLAGE_SOCIAL">Social Worker</option>
                        <option value="VILLAGER">Villager</option>
                    </select>
                    <button className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-xl transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-400 text-[11px] uppercase tracking-widest font-bold">
                            <tr>
                                <th className="px-6 py-4">Citizen Details</th>
                                <th className="px-6 py-4">Role & Access</th>
                                <th className="px-6 py-4">Contact Info</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {paginatedUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-rwanda-blue/10 flex items-center justify-center text-rwanda-blue font-bold">
                                                {user.firstName[0]}{user.lastName[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{user.firstName} {user.lastName}</p>
                                                <p className="text-xs text-gray-400 uppercase font-medium tracking-tighter">ID: {user.id.substring(0, 8)}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg ${user.role === 'ADMIN' ? 'bg-purple-50 text-purple-600' :
                                                user.role === 'VILLAGE_CHEF' ? 'bg-rwanda-green/10 text-rwanda-green' :
                                                    'bg-blue-50 text-blue-600'
                                                }`}>
                                                <Shield className="w-4 h-4" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-semibold text-gray-700 capitalize">
                                                    {user.role.toLowerCase().replace('_', ' ')}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">
                                                    <MapPin className="w-2.5 h-2.5" />
                                                    {locationMap[user.locationId] || 'No Village'}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail className="w-3.5 h-3.5 text-gray-400" />
                                            {user.email}
                                        </div>
                                        {user.phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone className="w-3.5 h-3.5 text-gray-400" />
                                                {user.phone}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => handleAssignClick(user)}
                                                title="Assign Location"
                                                className="p-2 text-gray-400 hover:text-rwanda-green hover:bg-rwanda-green/5 rounded-lg transition-all"
                                            >
                                                <MapPin className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEdit(user)}
                                                className="p-2 text-gray-400 hover:text-rwanda-blue hover:bg-rwanda-blue/5 rounded-lg transition-all"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                                                <MoreVertical className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredUsers.length === 0 && (
                        <div className="py-20 text-center text-gray-400">
                            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
                            <p>No citizens found matching your criteria.</p>
                        </div>
                    )}
                </div>
                {/* Pagination */}
                <div className="border-t border-gray-50 px-4">
                    <Pagination
                        currentPage={currentPage}
                        totalItems={filteredUsers.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                        onItemsPerPageChange={setItemsPerPage}
                    />
                </div>
            </div>

            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                user={selectedUser}
                onUpdate={handleUpdate}
            />

            <AssignLocationModal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                user={selectedUser}
                onAssign={handleAssignResult}
            />

            <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={() => {
                    fetchInitialData();
                    setIsAddModalOpen(false);
                }}
            />
        </div>
    );
};

export default UsersManagement;
