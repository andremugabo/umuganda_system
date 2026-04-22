import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Layouts
import AuthLayout from './components/ui/AuthLayout';
import DashboardLayout from './components/ui/DashboardLayout';
import RoleRoute from './components/ui/RoleRoute';


// Pages
import LoginPage from './pages/authpages/LoginPage';
import SignupPage from './pages/authpages/SignupPage';
import ForgotPasswordPage from './pages/authpages/ForgotPasswordPage';
import VerifyOtpPage from './pages/authpages/VerifyOtpPage';
import ResetPasswordPage from './pages/authpages/ResetPasswordPage';

import VillagerDashboard from './pages/villagerpages/VillagerDashboard';
import VillagerUmuganda from './pages/villagerpages/VillagerUmuganda';
import VillagerAttendance from './pages/villagerpages/VillagerAttendance';
import ChefDashboard from './pages/chefpages/ChefDashboard';
import SocialDashboard from './pages/socialpages/SocialDashboard';
import ProfilePage from './pages/ProfilePage';

import AdminDashboard from './pages/adminpages/AdminDashboard';
import UsersManagement from './pages/adminpages/UsersManagement';
import LocationsManagement from './pages/adminpages/LocationsManagement';
import UmugandaManagement from './pages/adminpages/UmugandaManagement';
import AttendanceManagement from './pages/adminpages/AttendanceManagement';
import NotificationsPage from './pages/NotificationsPage';
import AuditLogsPage from './pages/adminpages/AuditLogsPage';
import SystemSettingsPage from './pages/adminpages/SystemSettingsPage';
import NotFound from './pages/NotFound';




function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-otp" element={<VerifyOtpPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Route>

        {/* Dashboard Routes (Protected by DashboardLayout) */}
        <Route element={<DashboardLayout />}>
          {/* Shared Management Routes (Admin & Local Leaders) */}
          <Route element={<RoleRoute allowedRoles={['ADMIN', 'VILLAGE_CHEF']} />}>
            <Route path="/admin/users" element={<UsersManagement />} />
            <Route path="/chef/users" element={<UsersManagement />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['ADMIN', 'VILLAGE_CHEF', 'VILLAGE_SOCIAL']} />}>
            <Route path="/admin/umuganda" element={<UmugandaManagement />} />
            <Route path="/admin/attendance" element={<AttendanceManagement />} />
            <Route path="/chef/umuganda" element={<UmugandaManagement />} />
            <Route path="/chef/attendance" element={<AttendanceManagement />} />
            <Route path="/social/umuganda" element={<UmugandaManagement />} />
            <Route path="/social/attendance" element={<AttendanceManagement />} />
          </Route>

          {/* Admin-Only Restricted Routes */}
          <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin/locations" element={<LocationsManagement />} />
            <Route path="/admin/logs" element={<AuditLogsPage />} />
            <Route path="/admin/settings" element={<SystemSettingsPage />} />
          </Route>


          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/notifications" element={<NotificationsPage />} />
          <Route path="/admin/profile" element={<ProfilePage />} />

          <Route path="/chef/dashboard" element={<ChefDashboard />} />
          <Route path="/chef/reports" element={<AdminDashboard />} /> {/* Placeholder for reports */}
          <Route path="/chef/profile" element={<ProfilePage />} />
          
          <Route path="/social/dashboard" element={<SocialDashboard />} />
          <Route path="/social/notifications" element={<NotificationsPage />} />
          <Route path="/social/profile" element={<ProfilePage />} />



          <Route path="/villager/dashboard" element={<VillagerDashboard />} />
          <Route path="/villager/umuganda" element={<VillagerUmuganda />} />
          <Route path="/villager/attendance" element={<VillagerAttendance />} />
          <Route path="/villager/profile" element={<ProfilePage />} />
          <Route path="/villager/notifications" element={<NotificationsPage />} />

          {/* Generic notification route for all roles */}
          <Route path="/notifications" element={<NotificationsPage />} />
        </Route>

        {/* Redirect root */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
