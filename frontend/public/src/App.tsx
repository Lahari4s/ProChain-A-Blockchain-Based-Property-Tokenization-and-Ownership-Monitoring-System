import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { wagmiConfig } from './config/web3Config';
import { PropertyProvider } from "./contexts/PropertyContext";
import { UserProvider } from "./contexts/UserContext";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import PropertyRegistration from "./pages/PropertyRegistration";
import PropertyTransfer from "./pages/PropertyTransfer";
import PropertyDetails from "./pages/PropertyDetails";
import AdminLogin from "./pages/AdminLogin";
import BuyerLogin from "./pages/BuyerLogin";
import LoginSelection from "./pages/LoginSelection";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";

// Import RainbowKit styles
import '@rainbow-me/rainbowkit/styles.css';

const queryClient = new QueryClient();

const App = () => (
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider>
        <AuthProvider>
          <UserProvider>
            <PropertyProvider>
              <NotificationProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <BrowserRouter>
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LoginSelection />} />
                    <Route path="/admin-login" element={<AdminLogin />} />
                    <Route path="/buyer-login" element={<BuyerLogin />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    
                    {/* Protected Home Page */}
                    <Route 
                      path="/home" 
                      element={
                        <ProtectedRoute allowedRoles={['admin', 'buyer']}>
                          <Index />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Protected Routes - Admin Only */}
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <Dashboard />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/register" 
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <PropertyRegistration />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/users" 
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <Users />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/users/:userId" 
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <UserDetails />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* Protected Routes - Both Admin and Buyer */}
                    <Route 
                      path="/properties" 
                      element={
                        <ProtectedRoute allowedRoles={['admin', 'buyer']}>
                          <Properties />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/property/:tokenId" 
                      element={
                        <ProtectedRoute allowedRoles={['admin', 'buyer']}>
                          <PropertyDetails />
                        </ProtectedRoute>
                      } 
                    />
                    <Route 
                      path="/transfer/:tokenId" 
                      element={
                        <ProtectedRoute allowedRoles={['admin', 'buyer']}>
                          <PropertyTransfer />
                        </ProtectedRoute>
                      } 
                    />
                    
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </TooltipProvider>
              </NotificationProvider>
            </PropertyProvider>
          </UserProvider>
        </AuthProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
