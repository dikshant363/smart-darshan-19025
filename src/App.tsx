import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './lib/i18n'; // Initialize i18n
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import TempleInfo from "./pages/TempleInfo";
import Booking from "./pages/Booking";
import QueueStatus from "./pages/QueueStatus";
import CrowdMonitor from "./pages/CrowdMonitor";
import Traffic from "./pages/Traffic";
import Parking from "./pages/Parking";
import Emergency from "./pages/Emergency";
import Notifications from "./pages/Notifications";
import Help from "./pages/Help";
import Maps from "./pages/Maps";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppProvider>
            <Toaster />
            <Sonner />
            <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            {/* Main app routes with layout */}
            <Route path="/" element={<AppLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="temple-info/:templeId?" element={<TempleInfo />} />
              <Route path="booking" element={<Booking />} />
              <Route path="queue-status" element={<QueueStatus />} />
              <Route path="crowd-monitor" element={<CrowdMonitor />} />
              <Route path="traffic" element={<Traffic />} />
              <Route path="parking" element={<Parking />} />
              <Route path="maps" element={<Maps />} />
              <Route path="emergency" element={<Emergency />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="help" element={<Help />} />
            </Route>

            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          </AppProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
