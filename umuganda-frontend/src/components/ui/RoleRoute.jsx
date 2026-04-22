import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RoleRoute = ({ allowedRoles }) => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        // Redirect to their respective dashboard if they don't have access
        const dashboardPath = user.role === 'ADMIN' ? '/admin/dashboard' : 
                             user.role === 'VILLAGE_CHEF' ? '/chef/dashboard' :
                             user.role === 'VILLAGE_SOCIAL' ? '/social/dashboard' :
                             '/villager/dashboard';
                             
        return <Navigate to={dashboardPath} replace />;
    }

    return <Outlet />;
};

export default RoleRoute;
