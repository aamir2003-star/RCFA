import React from "react";
import { Button } from "../ui/Button.jsx";
import {
  Download,
  Plus,
  Settings,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Sparkles,
} from "lucide-react";
import { pmStats, pmProjects, quickActions } from "../../lib/features_utils.js";
import { useNavigate } from "react-router-dom";

export default function PmDashboard() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-8 w-full max-w-full pb-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-[#1e2532] dark:text-white">
            Welcome back, Alex
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Here is the conflict resolution status for your 8 active projects.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            className="h-10 text-slate-700 dark:text-slate-300 font-bold border-slate-200 dark:border-slate-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button
            onClick={() => navigate("/pm/create-project")}
            className="h-10 bg-[#1e2532] hover:bg-slate-800 dark:text-slate-700 text-white font-bold shadow-sm transition-all focus:ring-[#1e2532]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Project
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {pmStats.map((stat, i) => (
          <div
            key={i}
            className={`bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-slate-200/20 dark:shadow-none border border-slate-200 dark:border-slate-800 relative overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300 ${
              stat.borderLeft || ""
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.bg} ${stat.iconColor}`}
              >
                <stat.icon className="w-4.5 h-4.5" />
              </div>
              <div
                className={`text-xs font-bold flex items-center ${
                  stat.trendUp ? "text-emerald-500" : "text-red-500"
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
            <button className="text-sm font-bold text-slate-500 hover:text-[#1e2532] transition-colors">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {pmProjects.map((proj, i) => (
              <div
                key={i}
                className="group bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 shadow-lg shadow-slate-200/20 dark:shadow-none hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/40 dark:hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm ${proj.icon.bg}`}
                >
                  <proj.icon.element className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-[15px] text-[#1e2532] dark:text-white truncate">
                      {proj.title}
                    </h3>
                    <span
                      className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${proj.statusColor}`}
                    >
                      {proj.statusBadge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-semibold truncate">
                    {proj.updatedInfo}
                  </p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-6 sm:gap-10 mt-4 sm:mt-0 shrink-0">
                  {/* Avatars */}
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white dark:border-slate-900 z-30 shadow-sm overflow-hidden flex items-center justify-center">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWGrSkglnUuO7mfsuE9YxIHoRPRwkPOc18z-CDFrsbRyABDgDyo_p2iTSMvpIttuSHtAiE68SE4JfT1ZdaITA6mnv6wCBB5iIDjPKd46nEiU1CkHW4JIMcpsAS_81mAqg7Nbyu4EqIPy_CoosmUoo9MUijDXDFXXIZ7ZJIokYtbehOd5rZ2oTSiSOyMQBIL1Jba6cWgJb2oqG8lpmbwwxnmWcOFsqcVRDqDpfB_Xi2Y92wuRq41NBVH8PqYmCwx-kgrwBOvCeJ2Ac"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {proj.avatars > 1 && (
                      <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white dark:border-slate-900 z-20 shadow-sm overflow-hidden flex items-center justify-center">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDc2NOVjwO2-DyyUZKL6nQWJCIPoCTf6X_yQOxetpWDDffaz0RkO80r9sc4qvjwWoQT4MSp5pwzPBSG8wdeyneBA69Jbd51SCqXI6d1fZBi_pE1hj8iB5W3Je94ozDQeSJyRJui-Y2LqUEKWaj3Vg_IxMW6fJ6qLLD5uTuErFO-wEJlXThyidueRTP9YjBMXJA2fOYSrZRFOO6iSHYfk0hBlWQD2U7kpfta7ap4kN55E2FEHbYujPTneWUggwkz22px5uHexBGTwbw"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {proj.avatars > 2 && (
                      <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white dark:border-slate-900 z-15 shadow-sm overflow-hidden flex items-center justify-center">
                        <img
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuD23eRDEqIZvpkJtRyjAwjX5duyqqlPD17S3TDvVk0gQ4W2ZyLtoNIp3nNzH2fOhTxo8RR7rhD4MLW-_vO40PAsJ8vynSstV2jmXJ_aKlq2xQoA2gMZv-IZQ3YMuGz0m523w7YB-ElDARfOQl-3mvIE_rJZwa7mRn9W4CNMUnVXD8jQWFlgayEumwUnrua5cuUnEeYMhVtZ83yziU1TJDWkBEWSp2StnUz4FUDisdsIVxRwAGobQBF3dpWDveHhBxbe2u6wGvE04yU"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    {proj.extraAvatars > 0 && (
                      <div className="w-8 h-8 rounded-full bg-[#1e2532] text-white border-2 border-white dark:border-slate-900 z-10 flex items-center justify-center text-[11px] font-bold shadow-sm">
                        +{proj.extraAvatars}
                      </div>
                    )}
                  </div>
                  {/* Progress bar */}
                  <div className="w-24 sm:w-32 flex flex-col gap-1.5">
                    <div className="flex justify-end text-[11px] font-bold text-[#1e2532] dark:text-slate-300">
                      {proj.progress}%
                    </div>
                    <div className="w-full h-[6px] bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${proj.progressColor}`}
                        style={{ width: `${proj.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-indigo-500/5 hover:-translate-y-0.5 group ${action.bg}`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                    action.iconBg
                  } ${
                    action.isDark
                      ? "text-white"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  <action.icon className="w-5 h-5" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <div
                    className={`font-bold text-sm ${
                      action.isDark
                        ? "text-white"
                        : "text-[#1e2532] dark:text-white"
                    } truncate`}
                  >
                    {action.title}
                  </div>
                  <div
                    className={`text-xs mt-0.5 truncate font-semibold ${
                      action.isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {action.desc}
                  </div>
                </div>
                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1 ${
                    action.isDark ? "text-slate-400" : "text-slate-300"
                  }`}
                />
              </button>
            ))}
          </div>

          {/* AI Insight Premium Card */}
          <div className="bg-linear-to-br from-[#1e2532] to-slate-900 rounded-2xl p-6 relative overflow-hidden text-white shadow-2xl shadow-indigo-500/20 mt-6 border border-indigo-500/20 group hover:-translate-y-1 hover:shadow-indigo-500/30 transition-all duration-300">
            <Settings className="absolute -right-6 -bottom-6 w-40 h-40 opacity-[0.05] text-white group-hover:rotate-45 transition-transform duration-700" />
            <div className="flex items-center gap-2 mb-4 relative z-10">
              <Sparkles className="w-4 h-4 text-slate-300" />
              <h3 className="font-bold text-sm tracking-wide text-slate-100">
                AI Insight
              </h3>
            </div>
            <p className="text-[13px] text-slate-300 mb-6 relative z-10 leading-relaxed font-medium">
              "High risk of overlap detected in the 'Payment Module' between
              FinTech Revamp and E-Commerce AI. Suggesting a shared
              authentication service to resolve 4 potential conflicts."
            </p>
            <Button className="w-full bg-slate-700/50 hover:bg-slate-700 text-slate-100 border border-slate-600/50 shadow-sm transition-all relative z-10 font-bold py-2 h-10 text-xs tracking-wide">
              Apply Suggestion
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
