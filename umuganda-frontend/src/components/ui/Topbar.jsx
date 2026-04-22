import React from 'react';
import { useSelector } from 'react-redux';
import { Search, User, Menu } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Topbar = ({ toggleSidebar, title }) => {
    const { user } = useSelector((state) => state.auth);

    return (
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40 px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={toggleSidebar}
                    className="lg:hidden text-gray-500 hover:text-rwanda-blue"
                >
                    <Menu className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold text-gray-800 capitalize">
                    {title || "Overview"}
                </h1>
            </div>

            <div className="flex items-center gap-4 flex-1 justify-center max-w-md mx-auto invisible md:visible">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search anything..."
                        className="w-full bg-gray-50 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-rwanda-blue/20 transition-all text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <NotificationBell />

                <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
                        <p className="text-xs text-gray-500 font-medium lowercase italic">{user?.role?.replace('_', ' ')}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-rwanda-blue/10 flex items-center justify-center text-rwanda-blue">
                        <User className="w-6 h-6" />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Topbar;
