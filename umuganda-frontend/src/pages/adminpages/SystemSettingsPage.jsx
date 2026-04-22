import React, { useState } from 'react';
import { 
    Settings, 
    Globe, 
    Calendar, 
    ShieldCheck, 
    Save, 
    RefreshCcw,
    LayoutDashboard,

    Mail,
    MapPin,
    AlertCircle,
    CheckCircle2,
    Database,
    Zap
} from 'lucide-react';
import { toast } from 'react-toastify';

const SystemSettingsPage = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('branding');

    // Simulated settings state
    const [settings, setSettings] = useState({
        systemName: 'Umuganda Management System',
        motto: 'Twese Hamwe, Buri Kigero',
        supportEmail: 'support@gov.rw',
        defaultLat: -1.9441,
        defaultLng: 30.0619, // Kigali coordinates
        umugandaFrequency: 'MONTHLY',
        nextNationalDate: '2026-05-30',
        maintenanceMode: false,
        auditRetentionDays: 90
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsLoading(false);
        toast.success("System configurations updated successfully!");
    };

    const tabs = [
        { id: 'branding', label: 'Branding', icon: LayoutDashboard },

        { id: 'geographic', label: 'Geography', icon: Globe },
        { id: 'policy', label: 'Umuganda Policy', icon: Calendar },
        { id: 'security', label: 'Advanced', icon: ShieldCheck },
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Settings className="w-8 h-8 text-rwanda-blue" />
                        System Settings
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">Configure global system parameters and national policies.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => window.location.reload()}
                        className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-rwanda-blue transition-all"
                        title="Reset View"
                    >
                        <RefreshCcw className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={handleSave}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-8 py-3 bg-rwanda-blue text-white rounded-xl font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 active:scale-95 disabled:opacity-50"
                    >
                        {isLoading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                        Save Changes
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Navigation Sidebar */}
                <div className="lg:col-span-1 space-y-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-bold transition-all ${
                                    activeTab === tab.id 
                                    ? 'bg-white text-rwanda-blue shadow-md border-l-4 border-rwanda-blue' 
                                    : 'text-gray-400 hover:bg-gray-50 hover:text-gray-600'
                                }`}
                            >
                                <Icon className="w-5 h-5" />
                                {tab.label}
                            </button>
                        );
                    })}

                    <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-100/50">
                        <Zap className="w-8 h-8 text-rwanda-blue mb-3" />
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider mb-2">Pro Tip</h4>
                        <p className="text-xs text-slate-600 leading-relaxed">Changes to mapping coordinates will synchronize across all dashboard instances nationally.</p>
                    </div>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 p-8 min-h-[500px]">
                        
                        {activeTab === 'branding' && (
                            <div className="space-y-8 animate-in fly-in-bottom duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-rwanda-blue">
                                        <LayoutDashboard className="w-6 h-6" />
                                    </div>

                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">General Branding</h3>
                                        <p className="text-sm text-gray-500">Official identification and contact details</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">System Title</label>
                                        <input 
                                            type="text" 
                                            name="systemName"
                                            value={settings.systemName}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 outline-none text-sm font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Official Motto</label>
                                        <input 
                                            type="text" 
                                            name="motto"
                                            value={settings.motto}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 outline-none text-sm font-bold"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Support Email</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                                            <input 
                                                type="email" 
                                                name="supportEmail"
                                                value={settings.supportEmail}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 outline-none text-sm font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'geographic' && (
                            <div className="space-y-8 animate-in fly-in-bottom duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-rwanda-green">
                                        <Globe className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">National Mapping Defaults</h3>
                                        <p className="text-sm text-gray-500">Center point for geographic visualizations</p>
                                    </div>
                                </div>

                                <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-2xl flex items-start gap-4">
                                    <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
                                    <p className="text-xs text-amber-800 leading-relaxed font-medium">
                                        Updating these coordinates will affect the initial view of all interactive maps in the System Overview for all administrators.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Default Latitude</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                            <input 
                                                type="number" 
                                                name="defaultLat"
                                                step="0.0001"
                                                value={settings.defaultLat}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 outline-none text-sm font-bold"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Default Longitude</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                            <input 
                                                type="number" 
                                                name="defaultLng"
                                                step="0.0001"
                                                value={settings.defaultLng}
                                                onChange={handleChange}
                                                className="w-full pl-12 pr-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 outline-none text-sm font-bold"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'policy' && (
                            <div className="space-y-8 animate-in fly-in-bottom duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                                        <Calendar className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Umuganda Scheduling Policy</h3>
                                        <p className="text-sm text-gray-500">Define national frequency and next session</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">National Frequency</label>
                                        <select 
                                            name="umugandaFrequency"
                                            value={settings.umugandaFrequency}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 outline-none text-sm font-bold text-gray-700"
                                        >
                                            <option value="MONTHLY">Last Saturday of every month</option>
                                            <option value="BI_WEEKLY">Every two weeks</option>
                                            <option value="QUARTERLY">Every quarter</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Next National Umuganda Date</label>
                                        <input 
                                            type="date" 
                                            name="nextNationalDate"
                                            value={settings.nextNationalDate}
                                            onChange={handleChange}
                                            className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-rwanda-blue/20 outline-none text-sm font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-8 animate-in fly-in-bottom duration-300">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                                        <ShieldCheck className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Advanced Security & Maintenance</h3>
                                        <p className="text-sm text-gray-500">Critical system-wide infrastructure toggles</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-500">
                                                <RefreshCcw className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-gray-800">Maintenance Mode</h4>
                                                <p className="text-xs text-gray-500">Block public access while updating national registry</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                name="maintenanceMode"
                                                checked={settings.maintenanceMode}
                                                onChange={handleChange}
                                                className="sr-only peer" 
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rwanda-blue"></div>
                                        </label>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                            <Database className="w-3 h-3" />
                                            Audit Log Retention (Days)
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <input 
                                                type="range" 
                                                name="auditRetentionDays"
                                                min="30"
                                                max="365"
                                                step="30"
                                                value={settings.auditRetentionDays}
                                                onChange={handleChange}
                                                className="flex-1 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-rwanda-blue"
                                            />
                                            <span className="w-12 text-center font-black text-rwanda-blue text-sm">{settings.auditRetentionDays}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-2 text-gray-400 text-xs justify-center font-medium">
                        <CheckCircle2 className="w-3 h-3 text-rwanda-green" />
                        Infrastructure verified and active • System Version 2.4.0-premium
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SystemSettingsPage;
