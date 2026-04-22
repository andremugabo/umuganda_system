import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Save, User, Mail, Phone, Shield } from 'lucide-react';

const EditUserModal = ({ isOpen, onClose, user, onUpdate }) => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone || '',
                role: user.role
            });
        }
    }, [user, reset]);

    if (!isOpen) return null;

    const onSubmit = (data) => {
        onUpdate(user.id, data);
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Modal Header */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-rwanda-blue text-white">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                            <User className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">Edit Citizen</h2>
                            <p className="text-blue-100 text-xs">Update account details and permissions</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">First Name</label>
                            <input
                                {...register('firstName', { required: 'Required' })}
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all font-medium text-gray-700"
                            />
                            {errors.firstName && <span className="text-red-500 text-[10px] ml-1">{errors.firstName.message}</span>}
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Last Name</label>
                            <input
                                {...register('lastName', { required: 'Required' })}
                                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all font-medium text-gray-700"
                            />
                            {errors.lastName && <span className="text-red-500 text-[10px] ml-1">{errors.lastName.message}</span>}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                {...register('email', { required: 'Required' })}
                                type="email"
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all font-medium text-gray-700"
                            />
                        </div>
                        {errors.email && <span className="text-red-500 text-[10px] ml-1">{errors.email.message}</span>}
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                {...register('phone')}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all font-medium text-gray-700"
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">System Role</label>
                        <div className="relative">
                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <select
                                {...register('role', { required: 'Required' })}
                                className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all font-medium text-gray-700 appearance-none cursor-pointer"
                            >
                                <option value="ADMIN">Admin</option>
                                <option value="VILLAGE_CHEF">Village Chef</option>
                                <option value="VILLAGE_SOCIAL">Social Worker</option>
                                <option value="VILLAGER">Villager</option>
                            </select>
                        </div>
                    </div>

                    {/* Form Actions */}
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
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditUserModal;
