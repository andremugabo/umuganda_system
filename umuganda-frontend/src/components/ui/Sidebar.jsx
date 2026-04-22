import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { sidebarConfig } from '../../config/sidebarConfig';
import { LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../stores/authSlice';
import rwandaFlag from '../../assets/rwanda_flag.png';

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const location = useLocation();

    const roleItems = sidebarConfig[user?.role] || sidebarConfig.VILLAGER;

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <aside
            className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-50 ${isOpen ? 'w-64' : 'w-20'
                }`}
        >
            <div className="flex flex-col h-full">
                {/* Logo Section */}
                <div className="p-6 flex items-center gap-3 border-b border-gray-100">
                    <img src={rwandaFlag} alt="Rwanda Logo" className="w-8 h-8 rounded-full object-cover" />
                    {isOpen && (
                        <span className="font-bold text-xl text-rwanda-blue whitespace-nowrap overflow-hidden">
                            UmugandaPlus
                        </span>
                    )}
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-2">
                    {roleItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-4 px-3 py-3 rounded-lg transition-colors group ${isActive
                                        ? 'bg-rwanda-blue text-white shadow-md'
                                        : 'text-gray-500 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon className={`w-6 h-6 shrink-0 ${isActive ? 'text-white' : 'group-hover:text-rwanda-blue'}`} />
                                {isOpen && <span className="font-medium whitespace-nowrap">{item.label}</span>}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-gray-100 space-y-4">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center gap-4 px-3 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors group`}
                    >
                        <LogOut className="w-6 h-6 shrink-0" />
                        {isOpen && <span className="font-medium whitespace-nowrap uppercase tracking-wider text-sm">Sign Out</span>}
                    </button>

                    <button
                        onClick={toggleSidebar}
                        className="flex items-center justify-center w-full p-2 text-gray-400 hover:text-rwanda-blue transition-colors"
                    >
                        {isOpen ? <ChevronLeft className="w-6 h-6" /> : <ChevronRight className="w-6 h-6" />}
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
