
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

const App = () => {
  console.log('App component rendering');
  console.log('Navigation items:', navItems);
  
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <ErrorBoundary>
            <BrowserRouter>
              <MainLayout>
                <Routes>
                  {navItems.map(({ to, page }) => {
                    console.log('Registering route:', to);
                    return (
                      <Route 
                        key={to} 
                        path={to} 
                        element={
                          <ErrorBoundary>
                            {page}
                          </ErrorBoundary>
                        } 
                      />
                    );
                  })}
                </Routes>
              </MainLayout>
            </BrowserRouter>
          </ErrorBoundary>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
