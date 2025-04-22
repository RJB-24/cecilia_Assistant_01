
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
          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
          isActive 
            ? "bg-groqflow-navy text-white" 
            : "text-gray-700 hover:bg-gray-200",
          className
        )
      }
    >
      <Icon className="w-5 h-5" />
      <span>{children}</span>
    </NavLink>
  );
};

const Sidebar = () => {
  return (
    <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-groqflow-navy flex items-center">
          <span className="text-groqflow-teal mr-2">Groq</span>Flow
        </h1>
        <p className="text-xs text-gray-500 mt-1">AI-Powered Workflow Assistant</p>
      </div>
      
      <div className="flex-1 overflow-auto py-4 px-3 space-y-1">
        <SidebarLink to="/" icon={KanbanIcon}>Dashboard</SidebarLink>
        <SidebarLink to="/tasks" icon={ListOrderedIcon}>Tasks</SidebarLink>
        <SidebarLink to="/workflows" icon={LayoutGridIcon}>Workflows</SidebarLink>
        <SidebarLink to="/analytics" icon={ChartBarIcon}>Analytics</SidebarLink>
        <SidebarLink to="/settings" icon={SettingsIcon}>Settings</SidebarLink>
        <SidebarLink to="/notifications" icon={BellIcon}>Notifications</SidebarLink>
      </div>
      
      <div className="p-4 border-t border-gray-200 space-y-2">
        <p className="text-xs font-medium text-gray-400 uppercase">Quick Actions</p>
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white hover:bg-groqflow-teal hover:text-white"
          >
            <MicIcon className="w-5 h-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white hover:bg-groqflow-teal hover:text-white"
          >
            <CameraIcon className="w-5 h-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white hover:bg-groqflow-teal hover:text-white"
          >
            <ListOrderedIcon className="w-5 h-5" />
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="bg-white hover:bg-groqflow-teal hover:text-white"
          >
            <StopCircleIcon className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
