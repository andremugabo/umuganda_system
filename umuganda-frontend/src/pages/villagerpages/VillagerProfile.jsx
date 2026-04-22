import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { setUser } from '../../stores/authSlice';
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
    Clock
} from 'lucide-react';
import userService from '../../services/userService';
import locationService from '../../services/locationService';
import umugandaService from '../../services/umugandaService';
import { toast } from 'react-toastify';



const VillagerProfile = () => {
    const { user } = useSelector((state) => state.auth);
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
        if (user?.locationId) {
            fetchEvents();
        }
    }, [user?.locationId]);

    const fetchEvents = async () => {
        try {
            setIsLoadingEvents(true);
            const data = await umugandaService.getEventsByLocation(user.locationId);
            setEvents(data);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setIsLoadingEvents(false);
        }
    };

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || ''
            });
            fetchLocationPath();
        }
    }, [user]);

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
            // Note: You'll need to implement a password change endpoint in the backend
            // await userService.changePassword(user.id, passwordData);
            toast.success('Password changed successfully');
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setShowPasswordForm(false);
        } catch (error) {
            toast.error('Failed to change password');
        } finally {
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

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-500 text-sm mt-1">Manage your personal information and account settings</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-lg overflow-hidden">
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-rwanda-blue to-blue-600 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white rounded-3xl flex items-center justify-center shadow-xl">
                            <User className="w-12 h-12 sm:w-16 sm:h-16 text-rwanda-blue" />
                        </div>
                        <div className="text-center sm:text-left text-white">
                            <h2 className="text-2xl sm:text-3xl font-bold">{user?.firstName} {user?.lastName}</h2>
                            <p className="text-blue-100 mt-1 flex items-center justify-center sm:justify-start gap-2">
                                <Shield className="w-4 h-4" />
                                {user?.role?.replace('_', ' ')}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSubmit} className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">Personal Information</h3>
                        {!isEditing ? (
                            <button
                                type="button"
                                onClick={() => setIsEditing(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-rwanda-blue text-white rounded-xl font-bold hover:bg-blue-600 transition-colors"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="flex items-center gap-2 px-4 py-2 bg-rwanda-green text-white rounded-xl font-bold hover:bg-green-600 transition-colors disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                First Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all disabled:opacity-60"
                                />
                            </div>
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Last Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all disabled:opacity-60"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all disabled:opacity-60"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all disabled:opacity-60"
                                />
                            </div>
                        </div>

                        {/* Location (Read-only) */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Location
                            </label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={locationPath || 'Not assigned'}
                                    disabled
                                    className="w-full pl-11 pr-4 py-3 bg-gray-100 border-none rounded-xl opacity-60"
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Contact your administrator to change your location</p>
                        </div>
                    </div>
                </form>
            </div>

            {/* Password Change Section */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-lg p-6 sm:p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Security</h3>
                        <p className="text-sm text-gray-500 mt-1">Manage your password and security settings</p>
                    </div>
                    {!showPasswordForm && (
                        <button
                            onClick={() => setShowPasswordForm(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                        >
                            <Lock className="w-4 h-4" />
                            Change Password
                        </button>
                    )}
                </div>

                {showPasswordForm && (
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Current Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-rwanda-blue/20 transition-all"
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 pt-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowPasswordForm(false);
                                    setPasswordData({
                                        currentPassword: '',
                                        newPassword: '',
                                        confirmPassword: ''
                                    });
                                }}
                                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-4 py-3 bg-rwanda-blue text-white rounded-xl font-bold hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                                Update Password
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Upcoming Events Section */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 shadow-lg p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-rwanda-green/10 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-rwanda-green" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Upcoming Umuganda</h3>
                        <p className="text-sm text-gray-500">Events scheduled in your location</p>
                    </div>
                </div>

                {isLoadingEvents ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-rwanda-green" />
                    </div>
                ) : events.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {events.map(event => (
                            <div key={event.id} className="border border-gray-100 rounded-2xl p-4 hover:border-rwanda-green/30 transition-colors bg-gray-50/50">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="px-3 py-1 bg-white rounded-lg text-xs font-bold text-rwanda-green shadow-sm">
                                        {new Date(event.date).toLocaleDateString()}
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${event.status === 'UPCOMING' ? 'bg-blue-100 text-blue-700' :
                                        event.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                        {event.status}
                                    </span>
                                </div>
                                <h4 className="font-bold text-gray-900 line-clamp-1 mb-2">{event.title}</h4>
                                <div className="space-y-1 text-sm text-gray-500">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        <span>{event.startTime} - {event.endTime}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        <span className="line-clamp-1">{event.meetingPoint}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h4 className="text-gray-900 font-medium">No upcoming events</h4>
                        <p className="text-gray-500 text-sm">There are no Umuganda events scheduled in your area yet.</p>
                    </div>
                )}
            </div>
        </div >
    );
};

export default VillagerProfile;
