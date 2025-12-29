import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { SignIn, SignUp, useUser } from "@clerk/clerk-react";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import Endpoints from "./pages/dashboard/Endpoints";
import Events from "./pages/dashboard/Events";
import EventDetail from "./pages/dashboard/EventDetail";
import Logs from "./pages/dashboard/Logs";
import Settings from "./pages/dashboard/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Wrapper
function ProtectedRoute() {
  const { isLoaded, isSignedIn } = useUser();

  // Show loading while checking authentication
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn) {
    return <Navigate to="/sign-in" replace />;
  }

  // Render protected routes
  return <Outlet />;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          {/* Clerk Authentication Routes */}
          <Route 
            path="/sign-in/*" 
            element={
              <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
              </div>
            } 
          />
          <Route 
            path="/sign-up/*" 
            element={
              <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <SignUp routing="path" path="/sign-up" signInUrl="/sign-in" />
              </div>
            } 
          />
          
          {/* Protected Dashboard routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="endpoints" element={<Endpoints />} />
              <Route path="events" element={<Events />} />
              <Route path="events/:id" element={<EventDetail />} />
              <Route path="logs" element={<Logs />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>
          
          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;