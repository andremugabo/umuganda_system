import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Layouts
import AuthLayout from './components/ui/AuthLayout';
import DashboardLayout from './components/ui/DashboardLayout';

// Pages
import LoginPage from './pages/authpages/LoginPage';
import SignupPage from './pages/authpages/SignupPage';
import ForgotPasswordPage from './pages/authpages/ForgotPasswordPage';
import VerifyOtpPage from './pages/authpages/VerifyOtpPage';
import ResetPasswordPage from './pages/authpages/ResetPasswordPage';

import VillagerDashboard from './pages/villagerpages/VillagerDashboard';
import VillagerUmuganda from './pages/villagerpages/VillagerUmuganda';
import VillagerAttendance from './pages/villagerpages/VillagerAttendance';
import VillagerProfile from './pages/villagerpages/VillagerProfile';
import AdminDashboard from './pages/adminpages/AdminDashboard';
import UsersManagement from './pages/adminpages/UsersManagement';
import LocationsManagement from './pages/adminpages/LocationsManagement';
import UmugandaManagement from './pages/adminpages/UmugandaManagement';
import AttendanceManagement from './pages/adminpages/AttendanceManagement';
import NotificationsPage from './pages/NotificationsPage';
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
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UsersManagement />} />
          <Route path="/admin/locations" element={<LocationsManagement />} />
          <Route path="/admin/umuganda" element={<UmugandaManagement />} />
          <Route path="/admin/attendance" element={<AttendanceManagement />} />
          <Route path="/admin/notifications" element={<NotificationsPage />} />

          <Route path="/villager/dashboard" element={<VillagerDashboard />} />
          <Route path="/villager/umuganda" element={<VillagerUmuganda />} />
          <Route path="/villager/attendance" element={<VillagerAttendance />} />
          <Route path="/villager/profile" element={<VillagerProfile />} />
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
