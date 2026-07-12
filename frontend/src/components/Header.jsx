import React, { useState } from "react";
import { Search, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const mockNotifications = [
  { id: 1, text: "Driver license expiring in 5 days", time: "10m ago" },
  { id: 2, text: "Vehicle MH12 AB 1234 due for maintenance", time: "1h ago" },
  { id: 3, text: "Trip TRP-0891 dispatched", time: "2h ago" },
];

function Header() {
  const { user } = useAuth();
  const [showNotifs, setShowNotifs] = useState(false);

  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-border relative">
      <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-2 w-72">
        <Search size={16} className="text-muted" />
        <input
          type="text"
          placeholder="Search anything..."
          className="bg-transparent text-sm text-text placeholder-muted focus:outline-none w-full"
        />
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        <div className="relative">
          <button
            onClick={() => setShowNotifs((prev) => !prev)}
            className="relative p-2 rounded-lg hover:bg-elevated transition-colors"
          >
            <Bell size={18} className="text-muted" />
            {mockNotifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-72 bg-surface border border-border rounded-xl shadow-lg z-10 p-2">
              <p className="text-text text-sm font-medium px-2 py-1">Notifications</p>
              {mockNotifications.map((n) => (
                <div key={n.id} className="px-2 py-2 hover:bg-elevated rounded-lg">
                  <p className="text-text text-sm">{n.text}</p>
                  <p className="text-muted text-xs">{n.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-semibold">
            {user?.email?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="hidden sm:block">
            <p className="text-text text-sm font-medium">{user?.email || "User"}</p>
            <p className="text-muted text-xs">{user?.role?.replace("_", " ") || ""}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Header;