import "./global.css";

import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import AddProject from "./pages/AddProject";
import ProjectDetail from "./pages/ProjectDetail";
import EditProject from "./pages/EditProject";
import Gallery from "./pages/Gallery";
import Settings from "./pages/Settings";
import SuperAdmin from "./pages/SuperAdmin";
import BusinessDetail from "./pages/BusinessDetail";
import BusinessManagement from "./pages/BusinessManagement";
import UserManagement from "./pages/UserManagement";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import PublicProject from "./pages/PublicProject";
import SignIn from "./pages/SignIn";
import NotFound from "./pages/NotFound";
import AgencyAdmin from "./pages/AgencyAdmin";
import AgencyClientManagement from "./pages/AgencyClientManagement";
import AddAgencyClient from "./pages/AddAgencyClient";
import AgencyCommission from "./pages/AgencyCommission";
import AgencyAnalytics from "./pages/AgencyAnalytics";
import AgencyReports from "./pages/AgencyReports";
import AgencyBilling from "./pages/AgencyBilling";
import AgencyBusinessOwners from "./pages/AgencyBusinessOwners";
import AgencyAdminUsers from "./pages/AgencyAdminUsers";
import AgencySettings from "./pages/AgencySettings";
import AgencyBusinessOwnerDetail from "./pages/AgencyBusinessOwnerDetail";
import AgencyBusinessOwnerEdit from "./pages/AgencyBusinessOwnerEdit";
import AddAgencyAdminUser from "./pages/AddAgencyAdminUser";
import AgencyAdminUserDetail from "./pages/AgencyAdminUserDetail";
import AgencyAdminUserEdit from "./pages/AgencyAdminUserEdit";
import SuperAdminAgencyManagement from "./pages/SuperAdminAgencyManagement";
import SuperAdminSettings from "./pages/SuperAdminSettings";
import SuperAdminStaff from "./pages/SuperAdminStaff";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Support from "./pages/Support";
import AdminSupport from "./pages/AdminSupport";
import SupportTicketDetail from "./pages/SupportTicketDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Sonner />
        <Routes>
          {/* Public routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/public/project/:id" element={<PublicProject />} />

          {/* Protected routes */}
          <Route
            path="/admin/projects"
            element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/add-project"
            element={
              <ProtectedRoute>
                <AddProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:id"
            element={
              <ProtectedRoute>
                <ProjectDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/project/:id/edit"
            element={
              <ProtectedRoute>
                <EditProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/gallery"
            element={
              <ProtectedRoute>
                <Gallery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin"
            element={
              <ProtectedRoute>
                <SuperAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/businesses"
            element={
              <ProtectedRoute>
                <BusinessManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/business/:businessId"
            element={
              <ProtectedRoute>
                <BusinessDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/users"
            element={
              <ProtectedRoute>
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/support"
            element={
              <ProtectedRoute>
                <AdminSupport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/support/ticket/:ticketId"
            element={
              <ProtectedRoute>
                <SupportTicketDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support"
            element={
              <ProtectedRoute>
                <Support />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin-support"
            element={
              <ProtectedRoute>
                <AdminSupport />
              </ProtectedRoute>
            }
          />

          {/* Agency Admin Routes */}
          <Route
            path="/agency/admin/dashboard"
            element={
              <ProtectedRoute>
                <AgencyAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agency/admin/clients"
            element={
              <ProtectedRoute>
                <AgencyClientManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agency/admin/clients/add"
            element={
              <ProtectedRoute>
                <AddAgencyClient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agency/admin/commission"
            element={
              <ProtectedRoute>
                <AgencyCommission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agency/admin/analytics"
            element={
              <ProtectedRoute>
                <AgencyAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agency/admin/reports"
            element={
              <ProtectedRoute>
                <AgencyReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agency/admin/billing"
            element={
              <ProtectedRoute>
                <AgencyBilling />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agency/admin/business-owners"
            element={
              <ProtectedRoute>
                <AgencyBusinessOwners />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agency/admin/business-owners/add"
            element={
              <ProtectedRoute>
                <AddAgencyClient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agency/admin/business-owners/:id"
            element={
              <ProtectedRoute>
                <AgencyBusinessOwnerDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agency/admin/business-owners/:id/edit"
            element={
              <ProtectedRoute>
                <AgencyBusinessOwnerEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agency/admin/admin-users"
            element={
              <ProtectedRoute>
                <AgencyAdminUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agency/admin/admin-users/add"
            element={
              <ProtectedRoute>
                <AddAgencyAdminUser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agency/admin/admin-users/:id"
            element={
              <ProtectedRoute>
                <AgencyAdminUserDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agency/admin/admin-users/:id/edit"
            element={
              <ProtectedRoute>
                <AgencyAdminUserEdit />
              </ProtectedRoute>
            }
          />
          <Route
            path="/agency/admin/settings"
            element={
              <ProtectedRoute>
                <AgencySettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/agencies"
            element={
              <ProtectedRoute>
                <SuperAdminAgencyManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/settings"
            element={
              <ProtectedRoute>
                <SuperAdminSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/super-admin/staff"
            element={
              <ProtectedRoute>
                <SuperAdminStaff />
              </ProtectedRoute>
            }
          />

          {/* Legacy/manual route redirects */}
          <Route path="/" element={<Navigate to="/admin/projects" replace />} />
          <Route
            path="/dashboard"
            element={<Navigate to="/admin/projects" replace />}
          />
          <Route
            path="/admin/dashboard"
            element={<Navigate to="/admin/projects" replace />}
          />
          <Route
            path="/add-project"
            element={<Navigate to="/admin/add-project" replace />}
          />
          <Route
            path="/gallery"
            element={<Navigate to="/admin/gallery" replace />}
          />
          <Route
            path="/settings"
            element={<Navigate to="/admin/settings" replace />}
          />
          <Route
            path="/profile"
            element={<Navigate to="/admin/profile" replace />}
          />
          <Route
            path="/users"
            element={<Navigate to="/admin/settings" replace />}
          />
          <Route
            path="/photos"
            element={<Navigate to="/admin/gallery" replace />}
          />
          {/* Agency Admin Legacy URL Redirects */}
          <Route
            path="/agency-admin"
            element={<Navigate to="/agency/admin/dashboard" replace />}
          />
          <Route
            path="/agency-admin/clients"
            element={<Navigate to="/agency/admin/business-owners" replace />}
          />
          <Route
            path="/agency-admin/clients/:id"
            element={
              <Navigate to="/agency/admin/business-owners/:id" replace />
            }
          />
          <Route
            path="/agency-admin/billing"
            element={<Navigate to="/agency/admin/billing" replace />}
          />
          <Route
            path="/agency-admin/analytics"
            element={<Navigate to="/agency/admin/analytics" replace />}
          />
          <Route
            path="/agency-admin/settings"
            element={<Navigate to="/agency/admin/settings" replace />}
          />
          <Route
            path="/agency-admin/business-owners"
            element={<Navigate to="/agency/admin/business-owners" replace />}
          />
          <Route
            path="/agency-admin/business-owners/:id"
            element={
              <Navigate to="/agency/admin/business-owners/:id" replace />
            }
          />
          <Route
            path="/agency-admin/business-owners/:id/edit"
            element={
              <Navigate to="/agency/admin/business-owners/:id/edit" replace />
            }
          />
          <Route
            path="/agency-admin/admin-users"
            element={<Navigate to="/agency/admin/admin-users" replace />}
          />
          <Route
            path="/agency-admin/admin-users/add"
            element={<Navigate to="/agency/admin/admin-users/add" replace />}
          />
          <Route
            path="/agency-admin/admin-users/:id"
            element={<Navigate to="/agency/admin/admin-users/:id" replace />}
          />
          <Route
            path="/agency-admin/admin-users/:id/edit"
            element={
              <Navigate to="/agency/admin/admin-users/:id/edit" replace />
            }
          />
          <Route
            path="/agency-admin/commission"
            element={<Navigate to="/agency/admin/commission" replace />}
          />
          <Route
            path="/agency-admin/reports"
            element={<Navigate to="/agency/admin/reports" replace />}
          />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

// Prevent multiple createRoot calls during HMR
const rootElement = document.getElementById("root")!;
let root = (globalThis as any).__react_root;
if (!root) {
  root = createRoot(rootElement);
  (globalThis as any).__react_root = root;
}
root.render(<App />);
