import React, { useEffect, useState } from "react";
import { Button } from "../ui/Button.jsx";
import {
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Layout,
  FileText,
  AlertCircle,
  Users,
  CreditCard,
  ShoppingCart,
  Shield,
  BarChart,
  ArrowUpRight
} from "lucide-react";
import {
  PM_STATS_TEMPLATE,
  PM_QUICK_ACTIONS_TEMPLATE,
  PROJECT_STATUS_COLORS
} from "../../constants/dashboard";
import { useNavigate } from "react-router-dom";
import useProjectStore from "../../stores/useProjectStore";
import useAuthStore from "../../stores/useAuthStore";
import { toast } from "react-hot-toast";
import { cn } from "../../lib/utils";

export default function PmDashboard() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { projects, fetchProjects, pmStats, fetchPmStats, loading } = useProjectStore();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchProjects(), fetchPmStats()]);
      setIsInitialLoading(false);
    };
    loadData();
  }, [fetchProjects, fetchPmStats]);

  const stats = PM_STATS_TEMPLATE.map(template => ({
    ...template,
    value: pmStats?.[template.key] || "0"
  }));

  const quickActions = PM_QUICK_ACTIONS_TEMPLATE;

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-bold animate-pulse">Initializing PM Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-full pb-10 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-[#1e2532] dark:text-white">
            Welcome back, {user?.name?.split(' ')[0] || 'Manager'}
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Here is the conflict resolution status for your {pmStats?.totalProjects || 0} active projects.
          </p>
        </div>
        <button
          onClick={() => navigate('/pm/analytics')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white dark:bg-[#0f1115] border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-600 dark:text-slate-400 hover:border-indigo-500/40 hover:text-indigo-600 transition-all shadow-sm"
        >
          <BarChart className="w-4 h-4" />
          View Analytics
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-slate-200/20 dark:shadow-none border border-slate-200 dark:border-slate-800 relative overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 ${stat.borderLeft || ""
              }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg} ${stat.iconColor}`}
              >
                <stat.icon className="w-4.5 h-4.5" />
              </div>
              <div
                className={`text-xs font-bold flex items-center ${stat.trendUp ? "text-emerald-500" : "text-red-500"
                  }`}
              >
                {stat.trendUp ? (
                  <TrendingUp className="w-3.5 h-3.5 mr-1" />
                ) : (
                  <TrendingDown className="w-3.5 h-3.5 mr-1" />
                )}
                {stat.trend}
              </div>
            </div>
            <div>
              <h3 className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1.5">
                {stat.title}
              </h3>
              <div className="text-3xl font-extrabold text-[#1e2532] dark:text-white leading-none">
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 leading-normal">
        {/* Main Content (Left, 2 columns wide) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-[#1e2532] dark:text-white">
              Active Projects
            </h2>
          </div>

          <div className="space-y-4">
            {projects.length > 0 ? (
              projects.map((proj, i) => (
                <div
                  key={proj._id}
                  onClick={() => navigate(`/pm/editor?projectId=${proj._id}`)}
                  className="group bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-lg shadow-slate-200/20 dark:shadow-none hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${i % 4 === 0 ? 'bg-indigo-500' : i % 4 === 1 ? 'bg-blue-500' : i % 4 === 2 ? 'bg-purple-500' : 'bg-emerald-500'}`}
                  >
                    {i % 4 === 0 ? <Shield className="w-5 h-5" /> : i % 4 === 1 ? <CreditCard className="w-5 h-5" /> : i % 4 === 2 ? <ShoppingCart className="w-5 h-5" /> : <Layout className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-[15px] text-[#1e2532] dark:text-white truncate">
                        {proj.name}
                      </h3>
                      <span
                        className={cn(
                          "text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold",
                          PROJECT_STATUS_COLORS[proj.status] || PROJECT_STATUS_COLORS.default
                        )}
                      >
                        {proj.status?.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-semibold truncate">
                      {proj.requirementCount || 0} Requirements • {proj.conflictCount || 0} Conflicts
                    </p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10 mt-4 sm:mt-0 shrink-0">
                    {/* Avatars */}
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-indigo-500 text-white border-2 border-white dark:border-slate-900 z-30 shadow-sm flex items-center justify-center text-[10px] font-bold">
                        {proj.projectManager?.name?.charAt(0) || 'P'}
                      </div>
                      {proj.team?.slice(0, 2).map((member, idx) => (
                        <div key={idx} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white dark:border-slate-900 z-20 shadow-sm flex items-center justify-center text-[10px] font-bold">
                          {member.name?.charAt(0) || 'D'}
                        </div>
                      ))}
                      {proj.team?.length > 2 && (
                        <div className="w-8 h-8 rounded-full bg-[#1e2532] text-white border-2 border-white dark:border-slate-900 z-10 flex items-center justify-center text-[11px] font-bold shadow-sm">
                          +{proj.team.length - 2}
                        </div>
                      )}
                    </div>
                    {/* Progress indicator */}
                    <div className="w-24 sm:w-32 flex flex-col gap-1.5">
                      <div className="flex justify-end text-[11px] font-bold text-[#1e2532] dark:text-slate-300">
                        {proj.conflictCount === 0 ? '100%' : 'Analyzed'}
                      </div>
                      <div className="w-full h-[6px] bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${proj.conflictCount === 0 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                          style={{ width: proj.conflictCount === 0 ? '100%' : '75%' }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 text-center bg-white/50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Layout className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Assigned Projects</h3>
                <p className="text-sm text-slate-500">You don't have any projects assigned to you yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar (1 column wide) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#1e2532] dark:text-white px-1">
            Quick Actions
          </h2>

          <div className="space-y-3">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.route)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5 group/action ${action.bg}`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${action.iconBg
                    } ${action.isDark
                      ? "text-white"
                      : "text-slate-600 dark:text-slate-300"
                    }`}
                >
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div
                    className={`font-bold text-sm ${action.isDark
                      ? "text-white"
                      : "text-[#1e2532] dark:text-white"
                      } truncate`}
                  >
                    {action.title}
                  </div>
                  <div
                    className={`text-xs mt-0.5 truncate font-semibold ${action.isDark ? "text-slate-400" : "text-slate-500"
                      }`}
                  >
                    {action.desc}
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform group-hover/action:translate-x-1 ${action.isDark ? "text-slate-400" : "text-slate-300"
                    }`}
                />
              </button>
            ))}
          </div>

          {/* Team Overview Mini Card */}
          <div className="bg-gradient-to-br from-[#1e2532] to-slate-900 rounded-2xl p-5 border border-indigo-500/10 shadow-xl shadow-indigo-500/5 mt-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <Users className="w-4.5 h-4.5 text-indigo-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Team Overview</p>
                <p className="text-[11px] text-slate-400 font-semibold">{pmStats?.teamCount || 0} members assigned</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/pm/team')}
              className="w-full mt-2 py-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-wider hover:bg-indigo-500/20 transition-all"
            >
              Manage Team →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
