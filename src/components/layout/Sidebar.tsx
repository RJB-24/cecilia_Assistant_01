
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
        <div className="relative w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-primary text-lg font-bold">L</span>
        </div>
        <span className="ml-3 text-xl font-semibold tracking-wider text-primary">
          LifeOS
        </span>
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
                        ? "bg-primary/10 text-primary border border-primary/20"
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
          LifeOS AI Assistant
        </div>
        <div className="text-xs text-muted-foreground/50">
          v1.0.0
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
