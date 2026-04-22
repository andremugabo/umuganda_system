import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const RoleRoute = ({ allowedRoles }) => {
    const { user } = useSelector((state) => state.auth);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Normalize user role (handle ROLE_ prefix and case sensitivity)
    const userRole = user.role?.toUpperCase().replace('ROLE_', '');
    const normalizedAllowedRoles = allowedRoles.map(r => r.toUpperCase().replace('ROLE_', ''));

    if (!normalizedAllowedRoles.includes(userRole)) {
        toast.error(`Access Denied: Your role (${userRole}) does not have permission to view this page.`);
        
        // Redirect to their respective dashboard
        const dashboardPath = userRole === 'ADMIN' ? '/admin/dashboard' : 
                             userRole === 'VILLAGE_CHEF' ? '/chef/dashboard' :
                             userRole === 'VILLAGE_SOCIAL' ? '/social/dashboard' :
                             '/villager/dashboard';
                             
        return <Navigate to={dashboardPath} replace />;
    }

    return <Outlet />;
};


export default RoleRoute;
