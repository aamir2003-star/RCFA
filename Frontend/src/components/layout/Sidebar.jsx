/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/static-components */
import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Layers, X as CloseIcon, Activity } from "lucide-react";
import { cn } from "../../lib/utils.js";
import { NAV_ITEMS } from "../../constants/navigation";
import useAuthStore from "../../stores/useAuthStore";
import useProjectStore from "../../stores/useProjectStore";

export function Sidebar({ role, isOpen, onClose }) {
  const location = useLocation();
  const { user } = useAuthStore();
  const { currentProject, clearCurrentProject } = useProjectStore();
  const navigate = useNavigate();

  let title = currentProject?.name || "Spectra AI";
  let subtitle = currentProject ? "ACTIVE PROJECT" : "";

  if (role === "bde") {
    subtitle = "BDE DASHBOARD";
  } else if (role === "pm") {
    subtitle = subtitle || "PREMIUM SAAS";
  }

  const handleHeaderClick = () => {
    if (currentProject) {
      clearCurrentProject();
      navigate(`/${role}/dashboard`);
    }
  };

  // NavLink renderer component block
  const SidebarLink = ({ to, icon: Icon, label, badge, activePaths = [] }) => (
    <NavLink
      to={to}
      onClick={onClose}
      className={({ isActive }) => {
        const isManuallyActive = activePaths.some(
          (p) =>
            location.pathname === p || location.pathname.startsWith(`${p}/`),
        );
        const active = isActive || isManuallyActive;
        return cn(
          "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer border border-transparent",
          active
            ? "bg-linear-to-r from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/25 scale-[1.02]"
            : "text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white hover:translate-x-1",
        );
      }}
    >
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5" />
        {label}
      </div>
      {badge && (
        <span className="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 py-0.5 px-2 rounded-full text-xs font-bold">
          {badge}
        </span>
      )}
    </NavLink>
  );

  return (
    <div className={cn(
      "fixed lg:static top-16 lg:top-0 bottom-0 left-0 w-64 bg-white/90 dark:bg-[#080b11]/90 backdrop-blur-xl flex flex-col h-[calc(100vh-64px)] lg:h-full shrink-0 shadow-2xl shadow-indigo-500/5 dark:shadow-none border-r border-slate-200/50 dark:border-slate-800/50 z-50 transition-all duration-300 transform",
      isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}>
      <div className="p-6 flex flex-col gap-1 relative border-b border-slate-100 dark:border-slate-800/50 mb-4">
        <button
          onClick={onClose}
          className="lg:hidden absolute top-6 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <CloseIcon className="w-5 h-5" />
        </button>
        <div
          onClick={handleHeaderClick}
          className={cn(
            "flex items-center gap-3 font-extrabold text-lg tracking-tight text-slate-900 dark:text-white group",
            currentProject ? "cursor-pointer hover:opacity-80 transition-opacity" : "cursor-default"
          )}
        >
          <div className="w-8 h-8 bg-linear-to-tr from-indigo-600 to-blue-500 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 group-active:scale-95 transition-all duration-300">
            <Layers className="text-white w-5 h-5" />
          </div>
          <span className="truncate" title={title}>{title}</span>
        </div>
        {subtitle && (
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-11">
            {subtitle}
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 py-2 flex flex-col gap-2 overflow-y-auto custom-scrollbar">
        {NAV_ITEMS[role]?.map((item, index) => (
          item.type === 'separator' ? (
            <div key={index} className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-6 mb-2 px-3">
              {item.label}
            </div>
          ) : (
            <SidebarLink
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              badge={item.badge}
            />
          )
        ))}
      </nav>

      {/* Status indicators bottom */}
      <div className="p-4 mt-auto space-y-4 border-t border-slate-100 dark:border-slate-800/50">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">System Online</span>
          </div>
          <Activity className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600" />
        </div>
      </div>
    </div>
  );
}
