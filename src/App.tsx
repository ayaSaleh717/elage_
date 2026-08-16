import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Homepage from "./pages/Homepage";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminRequests from "./pages/admin/AdminRequests";
import AdminPayments from "./pages/admin/AdminPayments";
import AdminSettings from "./pages/admin/AdminSettings";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorPatients from "./pages/doctor/DoctorPatients";
import DoctorConsultations from "./pages/doctor/DoctorConsultations";
import DoctorSchedule from "./pages/doctor/DoctorSchedule";
// import DoctorEarnings from "./pages/doctor/DoctorEarnings";
import DoctorProfile from "./pages/doctor/DoctorProfile";
// import DoctorMessages from "./pages/doctor/DoctorMessages";
import PatientDashboard from "./pages/patient/PatientDashboard";
import DoctorsPage from "./pages/doctor/DoctorsPage";
import Reservation from "./pages/Reservation";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import AIConsultation from "./pages/AIConsultation";
import Notifications from "./pages/Notifications";
import Consultations from "./pages/patient/Consultations";
import Records from "./pages/patient/Records";
import Profile from "./pages/patient/Profile";
import { apiService } from "./services/api";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = apiService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Homepage Route Component - redirects admin/doctor to dashboards
const HomepageRoute = () => {
  const isAuthenticated = apiService.isAuthenticated();
  
  if (isAuthenticated) {
    const user = apiService.getCurrentUser();
    if (user?.role === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    if (user?.role === 'doctor') {
      return <Navigate to="/doctor" replace />;
    }
  }
  
  return <Homepage />;
};

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomepageRoute />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
            <Route path="/admin/requests" element={<ProtectedRoute><AdminRequests /></ProtectedRoute>} />
            <Route path="/admin/payments" element={<ProtectedRoute><AdminPayments /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
            <Route path="/doctor" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/doctor/patients" element={<ProtectedRoute><DoctorPatients /></ProtectedRoute>} />
            <Route path="/doctor/consultations" element={<ProtectedRoute><DoctorConsultations /></ProtectedRoute>} />
            <Route path="/doctor/schedule" element={<ProtectedRoute><DoctorSchedule /></ProtectedRoute>} />
            {/* <Route path="/doctor/messages" element={<ProtectedRoute><DoctorMessages /></ProtectedRoute>} /> */}
            {/* <Route path="/doctor/earnings" element={<ProtectedRoute><DoctorEarnings /></ProtectedRoute>} /> */}
            <Route path="/doctor/profile" element={<ProtectedRoute><DoctorProfile /></ProtectedRoute>} />
            <Route path="/patient" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>}>
              <Route index element={<div>مرحباً في لوحة التحكم</div>} />
              <Route path="consultations" element={<Consultations />} />
              <Route path="records" element={<Records />} />
              <Route path="profile" element={<Profile />} />
              <Route path="ai-consultation" element={<AIConsultation />} />
            </Route>
            <Route path="/doctors" element={<ProtectedRoute><DoctorsPage /></ProtectedRoute>} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/ai-consultation" element={<AIConsultation />} />
            <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
