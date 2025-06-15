
import { Home, Brain, Settings, BarChart3, Bell, FileText, Workflow } from "lucide-react";
import Index from "./pages/Index";
import CommandCenter from "./pages/CommandCenter";
import Analytics from "./pages/Analytics";
import Notifications from "./pages/Notifications";
import Notes from "./pages/Notes";
import Tasks from "./pages/Tasks";
import Workflows from "./pages/Workflows";
import Lab from "./pages/Lab";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <Home className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Command Center",
    to: "/command-center",
    icon: <Brain className="h-4 w-4" />,
    page: <CommandCenter />,
  },
  {
    title: "Analytics",
    to: "/analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    page: <Analytics />,
  },
  {
    title: "Notifications",
    to: "/notifications",
    icon: <Bell className="h-4 w-4" />,
    page: <Notifications />,
  },
  {
    title: "Notes",
    to: "/notes",
    icon: <FileText className="h-4 w-4" />,
    page: <Notes />,
  },
  {
    title: "Tasks",
    to: "/tasks",
    icon: <Settings className="h-4 w-4" />,
    page: <Tasks />,
  },
  {
    title: "Workflows",
    to: "/workflows",
    icon: <Workflow className="h-4 w-4" />,
    page: <Workflows />,
  },
  {
    title: "Lab",
    to: "/lab",
    icon: <Brain className="h-4 w-4" />,
    page: <Lab />,
  },
];
