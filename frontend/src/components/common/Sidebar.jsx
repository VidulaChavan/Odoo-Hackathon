import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/dashboard", roles: ["FLEET_MANAGER", "DISPATCHER", "SAFETY_OFFICER", "FINANCIAL_ANALYST"] },
  { label: "Trip Dispatcher", path: "/trips", roles: ["DISPATCHER"] },
  { label: "Vehicle Registry", path: "/vehicles", roles: ["FLEET_MANAGER", "DISPATCHER"] },
  { label: "Maintenance", path: "/maintenance", roles: ["FLEET_MANAGER"] },
  { label: "Driver Management", path: "/drivers", roles: ["SAFETY_OFFICER"] },
  { label: "Fuel & Expense", path: "/fuel-expense", roles: ["FINANCIAL_ANALYST"] },
  { label: "Reports & Analytics", path: "/reports", roles: ["FLEET_MANAGER", "FINANCIAL_ANALYST"] },
];

function Sidebar() {
  const { user, logout } = useAuth();

  const visibleItems = navItems.filter((item) => item.roles.includes(user?.role));

  return (
    <nav className="w-56 h-screen bg-surface border-r border-border flex flex-col p-4">
      <div className="text-text font-semibold mb-6 text-lg">TransitOps</div>

      <div className="flex flex-col gap-2 flex-1">
        {visibleItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="text-text px-3 py-2 rounded hover:bg-elevated hover:text-accent transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </div>

      <button
        onClick={logout}
        className="text-muted hover:text-danger text-sm px-3 py-2 text-left"
      >
        Logout
      </button>
    </nav>
  );
}

export default Sidebar;