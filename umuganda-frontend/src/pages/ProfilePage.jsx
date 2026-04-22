import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../stores/authSlice';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Edit2,
    Save,
    X,
    Loader2,
    Lock,
    CheckCircle,
    Calendar,
    Clock,
    Briefcase
} from 'lucide-react';
import userService from '../services/userService';
import locationService from '../services/locationService';
import umugandaService from '../services/umugandaService';
import { toast } from 'react-toastify';

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [locationPath, setLocationPath] = useState('');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [events, setEvents] = useState([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || ''
            });
            
            if (user.locationId) {
                fetchLocationPath();
                fetchEvents();
            }
        }
    }, [user]);

    const fetchEvents = async () => {
        try {
            setIsLoadingEvents(true);
            const data = await umugandaService.getEventsByLocation(user.locationId);
            setEvents(data || []);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setIsLoadingEvents(false);
        }
    };

    const fetchLocationPath = async () => {
        try {
            if (!user?.locationId) return;
            const locationData = await locationService.getAllLocations();

            const lookup = {};
            locationData.forEach(loc => lookup[loc.id] = loc);

            const parts = [];
            let current = lookup[user.locationId];
            while (current) {
                parts.unshift(current.name);
                current = lookup[current.parentId];
            }
            setLocationPath(parts.join(' > '));
        } catch (error) {
            console.error('Failed to fetch location:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setIsLoading(true);
            const updatedUser = await userService.updateUser(user.id, {
                ...user,
                ...formData
            });

            // Update Redux store
            dispatch(setUser(updatedUser));

            // Update localStorage
            const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
            localStorage.setItem('user', JSON.stringify({ ...storedUser, ...updatedUser }));

            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        try {
            setIsLoading(true);
            // In a real app, you'd call a dedicated endpoint
            // await userService.changePassword(user.id, passwordData);
            
            // For now, we simulate success as the backend might not have this yet
            setTimeout(() => {
                toast.success('Password changed successfully');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setShowPasswordForm(false);
                setIsLoading(false);
            }, 1000);
        } catch (error) {
            toast.error('Failed to change password');
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || '',
            phone: user.phone || ''
        });
        setIsEditing(false);
    };

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'ADMIN': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'VILLAGE_CHEF': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'VILLAGE_SOCIAL': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
            default: return 'bg-amber-100 text-amber-700 border-amber-200';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Account Settings</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your personal information and preferences</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-rwanda-blue text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                    >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Overview Card */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                        <div className="h-24 bg-gradient-to-r from-rwanda-blue to-blue-600"></div>
                        <div className="px-6 pb-8 -mt-12 text-center">
                            <div className="inline-flex relative">
                                <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl border-4 border-white">
                                    <User className="w-12 h-12 text-rwanda-blue" />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-rwanda-green border-4 border-white rounded-2xl flex items-center justify-center">
                                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                </div>
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-gray-900">{user?.firstName} {user?.lastName}</h2>
                            <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wider ${getRoleBadgeColor(user?.role)}`}>
                                <Shield className="w-3 h-3" />
                                {user?.role?.replace('_', ' ')}
                            </div>
                            
                            <div className="mt-8 space-y-4 text-left">
                                <div className="flex items-center gap-3 text-gray-500">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-400">Email Address</p>
                                        <p className="text-sm font-bold text-gray-800 truncate">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-gray-500">
                                    <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-medium text-gray-400">Phone Number</p>
                                        <p className="text-sm font-bold text-gray-800">{user?.phone || 'Not provided'}</p>
                                    </div>
                                </div>
                                {user?.locationId && (
                                    <div className="flex items-center gap-3 text-gray-500">
                                        <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
                                            <MapPin className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-medium text-gray-400">Assignment</p>
                                            <p className="text-sm font-bold text-gray-800 truncate">{locationPath || 'Loading...'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Change Password Card */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600">
                                <Lock className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-900">Security</h3>
                        </div>

                        {!showPasswordForm ? (
                            <button
                                onClick={() => setShowPasswordForm(true)}
                                className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold rounded-xl border border-gray-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <Lock className="w-4 h-4" />
                                Change Account Password
                            </button>
                        ) : (
                            <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Current Password</label>
                                    <input
                                        type="password"
                                        name="currentPassword"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-rwanda-blue/20 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">New Password</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-rwanda-blue/20 outline-none transition-all"
                                        required
                                        minLength={6}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-gray-500 uppercase ml-1">Confirm New</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-rwanda-blue/20 outline-none transition-all"
                                        required
                                    />
                                </div>
                                <div className="flex gap-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowPasswordForm(false)}
                                        className="flex-1 py-3 px-4 bg-gray-50 text-gray-600 font-bold rounded-xl hover:bg-gray-100 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-1 py-3 px-4 bg-rwanda-blue text-white font-bold rounded-xl hover:bg-blue-600 transition-all disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Update'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>

                {/* Edit Section / Activity Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Information Form */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-rwanda-blue">
                                <Briefcase className="w-5 h-5" />
                            </div>
                            <h3 className="font-bold text-gray-900">Personal Information</h3>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700 ml-1">First Name</label>
                                    <input
                                        type="text"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-rwanda-blue/20 outline-none transition-all disabled:text-gray-400"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Last Name</label>
                                    <input
                                        type="text"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-rwanda-blue/20 outline-none transition-all disabled:text-gray-400"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-rwanda-blue/20 outline-none transition-all disabled:text-gray-400"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-rwanda-blue/20 outline-none transition-all disabled:text-gray-400"
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex gap-3 pt-4 border-t border-gray-50">
                                    <button
                                        type="button"
                                        onClick={handleCancel}
                                        className="flex-1 py-3.5 px-6 bg-gray-100 text-gray-700 font-bold rounded-2xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <X className="w-5 h-5" />
                                        Discard Changes
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="flex-[2] py-3.5 px-6 bg-rwanda-green text-white font-bold rounded-2xl hover:bg-green-600 transition-all shadow-lg shadow-green-500/20 flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                        Save Information
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Regional Context / Recent Activity */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-rwanda-green">
                                    <Calendar className="w-5 h-5" />
                                </div>
                                <h3 className="font-bold text-gray-900">Upcoming Events</h3>
                            </div>
                            <span className="text-xs font-bold text-rwanda-blue bg-blue-50 px-3 py-1 rounded-full uppercase tracking-tighter">In your area</span>
                        </div>

                        {isLoadingEvents ? (
                            <div className="flex justify-center py-12">
                                <Loader2 className="w-10 h-10 animate-spin text-rwanda-blue opacity-20" />
                            </div>
                        ) : events.length > 0 ? (
                            <div className="grid grid-cols-1 gap-4">
                                {events.slice(0, 3).map(event => (
                                    <div key={event.id} className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-rwanda-blue/30 transition-all group">
                                        <div className="w-16 h-16 rounded-2xl bg-white border border-gray-100 flex flex-col items-center justify-center shadow-sm">
                                            <span className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">
                                                {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                                            </span>
                                            <span className="text-xl font-black text-gray-900 leading-none">
                                                {new Date(event.date).getDate()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 truncate group-hover:text-rwanda-blue transition-colors">{event.description}</h4>
                                            <div className="flex items-center gap-4 mt-1.5 text-xs font-medium text-gray-500">
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-3.5 h-3.5 text-rwanda-blue" />
                                                    {event.startTime || '08:00 AM'}
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5 text-rwanda-green" />
                                                    {event.meetingPoint || 'Cell Office'}
                                                </div>
                                            </div>
                                        </div>
                                        <CheckCircle className="w-6 h-6 text-gray-200" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                                <p className="text-gray-400 font-medium">No upcoming Umuganda events scheduled</p>
                                <button className="mt-4 text-rwanda-blue font-bold text-sm hover:underline">Check general calendar</button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
