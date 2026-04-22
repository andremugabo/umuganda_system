import React, { useState, useEffect } from 'react';
import { X, Save, Calendar, Clock, MapPin, Loader2, Info } from 'lucide-react';
import locationService from '../../services/locationService';
import { toast } from 'react-toastify';

const UmugandaModal = ({ isOpen, onClose, event, onSave }) => {
    const [loading, setLoading] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [cells, setCells] = useState([]);
    const [villages, setVillages] = useState([]);

    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedSector, setSelectedSector] = useState('');
    const [selectedCell, setSelectedCell] = useState('');
    const [selectedVillage, setSelectedVillage] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchProvinces();
            if (event) {
                setDescription(event.description || '');
                // Handle date/time splitting from ISO string
                if (event.date) {
                    const dt = new Date(event.date);
                    setDate(dt.toISOString().split('T')[0]);
                    setTime(dt.toTimeString().split(' ')[0].substring(0, 5));
                }
                if (event.locationId) {
                    // Note: Initializing full hierarchy from a single ID is complex without all location data
                    // For now, we'll reset selection when editing or let user re-pick
                    // A better way would be to fetch breadcrumbs from backend
                    setSelectedVillage(event.locationId);
                }
            } else {
                setDescription('');
                setDate('');
                setTime('');
                resetSelection();
            }
        }
    }, [isOpen, event]);

    const resetSelection = () => {
        setSelectedProvince('');
        setSelectedDistrict('');
        setSelectedSector('');
        setSelectedCell('');
        setSelectedVillage('');
    };

    const fetchProvinces = async () => {
        try {
            const data = await locationService.getByType('PROVINCE');
            setProvinces(data);
        } catch (e) {
            toast.error("Error loading location data");
        }
    };

    const handleProvinceChange = async (id) => {
        setSelectedProvince(id);
        setSelectedDistrict('');
        setSelectedSector('');
        setSelectedCell('');
        setSelectedVillage('');
        setDistricts([]);
        if (id) {
            const data = await locationService.getChildren(id);
            setDistricts(data);
        }
    };

    const handleDistrictChange = async (id) => {
        setSelectedDistrict(id);
        setSelectedSector('');
        setSelectedCell('');
        setSelectedVillage('');
        setSectors([]);
        if (id) {
            const data = await locationService.getChildren(id);
            setSectors(data);
        }
    };

    const handleSectorChange = async (id) => {
        setSelectedSector(id);
        setSelectedCell('');
        setSelectedVillage('');
        setCells([]);
        if (id) {
            const data = await locationService.getChildren(id);
            setCells(data);
        }
    };

    const handleCellChange = async (id) => {
        setSelectedCell(id);
        setSelectedVillage('');
        setVillages([]);
        if (id) {
            const data = await locationService.getChildren(id);
            setVillages(data);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!description || !date || !time || !selectedVillage) {
            toast.warn("Please fill all required fields");
            return;
        }

        setLoading(true);
        try {
            const dateTime = `${date}T${time}:00`;
            const payload = {
                description,
                date: dateTime,
                locationId: selectedVillage
            };
            await onSave(payload);
            onClose();
        } catch (error) {
            toast.error("Failed to save Umuganda event");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-rwanda-blue text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">{event ? 'Edit Umuganda' : 'Schedule Umuganda'}</h2>
                            <p className="text-blue-100 text-xs">Community service event planning</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Event Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe the activities (e.g., Tree planting, Road maintenance...)"
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all font-medium text-gray-700 h-24 resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all font-medium text-gray-700"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Start Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all font-medium text-gray-700"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Hierarchical Selection */}
                    <div className="space-y-4 pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2 mb-2">
                            <MapPin className="w-4 h-4 text-rwanda-blue" />
                            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-tight">Assignment Location</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Province</label>
                                <select
                                    value={selectedProvince}
                                    onChange={(e) => handleProvinceChange(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all font-medium text-gray-700 appearance-none cursor-pointer"
                                >
                                    <option value="">Select Province</option>
                                    {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">District</label>
                                <select
                                    value={selectedDistrict}
                                    onChange={(e) => handleDistrictChange(e.target.value)}
                                    disabled={!selectedProvince}
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all font-medium text-gray-700 appearance-none cursor-pointer disabled:opacity-50"
                                >
                                    <option value="">{selectedProvince ? 'Select District' : 'Pending Province'}</option>
                                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Sector</label>
                                <select
                                    value={selectedSector}
                                    onChange={(e) => handleSectorChange(e.target.value)}
                                    disabled={!selectedDistrict}
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all font-medium text-gray-700 appearance-none cursor-pointer disabled:opacity-50"
                                >
                                    <option value="">{selectedDistrict ? 'Select' : '-'}</option>
                                    {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Cell</label>
                                <select
                                    value={selectedCell}
                                    onChange={(e) => handleCellChange(e.target.value)}
                                    disabled={!selectedSector}
                                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all font-medium text-gray-700 appearance-none cursor-pointer disabled:opacity-50"
                                >
                                    <option value="">{selectedSector ? 'Select' : '-'}</option>
                                    {cells.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-rwanda-blue uppercase tracking-wider ml-1">Village</label>
                                <select
                                    value={selectedVillage}
                                    onChange={(e) => setSelectedVillage(e.target.value)}
                                    disabled={!selectedCell}
                                    className="w-full px-4 py-3 bg-blue-50/50 border-2 border-dashed border-rwanda-blue/20 rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all font-bold text-gray-700 appearance-none cursor-pointer disabled:opacity-50"
                                >
                                    <option value="">{selectedCell ? 'Select' : '-'}</option>
                                    {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-50 rounded-2xl p-4 flex gap-3 border border-amber-100">
                        <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-amber-800 leading-relaxed font-medium">
                            Scheduling this event will automatically generate attendance records for all citizens registered in the selected village.
                        </p>
                    </div>

                    <div className="pt-2 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border-2 border-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all font-bold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-3 px-10 py-4 bg-rwanda-blue text-white font-bold rounded-2xl hover:bg-blue-600 shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            {event ? 'Update Event' : 'Create Event'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UmugandaModal;
