import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import './lib/i18n'; // Initialize i18n
import { AppProvider } from './contexts/AppContext';
import { AuthProvider } from './contexts/AuthContext';

// Lazy load pages for better performance
const AppLayout = lazy(() => import("./components/layout/AppLayout"));
const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const TempleInfo = lazy(() => import("./pages/TempleInfo"));
const Booking = lazy(() => import("./pages/Booking"));
const BookingHistory = lazy(() => import("./pages/BookingHistory"));
const QueueStatus = lazy(() => import("./pages/QueueStatus"));
const CrowdMonitor = lazy(() => import("./pages/CrowdMonitor"));
const Traffic = lazy(() => import("./pages/Traffic"));
const Parking = lazy(() => import("./pages/Parking"));
const Emergency = lazy(() => import("./pages/Emergency"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Help = lazy(() => import("./pages/Help"));
const Settings = lazy(() => import("./pages/Settings"));
const About = lazy(() => import("./pages/About"));
const Maps = lazy(() => import("./pages/Maps"));
const NotFound = lazy(() => import("./pages/NotFound"));

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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
            <AppProvider>
              <Toaster />
              <Sonner />
              <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>}>
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
              <Route path="booking-history" element={<BookingHistory />} />
              <Route path="queue-status" element={<QueueStatus />} />
              <Route path="crowd-monitor" element={<CrowdMonitor />} />
              <Route path="traffic" element={<Traffic />} />
              <Route path="parking" element={<Parking />} />
              <Route path="maps" element={<Maps />} />
              <Route path="emergency" element={<Emergency />} />
              <Route path="notifications" element={<Notifications />} />
              <Route path="help" element={<Help />} />
              <Route path="settings" element={<Settings />} />
              <Route path="about" element={<About />} />
            </Route>

                  {/* Catch-all route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </AppProvider>
          </AuthProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
