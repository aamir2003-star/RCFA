/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/static-components */
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils.js";
import {
  Layers,
  Folder,
  Users,
  BarChart,
  Settings,
  LayoutDashboard,
  FileText,
  AlertTriangle,
  MessageSquare,
  Box,
  History,
  Activity,
  X,
  Briefcase
} from "lucide-react";
import useAuthStore from "../../stores/useAuthStore";
import useProjectStore from "../../stores/useProjectStore";

export function Sidebar({ role, isOpen, onClose }) {
  const location = useLocation();
  const { user } = useAuthStore();
  const { currentProject } = useProjectStore();

  let title = currentProject?.name || "Resolver AI";
  let subtitle = currentProject ? "ACTIVE PROJECT" : "";

  if (role === "bde") {
    subtitle = "BDE DASHBOARD";
  } else if (role === "pm") {
    subtitle = subtitle || "PREMIUM SAAS";
  }

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
      <div className="p-6 flex flex-col gap-1 relative">
        <button
          onClick={onClose}
          className="lg:hidden absolute top-6 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3 font-extrabold text-lg tracking-tight text-slate-900 dark:text-white group cursor-pointer">
          <div className="w-8 h-8 bg-linear-to-tr from-indigo-600 to-blue-500 rounded-lg flex items-center justify-center shadow-md shadow-indigo-500/20 group-hover:scale-105 group-active:scale-95 transition-all duration-300">
            <Layers className="text-white w-5 h-5" />
          </div>
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-muted-foreground font-semibold uppercase pl-11">
            {subtitle}
          </div>
        )}
      </div>

      <nav className="flex-1 px-4 py-2 flex flex-col gap-2">
        {role === "dev" && (
          <>
            <SidebarLink
              to="/dev/dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
            />
            <SidebarLink to="/dev/modules" icon={Box} label="My Modules" />
            <SidebarLink to="/dev/editor" icon={FileText} label="Specifications" />
            <SidebarLink to="/dev/vault" icon={Layers} label="Technical Vault" />
            <SidebarLink
              to="/dev/conflicts"
              icon={AlertTriangle}
              label="Conflicts"
              badge={4}
            />
            <SidebarLink
              to="/dev/discussions"
              icon={MessageSquare}
              label="Discussions"
            />
            <div className="text-xs font-semibold text-muted-foreground uppercase mt-4 mb-2 px-3">
              SYSTEMS
            </div>
            <SidebarLink to="/dev/settings" icon={Settings} label="Settings" />
          </>
        )}

        {role === "pm" && (
          <>
            <SidebarLink
              to="/pm/dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
            />
            <SidebarLink
              to="/pm/workspace"
              icon={Box}
              label="Workspace"
            />
            <SidebarLink
              to="/pm/editor"
              icon={FileText}
              label="Requirements"
            />
            <SidebarLink
              to="/pm/conflicts"
              icon={AlertTriangle}
              label="Conflicts"
              badge={12}
            />
            <SidebarLink
              to="/pm/timeline"
              icon={History}
              label="Timeline"
            />
            <SidebarLink to="/pm/analytics" icon={BarChart} label="Analytics" />
            <SidebarLink to="/pm/team" icon={Users} label="Team" />
            <SidebarLink to="/pm/settings" icon={Settings} label="Settings" />
          </>
        )}

        {role === "bde" && (
          <>
            <SidebarLink
              to="/bde/dashboard"
              icon={LayoutDashboard}
              label="Dashboard"
            />
            <SidebarLink to="/bde/projects" icon={Folder} label="Projects" />
            <SidebarLink to="/bde/reports" icon={FileText} label="Reporting" />
            <SidebarLink to="/bde/teams" icon={Users} label="Teams" />
            <SidebarLink
              to="/bde/analytics"
              icon={BarChart}
              label="Analytics"
            />
            <SidebarLink to="/bde/settings" icon={Settings} label="Settings" />
          </>
        )}
      </nav>

      {/* Storage usage for BDE */}
      {role === "bde" && (
        <div className="p-4 mx-4 mb-6 bg-secondary/50 rounded-lg">
          <div className="text-sm font-medium mb-2">Storage Usage</div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-slate-700 w-[64%]"></div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            64% of 100GB used
          </div>
        </div>
      )}

      {/* AI Credits for PM */}
      {role === "pm" && (
        <div className="p-4 mx-4 mb-6 bg-secondary/50 rounded-lg">
          <div className="text-sm font-medium mb-2">AI Credits</div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-slate-700 w-[65%]"></div>
          </div>
          <div className="text-xs text-muted-foreground mt-2">
            650 / 1000 requests used
          </div>
        </div>
      )}

      {/* User profile brief for all roles */}
      <div className="p-4 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between bg-white/50 dark:bg-[#080b11]/50 backdrop-blur-md">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-linear-to-tr from-indigo-400 to-blue-400 shadow-sm border-2 border-white dark:border-[#080b11] group-hover:scale-105 transition-transform duration-300 flex items-center justify-center text-white font-bold text-xs">
            {user?.name?.[0] || "U"}
          </div>
          <div>
            <div className="text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {user?.name || "Guest User"}
            </div>
            <div className="text-xs text-muted-foreground uppercase tracking-tighter">
              {user?.role || role || "User"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
