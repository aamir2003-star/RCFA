import React from "react";
import { Button } from "../ui/Button.jsx";
import { Bug, FileText, Bot, ArrowRight } from "lucide-react";
import {
  devActiveConflicts,
  devModules,
  devStats,
  devTimeline,
} from "../../lib/features_utils.js";

export default function DevDashboard() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-full pb-10">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
          Welcome back, Alex{" "}
          <span className="text-4xl leading-none origin-bottom-right rotate-12 inline-block">
            👋
          </span>
        </h1>
        <p className="text-muted-foreground mt-2 font-medium">
          You have{" "}
          <span className="text-slate-900 dark:text-white font-bold">
            4 unresolved conflicts
          </span>{" "}
          requiring immediate pipeline attention today.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        {devStats.map((stat, i) => (
          <div
            key={i}
            className={`bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-slate-200/20 dark:shadow-none border border-slate-200 dark:border-slate-800 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 ${
              stat.title === "PENDING CONFLICTS"
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
                  className={`text-xs mt-2 font-bold ${
                    stat.title === "PENDING CONFLICTS"
                      ? "text-red-500"
                      : "text-emerald-500"
                  }`}
                >
                  {stat.subtext}
                </p>
              ) : (
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-3 shadow-inner">
                    <div
                      className="h-full bg-linear-to-r from-blue-500 to-indigo-500 rounded-full relative"
                      style={{ width: "85%" }}
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
                className="text-sm font-bold text-indigo-600 dark:text-indigo-400 px-0"
              >
                View All Modules <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {devModules.map((mod, i) => (
                <div
                  key={i}
                  className="group bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md shadow-lg shadow-slate-200/20 dark:shadow-none border border-slate-200 dark:border-slate-800 rounded-2xl p-5 flex flex-col justify-between hover:border-indigo-500/40 dark:hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors"></div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-2">
                      <span
                        className={`text-[10px] font-black tracking-wider px-2 py-0.5 rounded uppercase border ${mod.statusColor}`}
                      >
                        {mod.statusBadge}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1 line-clamp-1">
                      {mod.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {mod.project}
                    </p>
                  </div>

                  <div className="flex justify-between mt-6 bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-100 dark:border-slate-800/60">
                    <div className="text-center">
                      <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                        REQS
                      </div>
                      <div className="text-[22px] font-extrabold text-slate-900 dark:text-slate-100 leading-none">
                        {mod.reqs}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                        CONFLICTS
                      </div>
                      <div className="text-[22px] font-extrabold text-red-500 leading-none">
                        {mod.conflicts}
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 mb-1">
                        THREADS
                      </div>
                      <div className="text-[22px] font-extrabold text-indigo-500 leading-none">
                        {mod.threads}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3 relative z-10">
                    <Button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white dark:bg-indigo-600 dark:hover:bg-indigo-500 font-bold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 active:scale-95">
                      Update Progress
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/30 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 hover:-translate-y-0.5 transition-all duration-300 shadow-sm active:scale-95"
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/50 border-red-100 dark:border-red-900/50 hover:border-red-300 dark:hover:border-red-800 hover:-translate-y-0.5 transition-all duration-300 shadow-sm active:scale-95"
                    >
                      <Bug className="w-4 h-4 text-red-600 dark:text-red-400" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Conflicts Table */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white px-1">
              Active Conflicts
            </h2>
            <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md shadow-lg shadow-slate-200/20 dark:shadow-none border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 font-black border-b border-slate-200/60 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4 font-bold">PRIORITY</th>
                      <th className="px-6 py-4 font-bold">CONFLICT TITLE</th>
                      <th className="px-6 py-4 font-bold">MODULE</th>
                      <th className="px-6 py-4 font-bold text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {devActiveConflicts.map((conf, i) => (
                      <tr
                        key={i}
                        className="hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${conf.priorityColor}`}
                            ></div>
                            <span
                              className={`text-[10px] font-black tracking-wider ${conf.priorityColor.replace(
                                "bg-",
                                "text-"
                              )}`}
                            >
                              {conf.priority}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                          {conf.title}
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 font-semibold">
                          {conf.module}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button
                            variant="outline"
                            className="text-indigo-600 dark:text-indigo-400 font-bold bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 hover:border-indigo-500/30 hover:shadow-sm hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
                          >
                            Resolve
                          </Button>
                        </td>
                      </tr>
                    ))}
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
                Ready for a sprint?
              </h3>
              <p className="text-sm text-blue-100 font-medium leading-relaxed mb-2">
                AI has synthesized a 3-step solution matrix for your critical
                conflicts in the Billing V2 integration project.
              </p>
              <Button className="w-full bg-white text-indigo-600 hover:bg-slate-50 shadow-md font-bold py-5 border-0 transition-colors">
                Review Suggestions
              </Button>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white px-1">
              Recent Activity
            </h2>
            <div className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md shadow-lg shadow-slate-200/20 dark:shadow-none border border-slate-200 dark:border-slate-800 rounded-3xl p-6 relative hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300">
              {/* Vertical Line */}
              <div className="absolute left-[39px] top-8 bottom-8 w-0.5 bg-linear-to-b from-slate-200 via-slate-200 to-transparent dark:from-slate-800 dark:via-slate-800 dark:to-transparent z-0"></div>

              <div className="space-y-6 relative z-10">
                {devTimeline.map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-[3px] border-card shadow-sm z-10 ${item.color}`}
                    >
                      <item.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 pb-1 pt-1.5">
                      <div className="font-bold text-[13px] text-slate-900 dark:text-white leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors cursor-pointer">
                        {item.title}
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-1">
                        {item.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="ghost"
                className="w-full mt-6 font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-50 dark:bg-slate-900/50 h-10 border border-slate-100 dark:border-slate-800"
              >
                Show More Activity
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
