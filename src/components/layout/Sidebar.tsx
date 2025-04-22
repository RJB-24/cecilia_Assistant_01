
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  MicIcon, 
  CameraIcon, 
  ListOrderedIcon, 
  StopCircleIcon, 
  KanbanIcon, 
  LayoutGridIcon, 
  ChartBarIcon, 
  SettingsIcon, 
  BellIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

const SidebarLink = ({ 
  to, 
  icon: Icon, 
  children, 
  className 
}: { 
  to: string; 
  icon: React.ElementType; 
  children: React.ReactNode; 
  className?: string;
}) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        cn(
          "flex items-center gap-3 px-3 py-2 rounded-jarvis text-sm font-semibold transition-colors",
          isActive 
            ? "bg-jarvis-blue/70 text-white shadow-jarvis-glow" 
            : "text-jarvis-light hover:bg-jarvis-dark/80 hover:text-jarvis-primary",
          className
        )
      }
    >
      <Icon className="w-5 h-5 jarvis-glow-text" />
      <span>{children}</span>
    </NavLink>
  );
};

const Sidebar = () => {
  return (
    <div className="h-screen w-72 bg-jarvis-dark/90 border-r-2 border-jarvis-border flex flex-col shadow-jarvis-glow">
      <div className="p-6 border-b border-jarvis-border">
        <h1 className="text-2xl font-bold text-jarvis-primary jarvis-glow-text flex items-center tracking-widest">
          CECILIA
        </h1>
        <p className="text-xs font-mono text-jarvis-sky mt-1">Jarvis-Style AI Assistant</p>
      </div>
      <div className="flex-1 overflow-auto py-6 px-3 space-y-2">
        <SidebarLink to="/" icon={KanbanIcon}>Dashboard</SidebarLink>
        <SidebarLink to="/tasks" icon={ListOrderedIcon}>Tasks</SidebarLink>
        <SidebarLink to="/workflows" icon={LayoutGridIcon}>Workflows</SidebarLink>
        <SidebarLink to="/analytics" icon={ChartBarIcon}>Analytics</SidebarLink>
        <SidebarLink to="/settings" icon={SettingsIcon}>Settings</SidebarLink>
        <SidebarLink to="/notifications" icon={BellIcon}>Notifications</SidebarLink>
      </div>
      <div className="p-6 border-t border-jarvis-border space-y-2">
        <p className="text-xs font-bold text-jarvis-secondary uppercase">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-jarvis-dark/80 border border-jarvis-primary/20 hover:bg-jarvis-blue hover:text-white shadow-jarvis-glow"
          >
            <MicIcon className="w-5 h-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-jarvis-dark/80 border border-jarvis-primary/20 hover:bg-jarvis-blue hover:text-white shadow-jarvis-glow"
          >
            <CameraIcon className="w-5 h-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-jarvis-dark/80 border border-jarvis-primary/20 hover:bg-jarvis-blue hover:text-white shadow-jarvis-glow"
          >
            <ListOrderedIcon className="w-5 h-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-jarvis-dark/80 border border-jarvis-primary/20 hover:bg-jarvis-blue hover:text-white shadow-jarvis-glow"
          >
            <StopCircleIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
