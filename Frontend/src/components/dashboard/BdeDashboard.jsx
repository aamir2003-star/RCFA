import React, { useEffect } from "react";
import { Button } from "../ui/Button.jsx";
import { Plus, ChevronRight, MoreHorizontal, ArrowUpRight, Folder } from "lucide-react";
import { bdeStats } from "../../lib/features_utils.js";
import { useNavigate } from "react-router-dom";
import useProjectStore from "../../stores/useProjectStore";

export default function BdeDashboard() {
  const navigate = useNavigate();
  const { projects, fetchProjects, setCurrentProject, loading } = useProjectStore();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectClick = (project) => {
    setCurrentProject(project);
    navigate("/pm/workspace"); // Or a BDE specific project view if exists
  };

  return (
    <div className="flex flex-col gap-8 w-full pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-white">
            Active Projects {loading && <span className="text-xs font-normal animate-pulse">(Syncing...)</span>}
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Real-time status of cross-team resource allocations and conflicts.
          </p>
        </div>
        <Button
          onClick={() => navigate("/bde/projects")}
          className="h-10 bg-[#1e2532] hover:bg-slate-800 dark:bg-slate-700 text-white font-bold shadow-sm transition-all focus:ring-[#1e2532]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Project
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {bdeStats.map((stat, i) => (
          <div
            key={i}
            className="bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl p-5 shadow-lg shadow-slate-200/20 dark:shadow-none border border-slate-200 dark:border-slate-800 flex flex-col justify-between hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                {stat.title}
              </span>
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${stat.color}`}
              >
                <stat.icon className="w-4.5 h-4.5" />
              </div>
            </div>
            <div>
              <div className="flex items-end gap-2 mb-1">
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">
                  {stat.value}
                </div>
                {!stat.isProgress && (
                  <span
                    className={`text-[11px] font-bold mb-0.5 ${stat.subtextColor}`}
                  >
                    {stat.subtext}
                  </span>
                )}
              </div>
              {stat.isProgress && (
                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-3">
                  <div
                    className="h-full bg-slate-800 dark:bg-slate-300 rounded-full"
                    style={{ width: stat.value }}
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            Dynamic Projects{" "}
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-0.5 rounded-full font-semibold border border-slate-200 dark:border-slate-700">
              {projects?.length || 0}
            </span>
          </h2>
          <Button
            variant="ghost"
            className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
          >
            Refresh List <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects?.map((proj) => (
            <div
              key={proj._id}
              onClick={() => handleProjectClick(proj)}
              className="group bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl shadow-lg shadow-slate-200/20 dark:shadow-none border border-slate-200 dark:border-slate-800 p-5 flex flex-col hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                  <Folder className="w-5 h-5" />
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-100">
                  Active
                </span>
              </div>

              <h3 className="font-bold text-slate-900 dark:text-white text-[17px] mb-2">
                {proj.name}
              </h3>
              <p className="text-sm text-slate-500 font-medium mb-6 flex-1 line-clamp-2 leading-relaxed">
                {proj.description || "No description provided."}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <div className="text-[10px] font-bold text-slate-400 uppercase">
                  Created {new Date(proj.createdAt).toLocaleDateString()}
                </div>
                <div className="w-24 flex flex-col gap-1.5">
                  <div className="flex justify-end text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    HEALTH
                    <span className="text-emerald-500 ml-2 text-xs">95%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500 w-[95%]" />
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* New Project CTA Card */}
          <div
            onClick={() => navigate("/bde/create-project")}
            className="bg-slate-50/50 dark:bg-[#080b11]/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-5 flex flex-col items-center justify-center text-center hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 min-h-[220px] cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3 shadow-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:scale-110 transition-all">
              <Plus className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">
              Add Project
            </h3>
            <p className="text-[13px] text-slate-500 mt-1 font-medium">
              Start tracking a new initiative
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
