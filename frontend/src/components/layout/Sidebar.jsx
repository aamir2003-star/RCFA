/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/static-components */
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Layers, X as CloseIcon, Activity } from "lucide-react";
import { cn } from "../../lib/utils";
import { NAV_ITEMS } from "../../constants/navigation";
import useAuthStore from "../../stores/useAuthStore";
import useProjectStore from "../../stores/useProjectStore";

export function Sidebar({ role, isOpen, onClose }) {
  const location = useLocation();
  const { user } = useAuthStore();
  const { currentProject, clearCurrentProject } = useProjectStore();
  const navigate = useNavigate();

  let title = currentProject?.name || "Spectra AI";
  let subtitle = currentProject ? "Project Active" : "";

  if (role === "bde") {
    subtitle = "Business Dashboard";
  } else if (role === "pm") {
    subtitle = subtitle || "Operations Hub";
  }

  const handleHeaderClick = () => {
    if (currentProject) {
      clearCurrentProject();
      navigate(`/${role}/dashboard`);
    }
  };

  const SidebarLink = ({ to, icon: Icon, label, badge, activePaths = [], matchSubPath }) => (
    <NavLink
      to={to}
      end={!matchSubPath}
      onClick={onClose}
      className={({ isActive }) => {
        const isManuallyActive = activePaths.some(
          (p) => location.pathname === p || location.pathname.startsWith(`${p}/`),
        );
        const isSubPathActive = matchSubPath && location.pathname.includes(matchSubPath);
        const active = isActive || isManuallyActive || isSubPathActive;

        return cn(
          "flex items-center justify-between px-4 py-3 rounded-full text-[15px] font-medium transition-all duration-300 cursor-pointer border border-transparent mb-1",
          active
            ? "bg-black dark:bg-white text-white dark:text-black shadow-pill scale-[1.01]"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:translate-x-0.5",
        );
      }}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-[18px] h-[18px]" />
        {label}
      </div>
      {badge && (
        <span className="bg-secondary text-foreground py-0.5 px-2.5 rounded-full text-[11px] font-bold shadow-inset-subtle">
          {badge}
        </span>
      )}
    </NavLink>
  );

  return (
    <div className={cn(
      "fixed lg:static top-16 lg:top-0 bottom-0 left-0 w-[280px] bg-white dark:bg-[#080b11] flex flex-col h-[calc(100vh-64px)] lg:h-full shrink-0 z-50 transition-all duration-300 transform border-r border-border/40",
      isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}>
      <div className="p-8 flex flex-col gap-1 relative mb-4">
        <button
          onClick={onClose}
          className="lg:hidden absolute top-8 right-6 p-2 text-muted-foreground hover:text-foreground"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
        <div
          onClick={handleHeaderClick}
          className={cn(
            "flex items-center gap-4 group",
            currentProject ? "cursor-pointer hover:opacity-80 transition-opacity" : "cursor-default"
          )}
        >
          <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center shadow-premium group-hover:scale-105 transition-all duration-300">
            <Layers className="text-white dark:text-black w-6 h-6" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xl font-display font-[300] text-foreground truncate" title={title}>{title}</span>
            {subtitle && (
              <span className="text-[10px] font-bold text-muted uppercase tracking-[0.2em]">
                {subtitle}
              </span>
            )}
          </div>
        </div>
      </div>

      <nav className="flex-1 px-6 py-2 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS[role]?.map((item, index) => (
          item.type === 'separator' ? (
            <div key={index} className="text-[11px] font-bold text-muted uppercase tracking-[0.2em] mt-8 mb-4 px-4 opacity-60">
              {item.label}
            </div>
          ) : (
            <SidebarLink
              key={`${item.to}-${index}`}
              to={item.to}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
              matchSubPath={item.matchSubPath}
            />
          )
        ))}
      </nav>

      {/* System Status */}
      <div className="p-6 mt-auto border-t border-border/30">
        <div className="flex items-center justify-between px-3 py-4 rounded-2xl bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
            <span className="text-[11px] font-bold text-muted tracking-wider uppercase">Pipeline Ready</span>
          </div>
          <Activity className="w-4 h-4 text-muted/40" />
        </div>
      </div>
    </div>
  );
}
