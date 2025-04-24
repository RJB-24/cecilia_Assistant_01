
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {
  return (
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
  );
}

export default App;
