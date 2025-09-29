import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import './lib/i18n'; // Initialize i18n
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
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
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
            
            {/* Placeholder routes for Phase 3 */}
            <Route path="emergency" element={<div className="p-4 text-center">Emergency - Coming in Phase 3</div>} />
            <Route path="notifications" element={<div className="p-4 text-center">Notifications - Coming in Phase 2</div>} />
            <Route path="help" element={<div className="p-4 text-center">Help - Coming in Phase 2</div>} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
