
import {
  HomeIcon,
  Settings,
  MessageSquare,
  Calendar,
  FileText,
  BarChart3,
  Workflow,
  Zap,
  Brain,
  MapPin,
  Bot
} from "lucide-react";

// Import the page components
import Index from "./pages/Index";
import JarvisLab from "./pages/JarvisLab";
import CommandCenter from "./pages/CommandCenter";
import Map from "./pages/Map";
import Lab from "./pages/Lab";
import Tasks from "./pages/Tasks";
import Messages from "./pages/Messages";
import Notes from "./pages/Notes";
import Analytics from "./pages/Analytics";
import Workflows from "./pages/Workflows";
import SettingsPage from "./pages/Settings";

export const navCategories = {
  main: "CECILIA Core",
  intelligence: "AI Intelligence",
  productivity: "Productivity Suite",
  settings: "Configuration"
};

export const navItems = [
  {
    title: "CECILIA Hub",
    to: "/",
    icon: <Bot className="h-4 w-4" />,
    variant: "default" as const,
    category: "main",
    page: <Index />
  },
  {
    title: "Command Center",
    to: "/command-center",
    icon: <Brain className="h-4 w-4" />,
    variant: "default" as const,
    category: "main",
    page: <CommandCenter />
  },
  {
    title: "AI Lab",
    to: "/lab",
    icon: <Zap className="h-4 w-4" />,
    variant: "default" as const,
    category: "intelligence",
    page: <Lab />
  },
  {
    title: "Smart Map",
    to: "/map", 
    icon: <MapPin className="h-4 w-4" />,
    variant: "default" as const,
    category: "intelligence",
    page: <Map />
  },
  {
    title: "Task Manager",
    to: "/tasks",
    icon: <Calendar className="h-4 w-4" />,
    variant: "default" as const,
    category: "productivity",
    page: <Tasks />
  },
  {
    title: "Messages",
    to: "/messages",
    icon: <MessageSquare className="h-4 w-4" />,
    variant: "default" as const,
    category: "productivity",
    page: <Messages />
  },
  {
    title: "Smart Notes",
    to: "/notes",
    icon: <FileText className="h-4 w-4" />,
    variant: "default" as const,
    category: "productivity",
    page: <Notes />
  },
  {
    title: "Analytics",
    to: "/analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    variant: "default" as const,
    category: "intelligence",
    page: <Analytics />
  },
  {
    title: "Workflows",
    to: "/workflows",
    icon: <Workflow className="h-4 w-4" />,
    variant: "default" as const,
    category: "intelligence",
    page: <Workflows />
  },
  {
    title: "Settings",
    to: "/settings",
    icon: <Settings className="h-4 w-4" />,
    variant: "default" as const,
    category: "settings",
    page: <SettingsPage />
  },
];
