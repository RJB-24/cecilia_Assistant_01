
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
import Settings from "./pages/Settings";

export const navCategories = {
  main: "Main",
  tools: "Tools",
  data: "Data & Analytics",
  settings: "Settings"
};

export const navItems = [
  {
    title: "Dashboard",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    variant: "default" as const,
    category: "main",
    page: <Index />
  },
  {
    title: "JARVIS AI",
    to: "/jarvis",
    icon: <Bot className="h-4 w-4" />,
    variant: "default" as const,
    category: "main",
    page: <JarvisLab />
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
    title: "AI Map",
    to: "/map", 
    icon: <MapPin className="h-4 w-4" />,
    variant: "default" as const,
    category: "tools",
    page: <Map />
  },
  {
    title: "Lab",
    to: "/lab",
    icon: <Zap className="h-4 w-4" />,
    variant: "default" as const,
    category: "tools",
    page: <Lab />
  },
  {
    title: "Tasks",
    to: "/tasks",
    icon: <Calendar className="h-4 w-4" />,
    variant: "default" as const,
    category: "tools",
    page: <Tasks />
  },
  {
    title: "Messages",
    to: "/messages",
    icon: <MessageSquare className="h-4 w-4" />,
    variant: "default" as const,
    category: "tools",
    page: <Messages />
  },
  {
    title: "Notes",
    to: "/notes",
    icon: <FileText className="h-4 w-4" />,
    variant: "default" as const,
    category: "data",
    page: <Notes />
  },
  {
    title: "Analytics",
    to: "/analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    variant: "default" as const,
    category: "data",
    page: <Analytics />
  },
  {
    title: "Workflows",
    to: "/workflows",
    icon: <Workflow className="h-4 w-4" />,
    variant: "default" as const,
    category: "tools",
    page: <Workflows />
  },
  {
    title: "Settings",
    to: "/settings",
    icon: <Settings className="h-4 w-4" />,
    variant: "default" as const,
    category: "settings",
    page: <Settings />
  },
];
