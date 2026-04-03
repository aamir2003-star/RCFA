import React, { useEffect } from "react";
import { toast } from "react-hot-toast";
import { Button } from "../ui/Button.jsx";
import { Plus, ChevronRight, MoreHorizontal, ArrowUpRight, Folder, Layout, Users, FileText, AlertCircle, Inbox, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useProjectStore from "../../stores/useProjectStore";
import { BDE_STATS_TEMPLATE, PROJECT_STATUS_COLORS } from "../../constants/dashboard";

export default function BdeDashboard() {
  const navigate = useNavigate();
  const {
    projects,
    fetchProjects,
    deleteProject,
    setCurrentProject,
    bdeStats,
    fetchBdeStats,
    loading,
    error: storeError
  } = useProjectStore();

  useEffect(() => {
    fetchProjects();
    fetchBdeStats();
  }, [fetchProjects, fetchBdeStats]);

  const handleProjectClick = (project) => {
    setCurrentProject(project);
    navigate(`/bde/analytics?projectId=${project._id}`);
  };

  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      const result = await deleteProject(projectId);
      if (result.success) {
        toast.success("Project deleted successfully");
        fetchBdeStats(); // Refresh stats after deletion
      } else {
        toast.error("Failed to delete project: " + result.message);
      }
    }
  };

  const statsConfig = BDE_STATS_TEMPLATE.map(stat => ({
    ...stat,
    value: bdeStats?.[stat.key] || 0
  }));

  const hasProjects = projects && projects.length > 0;

  return (
    <div className="flex flex-col gap-8 w-full pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight text-slate-900 dark:text-white">
            Business Dashboard {loading && <span className="text-xs font-normal animate-pulse">(Syncing...)</span>}
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Overview of your project portfolio and client engagements.
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
        {statsConfig.map((stat, i) => (
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
            Recent Projects{" "}
            {hasProjects && (
              <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs px-2 py-0.5 rounded-full font-semibold border border-slate-200 dark:border-slate-700">
                {projects.length}
              </span>
            )}
          </h2>
          {hasProjects && (
            <Button
              variant="ghost"
              onClick={() => fetchProjects()}
              className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
            >
              Refresh List <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>

        {hasProjects ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {projects.map((proj) => (
              <div
                key={proj._id}
                onClick={() => handleProjectClick(proj)}
                className="group bg-white/80 dark:bg-[#0f1115]/80 backdrop-blur-md rounded-2xl shadow-lg shadow-slate-200/20 dark:shadow-none border border-slate-200 dark:border-slate-800 p-5 flex flex-col hover:shadow-xl hover:shadow-indigo-500/10 hover:border-indigo-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                    <Folder className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${PROJECT_STATUS_COLORS[proj.status] || PROJECT_STATUS_COLORS.default}`}>
                      {proj.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/bde/editor?projectId=${proj._id}`);
                      }}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-colors"
                      title="Manage Requirements"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteProject(e, proj._id)}
                      className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 dark:text-white text-[17px] mb-2 leading-snug">
                  {proj.name}
                </h3>
                <p className="text-sm text-slate-500 font-medium mb-6 flex-1 line-clamp-2 leading-relaxed">
                  {proj.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between mb-4 px-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Requirements</span>
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{proj.requirementCount || 0}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Conflicts</span>
                    <span className={`text-sm font-bold ${proj.conflictCount > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                      {proj.conflictCount || 0}
                    </span>
                  </div>
                </div>

                <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${(proj.conflictCount || 0) === 0 ? 'bg-emerald-500 w-full' :
                      (proj.conflictCount || 0) < 3 ? 'bg-amber-400 w-[75%]' :
                        'bg-rose-500 w-[45%]'
                      }`}
                  />
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                    Created {new Date(proj.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex -space-x-2">
                    {proj.team && proj.team.length > 0 ? (
                      proj.team.slice(0, 3).map((member, i) => (
                        <div
                          key={member._id || i}
                          className="w-7 h-7 rounded-full border-2 border-white dark:border-[#0f1115] bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                          title={member.name}
                        >
                          {member.name?.charAt(0) || '?'}
                        </div>
                      ))
                    ) : (
                      <div className="w-7 h-7 rounded-full border-2 border-white dark:border-[#0f1115] bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-400">
                        ?
                      </div>
                    )}
                    {proj.team?.length > 3 && (
                      <div className="w-7 h-7 rounded-full border-2 border-white dark:border-[#0f1115] bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[9px] font-bold text-slate-600 dark:text-slate-300 shadow-sm">
                        +{proj.team.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* New Project CTA Card */}
            <div
              onClick={() => navigate("/bde/projects")}
              className="bg-slate-50/50 dark:bg-[#080b11]/50 backdrop-blur-sm rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-700 p-5 flex flex-col items-center justify-center text-center hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-300 min-h-[220px] cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 mb-3 shadow-sm group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:scale-110 transition-all">
                <Plus className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-[15px]">
                Add Project
              </h3>
              <p className="text-[13px] text-slate-500 mt-1 font-medium px-4">
                Initialize a new project and start conflict analysis.
              </p>
            </div>
          </div>
        ) : !loading && (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white/50 dark:bg-[#0f1115]/50 backdrop-blur-sm rounded-3xl border border-slate-200 dark:border-slate-800 text-center">
            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6">
              <Inbox className="w-10 h-10 text-indigo-500 opacity-50" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No Projects Found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-8 font-medium">
              You haven't initialized any projects yet. Start by creating a project to leverage Spectra AI's conflict detection.
            </p>
            <Button
              onClick={() => navigate("/bde/projects")}
              className="px-8 py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-5 h-5 mr-2" />
              Get Started Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
