import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, MapPin, Layers, Hash } from 'lucide-react';

const LocationModal = ({ isOpen, onClose, location, parent, onSave }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (location) {
            reset({
                name: location.name,
                type: location.type,
                ref: location.ref,
                parentId: location.parentId
            });
        } else {
            reset({
                name: '',
                type: parent ? getNextType(parent.type) : 'PROVINCE',
                ref: '',
                parentId: parent ? parent.id : null
            });
        }
    }, [location, parent, reset]);

    const getNextType = (parentType) => {
        switch (parentType) {
            case 'PROVINCE': return 'DISTRICT';
            case 'DISTRICT': return 'SECTOR';
            case 'SECTOR': return 'CELL';
            case 'CELL': return 'VILLAGE';
            default: return 'PROVINCE';
        }
    };

    if (!isOpen) return null;

    const onSubmit = (data) => {
        onSave(location?.id, {
            ...data,
            parentId: parent ? parent.id : (location ? location.parentId : null)
        });
    };

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
                            <h2 className="text-xl font-bold">{location ? 'Edit Location' : 'New Location'}</h2>
                            <p className="text-blue-100 text-xs">
                                {parent ? `Adding under ${parent.name}` : 'Creating top-level unit'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Location Name</label>
                        <input
                            {...register('name', { required: 'Name is required' })}
                            placeholder="e.g. Kigali, Gasabo, Kimironko..."
                            className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all font-medium text-gray-700"
                        />
                        {errors.name && <span className="text-red-500 text-xs ml-1">{errors.name.message}</span>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Type</label>
                            <div className="relative">
                                <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    {...register('type', { required: true })}
                                    className="w-full pl-9 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all font-medium text-gray-700 appearance-none cursor-pointer"
                                    disabled={!!parent}
                                >
                                    <option value="PROVINCE">Province</option>
                                    <option value="DISTRICT">District</option>
                                    <option value="SECTOR">Sector</option>
                                    <option value="CELL">Cell</option>
                                    <option value="VILLAGE">Village</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Ref Code</label>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    {...register('ref', { required: 'Ref is required' })}
                                    placeholder="e.g. 01, 102..."
                                    className="w-full pl-9 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all font-medium text-gray-700 font-mono"
                                />
                            </div>
                            {errors.ref && <span className="text-red-500 text-xs ml-1">{errors.ref.message}</span>}
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
                            className="flex-3 px-10 py-4 bg-rwanda-blue text-white font-bold rounded-2xl hover:bg-blue-600 shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                            <Save className="w-5 h-5" />
                            {location ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LocationModal;
