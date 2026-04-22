import React, { useState, useEffect } from 'react';
import Pagination from '../../components/ui/Pagination';
import {
    Calendar,
    Search,
    Plus,
    MapPin,
    Clock,
    Trash2,
    Edit3,
    Loader2,
    Filter,
    ChevronRight,
    Users
} from 'lucide-react';
import umugandaService from '../../services/umugandaService';
import locationService from '../../services/locationService';
import { toast } from 'react-toastify';
import UmugandaModal from '../../components/ui/UmugandaModal';

const UmugandaManagement = () => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [locationMap, setLocationMap] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9); // 3-col grid looks best in multiples of 3

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setIsLoading(true);
            const [eventData, locationData] = await Promise.all([
                umugandaService.getAllEvents(),
                locationService.getAllLocations()
            ]);

            setEvents(eventData);
            setFilteredEvents(eventData);

            // Build location lookup (Full path)
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
            toast.error("Failed to load events");
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEvents = async () => {
        try {
            const data = await umugandaService.getAllEvents();
            setEvents(data);
        } catch (error) {
            toast.error("Failed to refresh events");
        }
    };

    useEffect(() => {
        const result = events.filter(e =>
            e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            locationMap[e.locationId]?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredEvents(result);
        setCurrentPage(1);
    }, [searchTerm, events, locationMap]);

    // Compute current page slice
    const paginatedEvents = filteredEvents.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSave = async (data) => {
        try {
            if (selectedEvent) {
                await umugandaService.updateEvent(selectedEvent.id, data);
                toast.success("Event updated successfully");
            } else {
                await umugandaService.createEvent(data);
                toast.success("Event scheduled successfully");
            }
            fetchEvents();
            setIsModalOpen(false);
        } catch (error) {
            toast.error("Error saving event");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to cancel this Umuganda event?")) {
            try {
                await umugandaService.deleteEvent(id);
                toast.success("Event cancelled successfully");
                fetchEvents();
            } catch (error) {
                toast.error("Failed to delete event");
            }
        }
    };

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-12 h-12 text-rwanda-blue animate-spin" />
                <p className="text-gray-500 font-medium font-bold">Loading Umuganda schedule...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 font-bold">Umuganda Management</h1>
                    <p className="text-gray-500 text-sm font-bold">Schedule and manage community work events.</p>
                </div>
                <button
                    onClick={() => { setSelectedEvent(null); setIsModalOpen(true); }}
                    className="flex items-center justify-center gap-2 bg-rwanda-blue text-white px-5 py-2.5 rounded-xl hover:bg-blue-600 transition-all font-semibold shadow-lg shadow-blue-500/10"
                >
                    <Plus className="w-5 h-5" />
                    Schedule New
                </button>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by description or location..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all text-sm font-bold"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-xl transition-colors">
                    <Filter className="w-5 h-5" />
                </button>
            </div>

            {/* Events List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedEvents.map((event) => (
                    <div key={event.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group overflow-hidden flex flex-col">
                        <div className="p-6 space-y-4 flex-1">
                            {/* Date Badge */}
                            <div className="flex items-center justify-between">
                                <div className="px-3 py-1 bg-rwanda-blue/10 text-rwanda-blue text-[10px] font-bold rounded-full uppercase tracking-widest">
                                    Upcoming Event
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={() => { setSelectedEvent(event); setIsModalOpen(true); }}
                                        className="p-1.5 text-gray-400 hover:text-rwanda-blue transition-colors"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(event.id)}
                                        className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-gray-800 line-clamp-2 leading-tight">
                                    {event.description}
                                </h3>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-gray-500 font-bold">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    {formatDate(event.date)}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-500 font-bold">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    Starts at {formatTime(event.date)}
                                </div>
                                <div className="flex items-start gap-2 text-sm text-gray-500 font-bold">
                                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                                    <span className="line-clamp-2">{locationMap[event.locationId] || 'Unknown Location'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bottom Action */}
                        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between group-hover:bg-rwanda-blue/5 transition-colors">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="text-xs font-bold text-gray-500">Automatic Attendance</span>
                            </div>
                            <button className="text-rwanda-blue p-1 hover:bg-white rounded-lg transition-all">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}

                {filteredEvents.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                        <h3 className="text-lg font-bold text-gray-400 font-bold">No events found</h3>
                        <p className="text-gray-400 text-sm font-bold">Try adjusting your search or schedule a new event.</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalItems={filteredEvents.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(val) => { setItemsPerPage(val); setCurrentPage(1); }}
                itemsPerPageOptions={[6, 9, 18, 36]}
            />

            <UmugandaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                event={selectedEvent}
                onSave={handleSave}
            />
        </div>
    );
};

export default UmugandaManagement;
