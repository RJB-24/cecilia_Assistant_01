
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

export const navItems = [
  {
    title: "Dashboard",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    variant: "default" as const,
  },
  {
    title: "JARVIS AI",
    to: "/jarvis",
    icon: <Bot className="h-4 w-4" />,
    variant: "default" as const,
  },
  {
    title: "Command Center",
    to: "/command-center",
    icon: <Brain className="h-4 w-4" />,
    variant: "default" as const,
  },
  {
    title: "AI Map",
    to: "/map", 
    icon: <MapPin className="h-4 w-4" />,
    variant: "default" as const,
  },
  {
    title: "Lab",
    to: "/lab",
    icon: <Zap className="h-4 w-4" />,
    variant: "default" as const,
  },
  {
    title: "Tasks",
    to: "/tasks",
    icon: <Calendar className="h-4 w-4" />,
    variant: "default" as const,
  },
  {
    title: "Messages",
    to: "/messages",
    icon: <MessageSquare className="h-4 w-4" />,
    variant: "default" as const,
  },
  {
    title: "Notes",
    to: "/notes",
    icon: <FileText className="h-4 w-4" />,
    variant: "default" as const,
  },
  {
    title: "Analytics",
    to: "/analytics",
    icon: <BarChart3 className="h-4 w-4" />,
    variant: "default" as const,
  },
  {
    title: "Workflows",
    to: "/workflows",
    icon: <Workflow className="h-4 w-4" />,
    variant: "default" as const,
  },
  {
    title: "Settings",
    to: "/settings",
    icon: <Settings className="h-4 w-4" />,
    variant: "default" as const,
  },
];
