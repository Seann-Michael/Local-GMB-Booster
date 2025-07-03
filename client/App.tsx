import "./global.css";

import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AddProject from "./pages/AddProject";
import ProjectDetail from "./pages/ProjectDetail";
import EditProject from "./pages/EditProject";
import Gallery from "./pages/Gallery";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <TooltipProvider>
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/add-project" element={<AddProject />} />
          <Route path="/project/:id" element={<ProjectDetail />} />
          <Route path="/project/:id/edit" element={<EditProject />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/settings" element={<Settings />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
