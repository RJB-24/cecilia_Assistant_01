
import { 
  Home, 
  Brain, 
  Settings, 
  BarChart3, 
  Bell, 
  FileText, 
  Workflow,
  Heart,
  Smartphone,
  GraduationCap,
  MessageCircle,
  Calendar,
  Shield,
  User,
  Zap
} from "lucide-react";
import Index from "./pages/Index";
import CommandCenter from "./pages/CommandCenter";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import Notes from "./pages/Notes";
import Tasks from "./pages/Tasks";
import Workflows from "./pages/Workflows";
import Lab from "./pages/Lab";
import Health from "./pages/Health";
import SmartHome from "./pages/SmartHome";
import Learning from "./pages/Learning";
import Messages from "./pages/Messages";
import Entertainment from "./pages/Entertainment";
import Privacy from "./pages/Privacy";
import Profile from "./pages/Profile";

export const navItems = [
  {
    title: "Dashboard",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
    category: "main"
  },
  {
    title: "AI Assistant",
    to: "/command-center",
    icon: <Brain className="h-4 w-4" />,
    page: <CommandCenter />,
    category: "main"
  },
  {
    title: "Tasks",
    to: "/tasks",
    icon: <Calendar className="h-4 w-4" />,
    page: <Tasks />,
    category: "productivity"
  },
  {
    title: "Health & Wellness",
    to: "/health",
    icon: <Heart className="h-4 w-4" />,
    page: <Health />,
    category: "lifestyle"
  },
  {
    title: "Smart Home",
    to: "/smart-home",
    icon: <Smartphone className="h-4 w-4" />,
    page: <SmartHome />,
    category: "lifestyle"
  },
  {
    title: "Learning",
    to: "/learning",
    icon: <GraduationCap className="h-4 w-4" />,
    page: <Learning />,
    category: "productivity"
  },
  {
    title: "Messages",
    to: "/messages",
    icon: <MessageCircle className="h-4 w-4" />,
    page: <Messages />,
    category: "communication"
  },
  {
    title: "Entertainment",
    to: "/entertainment",
    icon: <Zap className="h-4 w-4" />,
    page: <Entertainment />,
    category: "lifestyle"
  },
  {
    title: "Analytics",
    to: "/analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    page: <Analytics />,
    category: "insights"
  },
  {
    title: "Workflows",
    to: "/workflows",
    icon: <Workflow className="h-4 w-4" />,
    page: <Workflows />,
    category: "productivity"
  },
  {
    title: "Notes",
    to: "/notes",
    icon: <FileText className="h-4 w-4" />,
    page: <Notes />,
    category: "productivity"
  },
  {
    title: "Notifications",
    to: "/notifications",
    icon: <Bell className="h-4 w-4" />,
    page: <Notifications />,
    category: "system"
  },
  {
    title: "Privacy & Security",
    to: "/privacy",
    icon: <Shield className="h-4 w-4" />,
    page: <Privacy />,
    category: "system"
  },
  {
    title: "Profile",
    to: "/profile",
    icon: <User className="h-4 w-4" />,
    page: <Profile />,
    category: "system"
  },
  {
    title: "Settings",
    to: "/settings",
    icon: <Settings className="h-4 w-4" />,
    page: <Lab />,
    category: "system"
  },
];

export const navCategories = {
  main: "Main",
  productivity: "Productivity",
  lifestyle: "Lifestyle", 
  communication: "Communication",
  insights: "Insights",
  system: "System"
};
