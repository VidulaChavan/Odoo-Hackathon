import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Zap, LayoutDashboard, Route, Truck, Wrench, Users, Fuel, BarChart3, LogOut,
} from "lucide-react";

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: ["FLEET_MANAGER", "DISPATCHER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"] },
  { label: "Trip Dispatcher", path: "/trips", icon: Route, roles: ["DISPATCHER"] },
  { label: "Vehicle Registry", path: "/vehicles", icon: Truck, roles: ["FLEET_MANAGER", "DISPATCHER"] },
  { label: "Maintenance", path: "/maintenance", icon: Wrench, roles: ["FLEET_MANAGER"] },
  { label: "Driver Management", path: "/drivers", icon: Users, roles: ["SAFETY_OFFICER"] },
  { label: "Fuel & Expense", path: "/fuel-expense", icon: Fuel, roles: ["FINANCIAL_ANALYST"] },
  { label: "Reports & Analytics", path: "/reports", icon: BarChart3, roles: ["FLEET_MANAGER", "FINANCIAL_ANALYST"] },
];

function Sidebar() {
  const { user, logout } = useAuth();
  const visibleItems = navItems.filter((item) => item.roles.includes(user?.role));

  return (
    <nav className="w-56 h-screen bg-surface border-r border-border flex flex-col p-4">
      <div className="flex items-center gap-2 mb-6">
        <div className="bg-accent/10 rounded-lg p-1.5">
          <Zap size={20} className="text-accent" fill="currentColor" />
        </div>
        <span className="text-text font-semibold text-lg">TransitOps</span>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 text-text px-3 py-2 rounded-lg hover:bg-elevated hover:text-accent transition-colors text-sm"
            >
              <Icon size={17} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <button
        onClick={logout}
        className="flex items-center gap-2 text-muted hover:text-danger text-sm px-3 py-2 text-left"
      >
        <LogOut size={16} />
        Logout
      </button>
    </nav>
  );
}

export default Sidebar;