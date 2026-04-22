import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const DashboardLayout = () => {
    const { user } = useSelector((state) => state.auth);
    const [isOpen, setIsOpen] = useState(true);
    const location = useLocation();

    // Handle auto-collapse on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsOpen(false);
            } else {
                setIsOpen(true);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Get current title from path
    const getPageTitle = () => {
        const paths = location.pathname.split('/').filter(Boolean);
        if (paths.length > 1) {
            return paths[paths.length - 1].replace('-', ' ');
        }
        return "Dashboard";
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />

            <main
                className={`transition-all duration-300 min-h-screen flex flex-col ${isOpen ? 'pl-64' : 'pl-20'
                    }`}
            >
                <Topbar toggleSidebar={() => setIsOpen(!isOpen)} title={getPageTitle()} />

                <div className="flex-1 p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
