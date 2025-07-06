
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { navItems, navCategories } from "@/nav-items";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  // Group nav items by category
  const groupedItems = navItems.reduce((groups, item) => {
    const category = item.category || 'main';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as Record<string, typeof navItems>);
  
  return (
    <aside className="bg-card border-r border-border w-64 flex flex-col">
      <div className="py-6 flex items-center justify-start px-6">
        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">
          <span className="text-white text-lg font-bold">C</span>
        </div>
        <div className="ml-3">
          <span className="text-xl font-bold tracking-wider bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            CECILIA
          </span>
          <p className="text-xs text-muted-foreground">AI Assistant</p>
        </div>
      </div>
      
      <nav className="flex-1 mt-6 px-3">
        {Object.entries(groupedItems).map(([categoryKey, items]) => (
          <div key={categoryKey} className="mb-6">
            <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {navCategories[categoryKey as keyof typeof navCategories] || categoryKey}
            </h3>
            <ul className="space-y-1">
              {items.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className={cn(
                      "flex items-center py-2 px-3 rounded-md transition-colors duration-200",
                      currentPath === item.to
                        ? "bg-gradient-to-r from-cyan-500/10 to-blue-500/10 text-cyan-400 border border-cyan-400/20"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      
      <div className="p-4 mt-auto">
        <div className="text-xs text-muted-foreground">
          CECILIA AI Platform
        </div>
        <div className="text-xs text-muted-foreground/50">
          v2.0.0 - Enhanced Intelligence
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
