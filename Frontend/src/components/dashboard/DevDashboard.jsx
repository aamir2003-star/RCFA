import React, { useEffect } from "react";
import { Button } from "../ui/Button.jsx";
import { Bug, FileText, Bot, ArrowRight, LayoutGrid, AlertTriangle, MessageSquare, CheckCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useModuleStore from "../../stores/useModuleStore";
import useAuthStore from "../../stores/useAuthStore";
import useProjectStore from "../../stores/useProjectStore";
import { cn } from "../../lib/utils.js";
export default function DevDashboard() {
  const { user } = useAuthStore();
  const { modules, loading: modulesLoading, fetchMyModules } = useModuleStore();
  const { conflicts, fetchConflicts } = useProjectStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) {
      fetchMyModules(user._id);
    }
  }, [user?._id, fetchMyModules]);

  useEffect(() => {
    if (modules.length > 0) {
      const projectIds = [...new Set(modules.map(m => m.projectId))];
      projectIds.forEach(id => fetchConflicts(id));
    }
  }, [modules, fetchConflicts]);

  const getModuleConflicts = (moduleReqIds) => {
    if (!moduleReqIds) return [];
    return conflicts.filter(c =>
      (moduleReqIds.includes(c.requirementA?._id || c.requirementA) ||
        moduleReqIds.includes(c.requirementB?._id || c.requirementB)) &&
      c.status === 'open'
    );
  };

  const totalConflicts = modules.reduce((acc, mod) => {
    const reqIds = mod.requirements?.map(r => r._id || r) || [];
    return acc + getModuleConflicts(reqIds).length;
  }, 0);

  const completedModules = modules.filter(m => m.status === 'completed').length;
  const progressPercent = modules.length > 0 ? Math.round((completedModules / modules.length) * 100) : 0;

  const stats = [
    {
      title: "MODULES ASSIGNED",
      value: modules.length.toString(),
      subtext: "Active blocks",
      color: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30",
      icon: LayoutGrid,
    },
    {
      title: "OPEN CONFLICTS",
      value: totalConflicts.toString(),
      subtext: totalConflicts > 0 ? "Action required" : "All clear",
      color: totalConflicts > 0 ? "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500" : "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30",
      icon: AlertTriangle,
    },
    {
      title: "PROJECTS",
      value: [...new Set(modules.map(m => m.projectId))].length.toString(),
      subtext: "Active streams",
      color: "text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30",
      icon: MessageSquare,
    },
    {
      title: "COMPLETION",
      value: `${progressPercent}%`,
      isProgress: true,
      color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30",
      icon: CheckCircle,
    },
  ];

  if (modulesLoading && modules.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full max-w-full pb-10 animate-in fade-in duration-700">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          Welcome back, {user?.name?.split(' ')[0] || 'Developer'}{" "}
          <span className="text-3xl md:text-4xl leading-none origin-bottom-right rotate-12 inline-block">
            👋
          </span>
        </h1>
        <p className="text-sm md:text-base text-muted-foreground mt-2 font-medium">
          You have{" "}
          <span className="text-slate-900 dark:text-white font-bold">
            {totalConflicts} unresolved conflicts
          </span>{" "}
          requiring implementation decisions today.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-slate-200/20 dark:shadow-none border border-slate-200 dark:border-slate-800 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 ${stat.title === "OPEN CONFLICTS" && totalConflicts > 0
              ? "border-l-4 border-l-red-500/80 shadow-red-500/10"
              : ""
              }`}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-black tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                {stat.title}
              </h3>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}
              >
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {stat.value}
              </div>
              {!stat.isProgress ? (
                <p
                  className={`text-xs mt-2 font-bold ${stat.title === "OPEN CONFLICTS" && totalConflicts > 0
                    ? "text-red-500"
                    : "text-emerald-500"
                    }`}
                >
                  {stat.subtext}
                </p>
              ) : (
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-3 shadow-inner">
                  <div
                    className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (Main content) */}
        <div className="lg:col-span-2 space-y-8">
          {/* My Modules */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Active Modules
              </h2>
              <Button
                variant="link"
                onClick={() => navigate("/dev/modules")}
                className="text-sm font-bold text-indigo-600 dark:text-indigo-400 px-0"
              >
                View All Modules <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {modules.slice(0, 4).map((mod, i) => {
                const modConflicts = getModuleConflicts(mod.requirements?.map(r => r._id || r));
                return (
                  <div
                    key={i}
                    className="group bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md shadow-lg shadow-slate-200/20 dark:shadow-none border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/40 dark:hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-2">
                        <span
                          className={cn(
                            "text-[10px] font-black tracking-wider px-2 py-0.5 rounded uppercase border",
                            mod.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                              mod.status === 'in-progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                'bg-slate-50 text-slate-500 border-slate-100'
                          )}
                        >
                          {mod.status || 'Pending'}
                        </span>
                      </div>
                      <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 line-clamp-1">
                        {mod.name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                        {mod.requirements?.length || 0} Requirements
                      </p>
                    </div>

                    <div className="flex justify-between mt-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-100 dark:border-slate-800/60">
                      <div className="text-center">
                        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                          REQS
                        </div>
                        <div className="text-[22px] font-extrabold text-slate-900 dark:text-slate-100 leading-none">
                          {mod.requirements?.length || 0}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                          CONFLICTS
                        </div>
                        <div className={cn(
                          "text-[22px] font-extrabold leading-none",
                          modConflicts.length > 0 ? "text-red-500" : "text-slate-300 dark:text-slate-700"
                        )}>
                          {modConflicts.length}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                          PRIORITY
                        </div>
                        <div className="text-[22px] font-extrabold text-indigo-500 leading-none">
                          --
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-3 relative z-10">
                      <Button
                        onClick={() => navigate("/dev/modules")}
                        className="flex-1 bg-slate-900 hover:bg-slate-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                      >
                        Implement
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="shrink-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:-translate-y-0.5 transition-all duration-300 shadow-sm active:scale-95"
                      >
                        <FileText className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
              {modules.length === 0 && (
                <div className="col-span-2 py-10 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center gap-2">
                  <LayoutGrid className="w-10 h-10 text-slate-300" />
                  <p className="text-sm font-bold text-slate-500 tracking-tight">No active modules assigned to your profile yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Active Conflicts Table */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white px-1">
              Active Specification Conflicts
            </h2>
            <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md shadow-lg shadow-slate-200/20 dark:shadow-none border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 font-black border-b border-slate-200/60 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4 font-bold">PRIORITY</th>
                      <th className="px-6 py-4 font-bold">CONFLICT TYPE</th>
                      <th className="px-6 py-4 font-bold">EXPLANATION</th>
                      <th className="px-6 py-4 font-bold text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {conflicts.filter(c => c.status === 'open').slice(0, 5).map((conf, i) => (
                      <tr
                        key={i}
                        className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full",
                                conf.severityColor === 'Red' ? 'bg-red-500' :
                                  conf.severityColor === 'Orange' ? 'bg-orange-500' : 'bg-yellow-500'
                              )}
                            ></div>
                            <span
                              className={cn(
                                "text-[10px] font-black tracking-wider uppercase",
                                conf.severityColor === 'Red' ? 'text-red-500' :
                                  conf.severityColor === 'Orange' ? 'text-orange-500' : 'text-yellow-600'
                              )}
                            >
                              {conf.severityColor || 'Medium'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white uppercase text-[10px]">
                          {conf.conflictType}
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-semibold text-xs line-clamp-1 max-w-xs">
                          {conf.explanation}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="outline"
                            onClick={() => navigate(`/dev/conflicts/${conf._id}/discussion`)}
                            className="text-indigo-600 dark:text-indigo-400 font-bold bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-500/30 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 active:scale-95 text-[10px] px-3 h-8"
                          >
                            View Strategy
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {conflicts.length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-6 py-10 text-center text-slate-400 font-semibold italic">
                          No active conflicts detected in your assigned modules.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-8">
          {/* Sprint Card */}
          <div className="bg-linear-to-br from-indigo-500 via-purple-500 to-blue-600 border border-white/10 text-white overflow-hidden relative shadow-2xl shadow-indigo-500/30 rounded-3xl p-7 group hover:shadow-indigo-500/40 hover:-translate-y-1 transition-all duration-300">
            <div className="absolute -top-12 -right-10 p-4 opacity-20 rotate-12 scale-[2.5] group-hover:rotate-20 group-hover:scale-[2.8] transition-transform duration-700">
              <Bot className="w-32 h-32" />
            </div>
            <div className="relative z-10 flex flex-col gap-3">
              <h3 className="font-extrabold text-2xl tracking-tight">
                Architect Node
              </h3>
              <p className="text-sm text-blue-100 font-medium leading-relaxed mb-2">
                Implementation metrics are synchronized across your {modules.length} assigned blocks.
              </p>
              <Button
                onClick={() => navigate("/dev/modules")}
                className="w-full bg-white text-indigo-600 hover:bg-slate-50 shadow-md font-bold py-5 border-0 transition-colors"
              >
                Go to Implementation
              </Button>
            </div>
          </div>

          {/* Activity Feed (Simulated for Now) */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white px-1">
              Dev Stream Activity
            </h2>
            <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md shadow-lg shadow-slate-200/20 dark:shadow-none border border-slate-200 dark:border-slate-800 rounded-3xl p-6 relative hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
              {/* Vertical Line */}
              <div className="absolute left-[39px] top-8 bottom-8 w-0.5 bg-linear-to-b from-slate-200 via-slate-200 to-transparent dark:from-slate-800 dark:via-slate-800 dark:to-transparent z-0"></div>

              <div className="space-y-6 relative z-10">
                <div className="flex gap-4 group">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-[3px] border-white dark:border-slate-900 shadow-sm z-10 bg-emerald-50 text-emerald-500 uppercase font-black text-[10px]">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 pb-1 pt-1.5">
                    <div className="font-bold text-[13px] text-slate-900 dark:text-white leading-snug">
                      Module Logic Sync
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase">
                      {modules.length} Blocks Online
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 group">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-[3px] border-white dark:border-slate-900 shadow-sm z-10 bg-indigo-50 text-indigo-500 uppercase font-black text-[10px]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 pb-1 pt-1.5">
                    <div className="font-bold text-[13px] text-slate-900 dark:text-white leading-snug">
                      Conflict Analysis Scan
                    </div>
                    <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1 uppercase">
                      {totalConflicts} Warnings Active
                    </div>
                  </div>
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={() => navigate("/dev/modules")}
                className="w-full mt-6 font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-900/50 h-10 border border-slate-100 dark:border-slate-800"
              >
                Expand My Workspace
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
