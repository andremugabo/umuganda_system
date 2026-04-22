import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
    Search, 
    User, 
    Menu, 
    LogOut, 
    Settings, 
    UserCircle, 
    ChevronDown, 
    Bell,
    ChevronRight,
    Home
} from 'lucide-react';
import NotificationBell from './NotificationBell';
import { logout, reset } from '../../stores/authSlice';

const Topbar = ({ toggleSidebar, title }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [greeting, setGreeting] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) setGreeting('Good Morning');
        else if (hour < 17) setGreeting('Good Afternoon');
        else setGreeting('Good Evening');
    }, []);

    // Close dropdown on click outside
    useEffect(() => {
        const handleClickOutside = () => setDropdownOpen(false);
        if (dropdownOpen) {
            window.addEventListener('click', handleClickOutside);
        }
        return () => window.removeEventListener('click', handleClickOutside);
    }, [dropdownOpen]);

    const onLogout = () => {
        dispatch(logout());
        dispatch(reset());
        navigate('/login');
    };

    const getBreadcrumbs = () => {
        const paths = location.pathname.split('/').filter(Boolean);
        return paths.map((path, index) => {
            const url = `/${paths.slice(0, index + 1).join('/')}`;
            const isLast = index === paths.length - 1;
            return (
                <React.Fragment key={path}>
                    <ChevronRight className="w-3 h-3 mx-1 text-gray-400" />
                    {isLast ? (
                        <span className="capitalize font-bold text-gray-800">
                            {path.replace('-', ' ')}
                        </span>
                    ) : (
                        <Link to={url} className="capitalize hover:text-rwanda-blue transition-colors">
                            {path.replace('-', ' ')}
                        </Link>
                    )}
                </React.Fragment>
            );
        });
    };

    return (
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between transition-all duration-300">
            <div className="flex items-center gap-4">
                <button
                    onClick={(e) => { e.stopPropagation(); toggleSidebar(); }}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-xl text-gray-500 hover:text-rwanda-blue transition-all"
                >
                    <Menu className="w-6 h-6" />
                </button>
                
                <div className="hidden sm:flex flex-col">
                    <div className="flex items-center text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">
                        <Home className="w-2.5 h-2.5 mr-1" />
                        System
                        {getBreadcrumbs()}
                    </div>
                    <h1 className="text-xl font-black text-gray-900 tracking-tight">
                        {title || "Overview"}
                    </h1>
                </div>
            </div>

            {/* Search Bar */}
            <div className="hidden lg:flex items-center flex-1 max-w-lg mx-auto px-8">
                <div className="relative w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-rwanda-blue transition-colors" />
                    <input
                        type="text"
                        placeholder="Search for something..."
                        className="w-full bg-gray-100/50 border-2 border-transparent rounded-2xl py-2.5 pl-12 pr-4 focus:bg-white focus:border-rwanda-blue/30 focus:ring-4 focus:ring-rwanda-blue/5 outline-none transition-all text-sm font-medium placeholder:text-gray-400"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">⌘</span>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">K</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                <div className="text-right hidden xl:block border-r border-gray-100 pr-6 mr-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">{greeting}</p>
                    <p className="text-sm font-black text-gray-900">Welcome, {user?.firstName}!</p>
                </div>

                <div className="relative group">
                    <NotificationBell />
                </div>

                <div className="relative">
                    <button 
                        onClick={(e) => { e.stopPropagation(); setDropdownOpen(!dropdownOpen); }}
                        className={`flex items-center gap-3 p-1.5 pr-3 rounded-2xl transition-all duration-300 ${dropdownOpen ? 'bg-rwanda-blue/5 ring-2 ring-rwanda-blue/10' : 'hover:bg-gray-50 border border-transparent hover:border-gray-100'}`}
                    >
                        <div className="w-10 h-10 rounded-xl bg-rwanda-blue/10 flex items-center justify-center text-rwanda-blue font-bold shadow-inner">
                            <User className="w-6 h-6" />
                        </div>
                        <div className="text-left hidden sm:block">
                            <p className="text-xs font-black text-gray-900 leading-tight">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-[10px] text-rwanda-blue font-bold uppercase tracking-tighter opacity-70">
                                {user?.role?.replace('_', ' ')}
                            </p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* User Dropdown Menu */}
                    {dropdownOpen && (
                        <div 
                            className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl shadow-blue-900/10 border border-gray-100 py-3 animate-in fade-in zoom-in duration-200 overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="px-5 py-3 mb-2 border-b border-gray-50 flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-rwanda-blue/5 flex items-center justify-center text-rwanda-blue">
                                    <UserCircle className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{user?.firstName} {user?.lastName}</h4>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{user?.email}</p>
                                </div>
                            </div>
                            
                            <div className="space-y-1 px-2">
                                <Link 
                                    to={`/${user?.role?.toLowerCase().replace('_', '')}/profile`} 
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:text-rwanda-blue hover:bg-rwanda-blue/5 rounded-2xl transition-all group"
                                    onClick={() => setDropdownOpen(false)}
                                >

                                    <User className="w-5 h-5 text-gray-400 group-hover:text-rwanda-blue" />
                                    My Profile
                                </Link>
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:text-rwanda-blue hover:bg-rwanda-blue/5 rounded-2xl transition-all group">
                                    <Settings className="w-5 h-5 text-gray-400 group-hover:text-rwanda-blue" />
                                    Account Settings
                                </button>
                                <div className="h-px bg-gray-50 my-2 mx-4" />
                                <button 
                                    onClick={onLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-2xl transition-all group"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Topbar;
