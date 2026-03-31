import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Bell, Search, Sun, Moon, HelpCircle, Settings, Menu, LogOut, User } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/Avatar";
import ThemeToggle from "../ThemeToggle";
import useAuthStore from "../../stores/useAuthStore";
import { Dropdown } from "../ui/Dropdown";
import { useNavigate } from "react-router-dom";

export function TopHeader({ role, onMenuClick }) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  let searchPlaceholder = "Search...";
  if (role === "bde") searchPlaceholder = "Search projects...";
  if (role === "pm")
    searchPlaceholder = "Search projects, requirements or conflicts...";
  if (role === "dev") searchPlaceholder = "Search modules or conflicts...";

  const profileName = user?.name || "User";
  const profileRole = user?.role?.toUpperCase() || role?.toUpperCase() || "USER";
  const profileInitials = user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "U";

  const handleProfileClick = () => {
    navigate(`/${role}/profile`);
  };

  const handleSettingsClick = () => {
    navigate(`/${role}/settings`);
  };

  return (
    <header className="h-16 bg-white/70 dark:bg-[#0f1115]/70 backdrop-blur-md flex items-center justify-between px-4 md:px-6 shrink-0 z-50 shadow-sm border-b border-slate-200/50 dark:border-slate-800/50 sticky top-0 transition-colors duration-300">
      <div className="flex-1 flex items-center gap-3 md:gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          aria-label="Toggle Menu"
        >
          <Menu className="w-6 h-6" />
        </button>
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

        <ThemeToggle />

        <Dropdown
          trigger={
            <div className="flex items-center gap-3 select-none cursor-pointer group">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{profileName}</div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{profileRole}</div>
              </div>
              <Avatar className="w-9 h-9 border-2 border-transparent group-hover:border-indigo-500 transition-all shadow-sm">
                <AvatarFallback className="bg-linear-to-tr from-indigo-500 to-blue-500 text-white font-black text-xs uppercase">
                  {profileInitials}
                </AvatarFallback>
              </Avatar>
            </div>
          }
          className="w-48 mt-4 p-2 rounded-2xl border border-slate-200 dark:border-slate-800"
        >
          <div className="px-3 py-2 mb-2 border-b border-slate-100 dark:border-slate-800/50 sm:hidden">
            <p className="text-sm font-bold text-slate-900 dark:text-white">{profileName}</p>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{profileRole}</p>
          </div>
          <button
            onClick={handleProfileClick}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all"
          >
            <User className="w-4 h-4" />
            My Profile
          </button>
          <button
            onClick={handleSettingsClick}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition-all"
          >
            <Settings className="w-4 h-4" />
            Account Settings
          </button>
          <div className="my-2 border-t border-slate-100 dark:border-slate-800/50"></div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
          >
            <LogOut className="w-4 h-4" />
            Logout Session
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
