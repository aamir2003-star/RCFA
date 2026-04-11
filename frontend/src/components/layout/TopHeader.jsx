import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import { Bell, Search, Sun, Moon, HelpCircle, Settings, Menu, LogOut, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/Avatar";
import { cn, getAvatarUrl } from "../../lib/utils";
import ThemeToggle from "../ThemeToggle";
import useAuthStore from "../../stores/useAuthStore";
import { Dropdown } from "../ui/Dropdown";
import { useNavigate } from "react-router-dom";
import useNotificationStore from "../../stores/useNotificationStore";
import { useEffect } from "react";

export function TopHeader({ role, onMenuClick }) {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  let searchPlaceholder = "Search...";
  if (role === "bde") searchPlaceholder = "Search projects...";
  if (role === "pm") searchPlaceholder = "Search project workspace...";
  if (role === "dev") searchPlaceholder = "Search technical modules...";

  const profileName = user?.name || "User";
  const profileRole = user?.role?.toUpperCase() || role?.toUpperCase() || "USER";
  const profileInitials = user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || "U";

  const handleProfileClick = () => navigate(`/${role}/profile`);
  const handleSettingsClick = () => navigate(`/${role}/settings`);
  const handleNotificationsClick = () => navigate(`/${role}/notifications`);

  const { unreadCount, fetchNotifications, initSocket } = useNotificationStore();

  useEffect(() => {
    const userId = user?._id || user?.id;
    if (userId) {
      fetchNotifications();
      const cleanup = initSocket(userId);
      return cleanup;
    }
  }, [user?._id, user?.id, fetchNotifications, initSocket]);

  return (
    <header className="h-[72px] bg-white/80 dark:bg-[#080b11]/80 backdrop-blur-xl flex items-center justify-between px-8 shrink-0 z-50 sticky top-0 border-b border-border/30 transition-all">
      <div className="flex-1 flex items-center gap-6">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2.5 rounded-xl hover:bg-secondary transition-colors"
        >
          <Menu className="w-5 h-5 text-foreground" />
        </button>

        <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-secondary/40 rounded-full border border-border/20 max-w-md w-full shadow-inset-subtle">
          <Search className="w-4 h-4 text-muted" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="bg-transparent border-none outline-none text-[13px] font-medium w-full placeholder:text-muted/60"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Global Actions */}
        <div className="flex items-center gap-2 pr-4 border-r border-border/30">
          <button
            onClick={handleNotificationsClick}
            className="p-3 text-muted hover:text-foreground relative hover:scale-105 active:scale-95 transition-all"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-black dark:bg-white rounded-full border-2 border-white dark:border-[#080b11]"></span>
            )}
          </button>
          <ThemeToggle />
        </div>

        <Dropdown
          trigger={
            <div className="flex items-center gap-4 pl-2 select-none cursor-pointer group warm-pill">
              <Avatar className="w-8 h-8 rounded-full border border-background shadow-premium overflow-hidden">
                <AvatarImage src={getAvatarUrl(user?.avatar)} alt={profileName} />
                <AvatarFallback className="bg-black text-white font-bold text-[10px] uppercase">
                  {profileInitials}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden sm:block">
                <div className="text-[13px] font-bold text-foreground leading-none mb-0.5">{profileName}</div>
                <div className="text-[9px] font-bold text-muted uppercase tracking-[0.15em]">{profileRole}</div>
              </div>
            </div>
          }
          className="w-56 mt-4 p-3 rounded-2xl border border-border/50 bg-white dark:bg-[#0f1219] shadow-premium"
        >
          <div className="px-4 py-3 mb-2 border-b border-border/30 sm:hidden">
            <p className="text-sm font-bold text-foreground">{profileName}</p>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest">{profileRole}</p>
          </div>

          <button onClick={handleProfileClick} className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-medium text-muted hover:text-foreground hover:bg-secondary rounded-xl transition-all">
            <UserIcon className="w-4 h-4" />
            Profile Overview
          </button>

          <button onClick={handleSettingsClick} className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-medium text-muted hover:text-foreground hover:bg-secondary rounded-xl transition-all">
            <Settings className="w-4 h-4" />
            System Settings
          </button>

          <div className="my-2 border-t border-border/30"></div>

          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 text-[13px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all">
            <LogOut className="w-4 h-4" />
            End Session
          </button>
        </Dropdown>
      </div>
    </header>
  );
}
