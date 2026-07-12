import React from "react";
import { Search, Bell } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

function Header() {
  const { user } = useAuth();

  return (
    <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
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
        <button className="relative p-2 rounded-lg hover:bg-elevated transition-colors">
          <Bell size={18} className="text-muted" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-danger rounded-full" />
        </button>
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