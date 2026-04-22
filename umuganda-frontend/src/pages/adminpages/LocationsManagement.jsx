import React, { useState, useEffect } from 'react';
import Pagination from '../../components/ui/Pagination';
import {
    MapPin,
    Search,
    Plus,
    Edit2,
    Trash2,
    ChevronRight,
    Layers,
    Loader2,
    ArrowLeft
} from 'lucide-react';
import locationService from '../../services/locationService';
import { toast } from 'react-toastify';
import LocationModal from '../../components/ui/LocationModal';

const LocationsManagement = () => {
    const [locations, setLocations] = useState([]);
    const [filteredLocations, setFilteredLocations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('ALL');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    // Navigation State (for hierarchy)
    const [history, setHistory] = useState([]); // Array of parent locations
    const [currentParent, setCurrentParent] = useState(null);

    useEffect(() => {
        fetchLocations();
    }, [currentParent]);

    const fetchLocations = async () => {
        try {
            setIsLoading(true);
            let data;
            if (currentParent) {
                data = await locationService.getChildren(currentParent.id);
            } else {
                data = await locationService.getByType('PROVINCE');
            }
            setLocations(data);
            setFilteredLocations(data);
        } catch (error) {
            toast.error("Failed to load locations");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let result = locations;
        if (searchTerm) {
            result = result.filter(l =>
                l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                l.type.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }
        if (typeFilter !== 'ALL' && !currentParent) {
            result = result.filter(l => l.type === typeFilter);
        }
        setFilteredLocations(result);
        setCurrentPage(1);
    }, [searchTerm, typeFilter, locations]);

    // Compute current page slice
    const paginatedLocations = filteredLocations.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleNavigateDown = (location) => {
        setHistory([...history, currentParent].filter(Boolean));
        setCurrentParent(location);
        setSearchTerm('');
    };

    const handleNavigateUp = () => {
        const newHistory = [...history];
        const prev = newHistory.pop();
        setHistory(newHistory);
        setCurrentParent(prev || null);
        setSearchTerm('');
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure? This might delete child locations too.")) {
            try {
                await locationService.deleteLocation(id);
                toast.success("Location deleted");
                fetchLocations();
            } catch (error) {
                toast.error("Failed to delete");
            }
        }
    };

    const handleEdit = (loc) => {
        setSelectedLocation(loc);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedLocation(null);
        setIsModalOpen(true);
    };

    const handleSave = async (id, data) => {
        try {
            if (id) {
                await locationService.updateLocation(id, data);
                toast.success("Location updated");
            } else {
                await locationService.createLocation(data);
                toast.success("Location created");
            }
            setIsModalOpen(false);
            fetchLocations();
        } catch (error) {
            toast.error("Failed to save location");
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-12 h-12 text-rwanda-blue animate-spin" />
                <p className="text-gray-500 font-medium tracking-wide">Mapping Rwanda's territories...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Dynamic Breadcrumbs/Nav */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        {currentParent && (
                            <button
                                onClick={handleNavigateUp}
                                className="p-1 hover:bg-gray-100 rounded-lg text-rwanda-blue transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                        )}
                        <h1 className="text-2xl font-bold text-gray-900">
                            {currentParent ? currentParent.name : "Locations Registry"}
                        </h1>
                    </div>
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        {currentParent
                            ? `Exploring children of ${currentParent.name} (${currentParent.type})`
                            : "Administrative hierarchy management (Province to Village)"}
                    </p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center justify-center gap-2 bg-rwanda-blue text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-all font-semibold shadow-lg shadow-blue-500/10"
                >
                    <Plus className="w-5 h-5" />
                    Add {currentParent ? 'Child' : 'Province'}
                </button>
            </div>

            {/* Control Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder={`Search ${currentParent ? 'within ' + currentParent.name : 'locations'}...`}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                {!currentParent && (
                    <select
                        className="bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-rwanda-blue/20 outline-none"
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="ALL">All Types</option>
                        <option value="PROVINCE">Provinces</option>
                        <option value="DISTRICT">Districts</option>
                        <option value="SECTOR">Sectors</option>
                    </select>
                )}
            </div>

            {/* Grid of Locations */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedLocations.map((loc) => (
                    <div key={loc.id} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden">
                        <div className="flex items-start justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-rwanda-blue/10 flex items-center justify-center text-rwanda-blue">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => handleEdit(loc)}
                                    className="p-2 text-gray-300 hover:text-rwanda-blue transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(loc.id)}
                                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-rwanda-blue transition-colors">{loc.name}</h3>
                            <p className="text-xs font-bold text-rwanda-blue/60 uppercase tracking-widest mt-1">{loc.type}</p>
                        </div>

                        <div className="mt-8 flex items-center justify-between">
                            <div className="flex -space-x-2">
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-rwanda-blue text-white flex items-center justify-center text-[10px] font-bold">BY</div>
                                <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">+</div>
                            </div>
                            {loc.type !== 'VILLAGE' && (
                                <button
                                    onClick={() => handleNavigateDown(loc)}
                                    className="flex items-center gap-1 px-4 py-2 bg-gray-50 rounded-xl text-gray-600 font-bold text-xs hover:bg-rwanda-blue hover:text-white transition-all group/btn"
                                >
                                    View Sub-sectors
                                    <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                                </button>
                            )}
                        </div>

                        <MapPin className="absolute -bottom-6 -right-6 w-32 h-32 text-gray-50 group-hover:text-rwanda-blue/5 transition-colors pointer-events-none" />
                    </div>
                ))}

                {filteredLocations.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                        <Layers className="w-16 h-16 text-gray-100 mx-auto mb-4" />
                        <h4 className="text-lg font-bold text-gray-800">No locations mapped here</h4>
                        <p className="text-gray-500 mt-2">Add the first administrative unit to this {currentParent?.type || "registry"}.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalItems={filteredLocations.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
                itemsPerPageOptions={[6, 9, 18, 36]}
            />

            <LocationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                location={selectedLocation}
                parent={currentParent}
                onSave={handleSave}
            />
        </div>
    );
};

export default LocationsManagement;
