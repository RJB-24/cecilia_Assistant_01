
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Index from './pages/Index';
import CommandCenter from './pages/CommandCenter';
import Settings from './pages/Settings';
import Analytics from './pages/Analytics';
import Tasks from './pages/Tasks';
import Workflows from './pages/Workflows';
import Notifications from './pages/Notifications';
import Notes from './pages/Notes';
import NotFound from './pages/NotFound';
import './App.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/command" element={<CommandCenter />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/workflows" element={<Workflows />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/notes" element={<Notes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

export default App;
