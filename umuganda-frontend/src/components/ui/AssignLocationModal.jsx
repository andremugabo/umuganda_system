import React, { useState, useEffect } from 'react';
import { X, Save, MapPin, ChevronRight, Loader2 } from 'lucide-react';
import locationService from '../../services/locationService';
import { toast } from 'react-toastify';

const AssignLocationModal = ({ isOpen, onClose, user, onAssign }) => {
    const [loading, setLoading] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [cells, setCells] = useState([]);
    const [villages, setVillages] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedSector, setSelectedSector] = useState('');
    const [selectedCell, setSelectedCell] = useState('');
    const [selectedVillage, setSelectedVillage] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchProvinces();
        }
    }, [isOpen]);

    const fetchProvinces = async () => {
        try {
            const data = await locationService.getByType('PROVINCE');
            setProvinces(data);
        } catch (e) {
            toast.error("Error loading provinces");
        }
    };

    const handleProvinceChange = async (id) => {
        setSelectedProvince(id);
        setSelectedDistrict('');
        setSelectedSector('');
        setSelectedCell('');
        setSelectedVillage('');
        setDistricts([]);
        setSectors([]);
        setCells([]);
        setVillages([]);
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
        setCells([]);
        setVillages([]);
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
        setVillages([]);
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
        if (!selectedVillage) {
            toast.warn("Please select a village");
            return;
        }
        setLoading(true);
        try {
            await onAssign(user.id, selectedVillage);
            onClose();
        } catch (error) {
            toast.error("Failed to assign location");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-rwanda-blue text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Assign Village</h2>
                            <p className="text-blue-100 text-xs">Path: {user?.firstName} {user?.lastName}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Hierarchical Selects */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-4">
                        {/* Province */}
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

                        {/* District */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">District</label>
                            <select
                                value={selectedDistrict}
                                onChange={(e) => handleDistrictChange(e.target.value)}
                                disabled={!selectedProvince}
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all font-medium text-gray-700 appearance-none cursor-pointer disabled:opacity-50"
                            >
                                <option value="">{selectedProvince ? 'Select District' : 'First select Province'}</option>
                                {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                            </select>
                        </div>

                        {/* Sector */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Sector</label>
                            <select
                                value={selectedSector}
                                onChange={(e) => handleSectorChange(e.target.value)}
                                disabled={!selectedDistrict}
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all font-medium text-gray-700 appearance-none cursor-pointer disabled:opacity-50"
                            >
                                <option value="">{selectedDistrict ? 'Select Sector' : 'First select District'}</option>
                                {sectors.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                            </select>
                        </div>

                        {/* Cell */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Cell</label>
                            <select
                                value={selectedCell}
                                onChange={(e) => handleCellChange(e.target.value)}
                                disabled={!selectedSector}
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all font-medium text-gray-700 appearance-none cursor-pointer disabled:opacity-50"
                            >
                                <option value="">{selectedSector ? 'Select Cell' : 'First select Sector'}</option>
                                {cells.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        {/* Village */}
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-rwanda-blue uppercase tracking-wider ml-1">Target Village</label>
                            <select
                                value={selectedVillage}
                                onChange={(e) => setSelectedVillage(e.target.value)}
                                disabled={!selectedCell}
                                className="w-full px-4 py-3 bg-blue-50/50 border-2 border-dashed border-rwanda-blue/20 rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all font-bold text-gray-700 appearance-none cursor-pointer disabled:opacity-50"
                            >
                                <option value="">{selectedCell ? 'Select Village' : 'First select Cell'}</option>
                                {villages.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="pt-4 flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-6 py-4 border-2 border-gray-100 text-gray-500 font-bold rounded-2xl hover:bg-gray-50 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading || !selectedVillage}
                            className="flex-3 px-10 py-4 bg-rwanda-blue text-white font-bold rounded-2xl hover:bg-blue-600 shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Assign Location
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignLocationModal;
