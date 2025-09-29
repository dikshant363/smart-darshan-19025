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
            
            {/* Placeholder routes for Phase 2 */}
            <Route path="booking" element={<div className="p-4 text-center">Booking - Coming in Phase 2</div>} />
            <Route path="crowd-monitor" element={<div className="p-4 text-center">Crowd Monitor - Coming in Phase 2</div>} />
            <Route path="traffic" element={<div className="p-4 text-center">Traffic - Coming in Phase 2</div>} />
            <Route path="emergency" element={<div className="p-4 text-center">Emergency - Coming in Phase 3</div>} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
