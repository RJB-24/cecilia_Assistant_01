
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { navItems } from "./nav-items";
import MainLayout from "./components/layout/MainLayout";
import ErrorBoundary from "./components/common/ErrorBoundary";
import "./styles/jarvis.css";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <ErrorBoundary>
          <BrowserRouter>
            <MainLayout>
              <Routes>
                {navItems.map(({ to, page }) => (
                  <Route 
                    key={to} 
                    path={to} 
                    element={
                      <ErrorBoundary>
                        {page}
                      </ErrorBoundary>
                    } 
                  />
                ))}
              </Routes>
            </MainLayout>
          </BrowserRouter>
        </ErrorBoundary>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
