import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Bell, Search, Sun, Moon, HelpCircle, Settings } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/Avatar";

export function TopHeader({ role }) {
  const { theme, setTheme } = useTheme();

  let searchPlaceholder = "Search...";
  if (role === "bde") searchPlaceholder = "Search projects...";
  if (role === "pm")
    searchPlaceholder = "Search projects, requirements or conflicts...";
  if (role === "dev") searchPlaceholder = "Search modules or conflicts...";

  let profileName = "Jane Doe";
  let profileRole = "BDE";
  let profileInitials = "JD";

  if (role === "pm") {
    profileName = "Alex Rivera";
    profileRole = "Project Manager";
    profileInitials = "AR";
  } else if (role === "dev") {
    profileName = "Alex Rivera";
    profileRole = "Senior Dev";
    profileInitials = "AR";
  }

  return (
    <header className="h-16 bg-white/70 dark:bg-[#0f1115]/70 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-50 shadow-sm border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 transition-colors duration-300">
      <div className="flex-1 flex items-center gap-4">
        {role === "bde" && (
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span>Dashboard</span>
            <span>›</span>
            <span className="font-medium text-foreground">
              Projects Overview
            </span>
          </div>
        )}
      </div>

      <div className="flex-1 max-w-xl mx-4">
        <div className="group relative rounded-full bg-slate-100/80 dark:bg-slate-800/50 flex items-center px-4 py-2 text-sm w-full max-w-md mx-auto xl:mx-0 border border-transparent focus-within:border-indigo-500/30 focus-within:bg-white dark:focus-within:bg-[#0f1115] focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-300 shadow-inner dark:shadow-none">
          <Search className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-500 mr-2 transition-colors duration-300" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="bg-transparent border-none outline-none w-full text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-end gap-5">
        <button className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 relative hover:scale-110 active:scale-95 transition-all">
          <Bell className="w-5 h-5" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-[#0f1115] -mt-0.5 -mr-0.5 animate-pulse"></span>
        </button>

        {role === "pm" && (
          <button className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 active:scale-95 transition-all">
            <Settings className="w-5 h-5" />
          </button>
        )}

        {role === "dev" && (
          <button className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 active:scale-95 transition-all">
            <HelpCircle className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-110 active:scale-95 transition-all"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>

        <div className="flex items-center gap-3 select-none cursor-pointer group">
          {role === "pm" || role === "dev" ? (
            <div className="text-right hidden sm:block">
              <div className="text-sm font-medium">{profileName}</div>
              <div className="text-xs text-muted-foreground">{profileRole}</div>
            </div>
          ) : null}
          <Avatar className="w-8 h-8 border-2 border-transparent group-hover:border-indigo-500/30 transition-all shadow-sm">
            <AvatarFallback className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-100 font-bold">
              {profileInitials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
