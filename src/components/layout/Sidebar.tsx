
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Command, 
  Cog, 
  LineChart, 
  ClipboardList,
  GitBranch,
  Bell,
  BookText
} from "lucide-react";

const Sidebar: React.FC = () => {
  // Create a fallback location object if not within a Router context
  let location = { pathname: "/" };
  try {
    location = useLocation();
  } catch (error) {
    console.warn("Sidebar: useLocation hook failed, using fallback location");
  }
  
  const currentPath = location.pathname;
  
  const menuItems = [
    { name: "Dashboard", path: "/", icon: LayoutDashboard },
    { name: "Command Center", path: "/command", icon: Command },
    { name: "Tasks", path: "/tasks", icon: ClipboardList },
    { name: "Notes", path: "/notes", icon: BookText },
    { name: "Workflows", path: "/workflows", icon: GitBranch },
    { name: "Analytics", path: "/analytics", icon: LineChart },
    { name: "Notifications", path: "/notifications", icon: Bell },
    { name: "Settings", path: "/settings", icon: Cog },
  ];
  
  return (
    <aside className="bg-jarvis-dark/80 border-r border-jarvis-border w-16 md:w-64 flex flex-col">
      <div className="py-6 flex items-center justify-center md:justify-start px-4">
        <div className="relative w-10 h-10 rounded-full bg-jarvis-primary/20 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-jarvis-primary/10 animate-pulse"></div>
          <span className="text-jarvis-primary text-xl font-bold jarvis-glow-text">C</span>
        </div>
        <span className="hidden md:block ml-3 text-xl font-semibold tracking-wider text-jarvis-primary jarvis-glow-text">
          CECILIA
        </span>
      </div>
      
      <nav className="flex-1 mt-6">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={cn(
                  "flex items-center py-3 px-3 rounded-md transition-colors duration-200",
                  currentPath === item.path
                    ? "bg-jarvis-blue/20 text-jarvis-light border border-jarvis-primary/30 shadow-glow-sm"
                    : "text-jarvis-secondary hover:bg-jarvis-dark hover:text-jarvis-light"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  currentPath === item.path ? "text-jarvis-primary" : "text-current"
                )} />
                <span className="hidden md:inline ml-4">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 mt-auto">
        <div className="hidden md:block">
          <div className="text-xs text-jarvis-secondary">
            GroqFlow AI Assistant
          </div>
          <div className="text-xs text-jarvis-secondary/50">
            v1.0.0
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
